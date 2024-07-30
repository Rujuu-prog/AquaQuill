import TurndownService from 'turndown'

const turndownService = new TurndownService()

export default function htmlToMarkdown(html: string): string {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return turndownService.turndown(tempDiv.innerHTML)
}
