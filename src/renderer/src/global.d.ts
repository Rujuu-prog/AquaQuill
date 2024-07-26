// Copyright (c) 2024 Rujuu
// This software is released under the MIT License, see LICENSE.

export interface IElectronAPI {
  openFileDialog: () => Promise<{ filePath: string; data: string } | null>
  saveFile: (data: string, filePath?: string) => Promise<string | undefined>
  onSaveRequest: (callback: () => void) => void
  onFileSaved: (callback: (_e: Electron.IpcRendererEvent, savedFilePath: string) => void) => void
  onNewTabRequested: (callback: () => void) => void
  onNextTabRequested: (callback: () => void) => void
  onPreviousTabRequested: (callback: () => void) => void
  onFileOpen: (
    callback: (_e: Electron.IpcRendererEvent, filePath: string, data: string) => void
  ) => void
  removeSaveRequestListener: (callback: () => void) => void
  removeNewTabRequestListener: (callback: () => void) => void
  removeFileOpenListener: (
    callback: (_e: Electron.IpcRendererEvent, filePath: string, data: string) => void
  ) => void
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
