export default function extractFileName(filePath: string): string | undefined {
  // バックスラッシュをスラッシュに変換して、どのOSのパス形式にも対応
  const normalizedPath = filePath.replace(/\\/g, '/')
  return normalizedPath.split('/').pop() || undefined
}
