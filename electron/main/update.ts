import { BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater'; 

export function startUpdate (win: BrowserWindow, log?:any) {
  autoUpdater.on('checking-for-update', () => {
    log.info('checking-for-update')
    win.webContents.send('checking-for-update');
  });
  autoUpdater.on('update-not-available', () => {
    log.info('update-not-available')
    win.webContents.send('update-not-available');
  });
  autoUpdater.on('download-progress', (progressTrack) => {
    log.info('download-progress', progressTrack)
    win.webContents.send('update-progress', progressTrack.percent);
  });
  
  autoUpdater.on('update-available', async (info) => {
    log.info('update-available', info)
    const { response } = await dialog.showMessageBox(win, {
      type: 'info',
      buttons: ['Да', 'Нет'],
      defaultId: 0,
      cancelId: 1,
      title: 'Доступно обновление',
      message: `Новая версия ${info.version} доступна. Хотите скачать и установить её?`,
    })

    // Если пользователь согласен, начинаем загрузку обновления
    if (response === 0) {  // Нажата кнопка "Да"
      autoUpdater.downloadUpdate()
      win.webContents.send('download-started')
    } else {
      win.webContents.send('update-declined')
    }
  })
  autoUpdater.on('error', async (error) => {
     await dialog.showMessageBox(win, {
      type: 'info',
      defaultId: 0,
      cancelId: 1,
      title: 'Ошибка',
      message: `Произошла ошибка ${error}`,
    })

    log.info('error', error)
    win.webContents.send('error', error);
  });
  
  autoUpdater.on('update-downloaded', () => {
    log.info('update-downloaded')
    autoUpdater.quitAndInstall(true, true);
  })
  autoUpdater.checkForUpdatesAndNotify();
}