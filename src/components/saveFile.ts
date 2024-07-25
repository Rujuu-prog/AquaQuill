// Copyright (c) 2024 Rujuu
// This software is released under the MIT License, see LICENSE.
import { dialog, BrowserWindow } from 'electron'
import * as fs from 'fs'
import { promisify } from 'util'

const writeFileAsync = promisify(fs.writeFile)

export async function saveFile(
  win: BrowserWindow,
  data: string,
  filePath?: string
): Promise<string | undefined> {
  let file = filePath
  if (!file) {
    const { canceled, filePath: chosenPath } = await dialog.showSaveDialog(win, {
      title: 'Save Markdown File', // 保存ダイアログのタイトル
      buttonLabel: 'Save', // 保存ボタンのラベル
      filters: [
        {
          name: 'Markdown Files', // ユーザーに表示されるファイルの種類の説明
          extensions: ['md'] // 許可するファイルの拡張子
        }
      ]
    })
    if (canceled || !chosenPath) return undefined
    // ユーザーが拡張子を指定しない場合に`.md`を追加
    file = chosenPath.endsWith('.md') ? chosenPath : `${chosenPath}.md`
  }

  await writeFileAsync(file, data)
  // ファイルが保存されたことをレンダラープロセスにファイルパスを渡して通知
  win.webContents.send('file-saved', file)
  return file
}
