import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', {
      openFileDialog: (listener: (_e: IpcRendererEvent, filepath: string, data: string) => void) =>
        ipcRenderer.on('menu-open', listener),
      saveFile: (data: string, filePath?: string) =>
        ipcRenderer.invoke('save-file', data, filePath),
      onSaveRequest: (callback: any) => ipcRenderer.on('save-request', callback),
      onFileSaved: (callback: any) => ipcRenderer.on('file-saved', callback),
      onNewTabRequested: (callback: any) => ipcRenderer.on('create-new-tab', callback),
      onNextTabRequested: (callback: any) => ipcRenderer.on('next-tab', callback),
      onPreviousTabRequested: (callback: any) => ipcRenderer.on('previous-tab', callback)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
