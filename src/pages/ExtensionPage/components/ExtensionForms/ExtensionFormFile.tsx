import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ReactComponent as ImportIcon } from '@/shared/assets/icons/import-2.svg';
import cls from '../ExtensionPageHeader/ExtensionPageHeader.module.scss';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/Button';
import { ipcRenderer } from 'electron';
import clsx from 'clsx';
import { fetchData } from '@/shared/config/fetch';

interface IExtensionFormFile {
  modalClose: () => void;
  setFile: Dispatch<SetStateAction<File | null>>;
  getExtensions: (page?: number) => void;
  setActivePages: Dispatch<SetStateAction<number[]>>;
  fileName: string;
  setFileName: Dispatch<SetStateAction<string>>;
  file: File | null;
}

const ExtensionFormFile = ({
  modalClose,
  setFile,
  file,
  getExtensions,
  setActivePages,
  fileName,
  setFileName,
}: IExtensionFormFile) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [drag, setDrag] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileNameWithoutExtension = selectedFile.name.replace(/\.zip$/, '');
      setFileName(fileNameWithoutExtension);
      event.target.value = ''
    }
  };

  const handleFileDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files?.[0];
    setDrag(false);
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(true);
  };

  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
  };

  const downloadInBucket = async (event: React.FormEvent) => {
    event.preventDefault();
    if (file) {
      setError(false);
    } else {
      console.log('File not available');
      setError(true);
      return;
    }
    setIsLoading(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const uploadResponse = await ipcRenderer.invoke(
        'upload-file-to-bucket',
        fileBuffer,
        fileName,
      );
      if (!uploadResponse) {
        console.error('Error during file upload to bucket: No response');
        setError(true);
        return;
      }
      await createExtension(uploadResponse);
    } catch (error) {
      console.error('Error during extension upload:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createFileExtension = async (extensionId: string) => {
    const fileBuffer = await file?.arrayBuffer();
    const response = await ipcRenderer.invoke(
      'download-extension-by-file',
      fileBuffer,
      extensionId,
    );
    if (response.success) {
      console.log('Extension uploaded and extracted successfully');
      modalClose();
    } else {
      console.error('Error:', response.error);
    }
  };

  const createExtension = async (mediaLink: string) => {
    const teamId = localStorage.getItem('teamId');
    const extensionUrl = '/profile/extension';
    setError(false);
    setIsLoading(true);
    const iconUrl =
      'https://lh3.googleusercontent.com/7bzB7r3hq4iuhk8YbeFLYjQyqlsRZxssEBQR0daAEmwEeCUlIdVs7AwcxDn6ap1ybIpXokw368nc_DKxQjL2va9XUT4=s60';
    try {
      const trimmedTitle = fileName.length > 200 ? fileName.substring(0, 200) : fileName;
      const response = await fetchData({
        url: extensionUrl,
        method: 'POST',
        data: { title: trimmedTitle, url: mediaLink, logo: iconUrl, is_public: false },
        team: teamId,
      });
      const externalId = response?.data.external_id;
      if (externalId !== undefined) {
        await createFileExtension(externalId);
      } else {
        console.error('externalId not found');
        return;
      }
      getExtensions();
      setActivePages([1]);
      modalClose();
    } catch (error) {
      console.error('Failed to create extension:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (file) {
      setError(false);
    }
  }, [file]);

  return (
    <form onSubmit={downloadInBucket} className={cls.tabContentWrapper}>
      <div className={cls.tabContent}>
        <div
          className={clsx(cls.fileUploadContainer, {
            [cls.fileUploadContainerDrag]: drag,
            [cls.fileUploadContainerError]: error,
          })}
          onDragStart={(e) => dragStartHandler(e)}
          onDragLeave={(e) => dragLeaveHandler(e)}
          onDragOver={(e) => dragStartHandler(e)}
          onDrop={(e) => handleFileDrop(e)}
          >
          <label htmlFor="extension-file-upload" className={cls.fileUploadLabel}>
            <ImportIcon />
            {file ? (
              <p className={cls.selectText}>{file.name}</p>
            ) : (
              <span>{t('Select or drag a file')}</span>
            )}
          </label>
          <input
            onChange={handleFileChange}
            type="file"
            id="extension-file-upload"
            className={cls.hiddenFileInput}
          />
        </div>
      </div>
      <div className={cls.modalFooter}>
        <Button type="button" className={cls.closeButton} onClick={modalClose}>
          {t('Exit')}
        </Button>
        <Button type="submit" className={cls.addButton} loading={isLoading}>
          {t('Add')}
        </Button>
      </div>
    </form>
  );
};

export default ExtensionFormFile;
