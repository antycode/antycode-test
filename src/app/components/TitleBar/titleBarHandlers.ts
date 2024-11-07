import { ipcRenderer } from 'electron';

export function minimizeApp() {
  ipcRenderer.send('minimizeApp');
}

export function maximizeApp() {
  ipcRenderer.send('maximizeApp');
}

export function closeApp() {
  ipcRenderer.send('closeApp');
}
