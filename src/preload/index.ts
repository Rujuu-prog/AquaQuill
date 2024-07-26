import { contextBridge, ipcRenderer } from 'electron'
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
      saveFile: async (data, filePath) => {
        const result = await ipcRenderer.invoke('save-file', data, filePath)
        return result
      },
      onSaveRequest: (callback) => ipcRenderer.on('save-request', callback),
      onFileSaved: (callback) => ipcRenderer.on('file-saved', callback),
      onNewTabRequested: (callback) => ipcRenderer.on('create-new-tab', callback),
      onNextTabRequested: (callback) => ipcRenderer.on('next-tab', callback),
      onPreviousTabRequested: (callback) => ipcRenderer.on('previous-tab', callback),
      onFileOpen: (callback) => ipcRenderer.on('file-open', callback),
      removeSaveRequestListener: (callback) => ipcRenderer.removeListener('save-request', callback),
      removeNewTabRequestListener: (callback) =>
        ipcRenderer.removeListener('create-new-tab', callback),
      removeFileOpenListener: (callback) => ipcRenderer.removeListener('file-open', callback)
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
