import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../const/router';

const useApplicationUpdate = () => {
  const [progress, setProgress] = useState(0);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Загрузка...');
  const navigate = useNavigate();
  const url = process.env.VITE_DEV_SERVER_URL;

  useEffect(() => {
    if (url) {
      return;
    }

    ipcRenderer.on('checking-for-update', () => {
      setStatusMessage('Проверка обновлений...');
      console.log('checking-for-update')
    });

    ipcRenderer.on('update-available', (_, info) => {
      navigate(AppRoutes.LoadingUpdate);
      setStatusMessage(`Загрузка обновления: версия ${info.version}`);
      console.log('Загрузка обновления')
      setUpdateAvailable(true);
    });

    ipcRenderer.on('update-not-available', () => {
      navigate('/');
    });

    ipcRenderer.on('update-progress', (_, percent) => {
      setProgress(Math.round(percent));
    });
    ipcRenderer.on('error', (_, error) => {
      console.log('error update', error);
      if (
        error.message.includes('Cannot find latest.yml') ||
        error.message.includes('Cannot find latest-mac.yml')
      ) {
        navigate('/');
      } else {
        setStatusMessage('Произошла ошибка при загрузке обновления.');
      }
    });
    return () => {
      ipcRenderer.removeAllListeners('checking-for-update');
      ipcRenderer.removeAllListeners('update-available');
      ipcRenderer.removeAllListeners('update-not-available');
      ipcRenderer.removeAllListeners('update-progress');
    };
  }, [navigate]);

  return { progress, updateAvailable, statusMessage };
};

export default useApplicationUpdate;
