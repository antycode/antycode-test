import { BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater'; 
import dotenv from "dotenv";

dotenv.config()

const GH_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

interface CustomGithubOptions {
  provider: 'github';
  owner: string;
  repo: string;
  token: string;
}

export function startUpdate(win: BrowserWindow, log?: any) {
  if (!GH_TOKEN) {
    log?.info('GH_TOKEN is empty');
    return;
  }

  const updateConfig: CustomGithubOptions = {
    provider: 'github',
    owner: 'antycode',
    repo: 'antycode-test',
    token: GH_TOKEN,
  };

  autoUpdater.setFeedURL(updateConfig);

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
  
  autoUpdater.on('update-available', (info) => {
    log.info('update-available', info)
    win.webContents.send('update-available', info);
  });
  
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