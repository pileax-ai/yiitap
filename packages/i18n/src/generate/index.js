import fs from 'node:fs'
import googleTranslateApi from '@vitalets/google-translate-api'
import bingTranslateApi from 'bing-translate-api'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { HttpProxyAgent } from 'http-proxy-agent'
import languages from './config/languages.json' with { type: 'json' }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const agent = new HttpProxyAgent('http://127.0.0.1:7890')

const ARGS = parseArgs(process.argv)

const TRANSLATOR = 'google'
const BASE_LANG = ARGS.base || 'en-US'
const MANUAL_LANGS = ['en-US', 'zh-Hans']
const TARGET_LANGS = languages.filter(
  (item) => item.supported && item.base === BASE_LANG
)

const LOCALE_DIR = path.join(__dirname, '../messages')
const BASE_LANG_FILE = path.join(LOCALE_DIR, `${BASE_LANG}.ts`)
const META_DIR = path.join(__dirname, 'meta')
const BASE_META_FILE = path.join(META_DIR, `${BASE_LANG}.meta.json`)

// ==================================================
// Utility
// ==================================================
function parseArgs(argv) {
  const args = {}
  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--')) {
      const [key, val] = arg.slice(2).split('=')
      args[key] = val === undefined ? true : val
    }
  }
  return args
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function hashText(text) {
  return crypto.createHash('md5').update(text).digest('hex').slice(0, 8)
}

function getLanguageKey(lang) {
  if (lang === 'zh-Hans' || lang === 'zh-Hant') {
    return lang
  } else {
    return lang.split('-')[0]
  }
}

function sortDeep(obj) {
  if (typeof obj !== 'object' || obj === null) return obj
  if (Array.isArray(obj)) return obj.map(sortDeep)

  return Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, key) => {
      acc[key] = sortDeep(obj[key])
      return acc
    }, {})
}

function sortJsonKeys(jsonFile) {
  if (!fs.existsSync(jsonFile)) {
    return
  }

  // sort keys
  const json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'))
  const sorted = sortDeep(json)
  fs.writeFileSync(jsonFile, JSON.stringify(sorted, null, 2), 'utf8')

  console.log('⛵ Sorted keys:', jsonFile)
}

// ==================================================
// Load/Write ts files
// ==================================================
function loadTsObject(filePath) {
  const code = fs.readFileSync(filePath, 'utf8')
  const match = code.match(/export\s+default\s+({[\s\S]*})\s*$/)

  if (!match) {
    throw new Error(`Invalid i18n ts file format: ${filePath}`)
  }

  return eval(`(${match[1]})`)
}

function writeTsFile(filePath, data) {
  const content = `export default ${serializeToTs(sortDeep(data), 2)}
`
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
}

function serializeToTs(obj, indent = 2, level = 0) {
  const pad = ' '.repeat(indent * level)
  const padInner = ' '.repeat(indent * (level + 1))

  if (typeof obj === 'string') {
    return `'${obj.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'
    return `[\n${obj
      .map((v) => `${padInner}${serializeToTs(v, indent, level + 1)}`)
      .join(',\n')}\n${pad}]`
  }

  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj)
    if (entries.length === 0) return '{}'

    return `{\n${entries
      .map(([key, val]) => {
        return `${padInner}${key}: ${serializeToTs(val, indent, level + 1)}`
      })
      .join(',\n')}\n${pad}}`
  }

  // number / boolean / null
  return String(obj)
}

// ==================================================
// Translate
// ==================================================
async function translateText(text, lang) {
  console.log(`➡️ Translating (${lang.value}): ${text}`)
  await sleep(200 + Math.random() * 600)

  switch (TRANSLATOR) {
    case 'bing':
      return bintTranslate(text, lang)
    default:
      return googleTranslate(text, lang)
  }
}

async function googleTranslate(text, lang) {
  try {
    const res = await googleTranslateApi.translate(text, {
      to: lang.value,
      fetchOptions: { agent },
    })
    return res.text
  } catch (err) {
    console.error(`❌ Translation failed：`, err.message)
    return text // Return original text if failed
  }
}

async function bintTranslate(text, lang) {
  try {
    const res = await bingTranslateApi.translate(
      text,
      getLanguageKey(BASE_LANG),
      getLanguageKey(lang.value)
    )
    return res.translation
  } catch (err) {
    console.error(`❌ Translation failed：`, err.message)
    return text // Return original text if failed
  }
}

// ==================================================
// Sync removed key
// ==================================================
function pruneRemovedKeys(baseObj, targetObj, metaObj, parentKey = '') {
  if (typeof targetObj !== 'object' || targetObj === null) {
    return targetObj
  }

  const result = Array.isArray(targetObj) ? [] : {}

  for (const key in targetObj) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key
    const existsInBase = baseObj && key in baseObj
    const manual = metaObj?.[fullKey]?.manual

    // ❌ base deleted
    if (!existsInBase) {
      if (manual) {
        result[key] = targetObj[key]
        console.log(`🛑 Keep manual key: ${fullKey}`)
      } else {
        console.log(`🗑 Remove key: ${fullKey}`)
        delete metaObj[fullKey]
      }
      continue
    }

    const baseVal = baseObj[key]
    const targetVal = targetObj[key]

    if (
      typeof baseVal === 'object' &&
      baseVal !== null &&
      typeof targetVal === 'object'
    ) {
      const pruned = pruneRemovedKeys(baseVal, targetVal, metaObj, fullKey)

      // Blank object
      if (
        typeof pruned === 'object' &&
        pruned !== null &&
        Object.keys(pruned).length === 0
      ) {
        delete metaObj[fullKey]
      } else {
        result[key] = pruned
      }
    } else {
      result[key] = targetVal
    }
  }

  return result
}

function pruneMetaByBase(baseObj, metaObj, parentKey = '') {
  for (const key in metaObj) {
    const path = key.split('.')
    let cur = baseObj

    for (const p of path) {
      if (!cur || !(p in cur)) {
        console.log(`🧹 Remove stale meta: ${key}`)
        delete metaObj[key]
        break
      }
      cur = cur[p]
    }
  }
}

// ==================================================
// Fill Translation
// ==================================================
let baseMeta = {}

function loadBaseMeta() {
  if (fs.existsSync(BASE_META_FILE)) {
    baseMeta = JSON.parse(fs.readFileSync(BASE_META_FILE, 'utf8'))
  }
}

async function fillTranslations(
  baseObj,
  targetObj,
  metaObj,
  lang,
  updatedList,
  parentKey = ''
) {
  const result = { ...targetObj }

  for (const key in baseObj) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key
    const baseVal = baseObj[key]
    const targetVal = targetObj?.[key]

    if (typeof baseVal === 'string') {
      const currentHash = hashText(baseVal)
      const oldHash = baseMeta[fullKey]
      const manual = metaObj[fullKey]?.manual
      const manualUpdate = targetVal && manual
      const needUpdate = !targetVal || oldHash !== currentHash

      // missing OR changed
      if (manualUpdate) {
        // ignore
        console.log(`👉🏼 Manual: ${fullKey} → ${targetVal}`)
      } else if (needUpdate) {
        const translated = await translateText(baseVal, lang)
        result[key] = translated

        updatedList.push({
          key: fullKey,
          from: baseVal,
          to: translated,
        })
      }

      // Update meta hash
      baseMeta[fullKey] = currentHash
    } else if (typeof baseVal === 'object' && baseVal !== null) {
      result[key] = await fillTranslations(
        baseVal,
        targetVal || {},
        metaObj,
        lang,
        updatedList,
        fullKey
      )
    }
  }

  return result
}

// ==================================================
// Main process
// ==================================================
function sortBaseFiles() {
  if (!fs.existsSync(BASE_LANG_FILE)) return

  const obj = loadTsObject(BASE_LANG_FILE)
  const sortedObj = sortDeep(obj)
  writeTsFile(BASE_LANG_FILE, sortedObj)
  console.log(`⛵ Sorted base file: ${BASE_LANG_FILE}`)
}

function prepare() {
  sortBaseFiles()
  sortJsonKeys(BASE_META_FILE)
  loadBaseMeta()
}

async function main() {
  // prepare
  prepare()

  // translate
  console.log(`📌 Translator: ${TRANSLATOR}`)
  console.log(`📌 Base language: ${BASE_LANG}`)
  console.log(
    `📌 Target languages: ${TARGET_LANGS.map((item) => item.value).join(', ')}`
  )
  console.log('')

  const baseObj = loadTsObject(BASE_LANG_FILE)
  for (const lang of TARGET_LANGS) {
    console.log('============================================================')

    if (MANUAL_LANGS.includes(lang.value)) {
      console.log(`👉🏻 Translate manually → ${lang.value} | ${lang.prompt_name}`)
      continue
    }

    console.log(`🌍 Translating → ${lang.value} | ${lang.prompt_name}`)

    // Target lang dir
    const targetFile = path.join(LOCALE_DIR, `${lang.value}.ts`)
    const targetObj = fs.existsSync(targetFile) ? loadTsObject(targetFile) : {}

    // Target lang meta
    const langMetaFile = path.join(META_DIR, `${lang.value}.meta.json`)
    const metaObj = fs.existsSync(langMetaFile)
      ? JSON.parse(fs.readFileSync(langMetaFile, 'utf8'))
      : {}

    // Translate
    const updatedList = []
    const filled = await fillTranslations(
      baseObj,
      targetObj,
      metaObj,
      lang,
      updatedList,
      ''
    )

    // Clean removed
    const cleaned = pruneRemovedKeys(baseObj, filled, metaObj, '')

    writeTsFile(targetFile, cleaned)

    if (updatedList.length) {
      console.log(`🔄 ${targetFile}: ${updatedList.length} updated`)
    } else {
      console.log(`✨ ${targetFile}: up to date`)
    }

    console.log('============================================================')
    console.log('')
  }

  // Save meta file
  pruneMetaByBase(baseObj, baseMeta)
  fs.mkdirSync(META_DIR, { recursive: true })
  fs.writeFileSync(BASE_META_FILE, JSON.stringify(baseMeta, null, 2), 'utf8')
  console.log(`📝 Updated meta: ${BASE_META_FILE}`)

  console.log('')
  console.log('🎉 All languages have been updated completely!')
}

main().catch(console.error)
