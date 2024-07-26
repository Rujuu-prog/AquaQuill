import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

export default function htmlToMarkdown(html: string): string {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  const textContent = tempDiv.textContent || tempDiv.innerText || ''
  return md.renderInline(textContent)
}
