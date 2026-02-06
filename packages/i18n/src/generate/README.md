# i18n generate

## generate
```shell
node i18n/src/generate/index.js
node i18n/src/generate/index.js --base=zh-Hans

# or
pnpm i18n-generate
pnpm i18n-generate-zh
```

## All Languages
All languages defined in `config/language.json`:

- label: Display name in UI
- value: language tag (IETF)
- locale: Locale (Used for locale, dayjs, etc.)
- prompt_name: Prompt name
- supported: Supported or not
- generate: Auto generate or not

### Add new language
1. Add new language item in `i18n/src/generate/config/language.json`
2. Generate by `pnpm i18n-generate`

### Links

- [IETF language tag](https://www.venea.net/web/culture-code)
