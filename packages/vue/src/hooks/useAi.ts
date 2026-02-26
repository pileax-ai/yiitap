import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  breaks: true,
})

export default function () {
  return {
    md,
  }
}
