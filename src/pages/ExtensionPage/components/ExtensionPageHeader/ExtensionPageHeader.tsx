import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Button } from '@/shared/components/Button';
import cls from './ExtensionPageHeader.module.scss';
import { ReactComponent as IconPlusCircle } from '@/shared/assets/icons/plus-circle.svg';
import { ReactComponent as IconTrash } from '@/shared/assets/icons/trash.svg';
import { ReactComponent as TrashIcon1 } from '@/shared/assets/icons/trash-icon-1.svg';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { ReactComponent as ImportIcon } from '@/shared/assets/icons/import-2.svg';
import { ModalWindow } from '@/shared/components/ModalWindow/ModalWindow';
import { CreateExtensionParams } from '../ExtensionPage';
import { useForm } from 'react-hook-form';
import { fetchData } from '@/shared/config/fetch';
import {
  extractExtensionId,
  fetchExtensionData,
  handleDownloadExtension,
} from '@/shared/utils/extensions';
import { ipcRenderer } from 'electron';
import ExtensionFormUrl from '../ExtensionForms/ExtensionFormUrl';
import ExtensionFormFile from '../ExtensionForms/ExtensionFormFile';
import { toast } from 'react-toastify';

enum ButtonTypes {
  deleteIcon = 'btnDeleteIcon',
  createAccount = 'btnCreateAccount',
}

interface ExtensionPageHeader {
  selectedRows: Set<string>;
  setSelectedRows: Dispatch<SetStateAction<Set<string>>>;
  getExtensions: (page?: number) => void;
  setActivePages: Dispatch<SetStateAction<number[]>>;
  extensions: any[];
}

export const ExtensionPageHeader = ({
  selectedRows,
  setSelectedRows,
  getExtensions,
  setActivePages,
  extensions,
}: ExtensionPageHeader) => {
  const { t } = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('webStore');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const deleteExtensions = async (ids: string[], externalIdMap: { [key: string]: string }) => {
    const teamId = localStorage.getItem('teamId');
    try {
      await Promise.all(
        ids.map(async (id) => {
          const extensionUrl = externalIdMap[id];
          if (extensionUrl) {
            const extensionId = extractExtensionId(extensionUrl);

            await fetchData({
              url: `/profile/extension/${id}`,
              method: 'DELETE',
              team: teamId,
            });
            console.log('id', id)
            const response = await ipcRenderer.invoke('delete-extension-file', extensionId, id);
            if (!response.success) {
              console.error(`Failed to delete extension with ID ${extensionId}:`, response.error);
            } else {
              console.log(`Extension ${extensionId} deleted successfully.`);
            }
          } else {
            console.error(`No URL found for extension with external_id ${id}`);
          }
        }),
      );

      getExtensions(1);
      setActivePages([1]);
    } catch (error) {
      console.log('Error deleting extensions:', error);
    }
  };

  const modalOpen = () => {
    setModalIsOpen(true);
  };
  const modalClose = () => {
    setModalIsOpen(false);
    setFile(null);
    setFileName('')
  };

  const mapExternalIdsToUrls = (
    extensions: { external_id: string; url: string }[],
  ): { [key: string]: string } => {
    const map: { [key: string]: string } = {};
    extensions.forEach(({ external_id, url }) => {
      map[external_id] = url;
    });
    return map;
  };

  const closeDeleteExtension = () => {
    setSelectedRows(new Set());
    setDeleteModalIsOpen(false);
  };
  const isOpenDeleteExtension = () => {
    const idsToDelete = Array.from(selectedRows);
    if (idsToDelete.length > 0) {
      setDeleteModalIsOpen(true);
    } else {
      toast.info(t('Please select at least 1 extension'));
    }
  };

  const handleDelete = async () => {
    const idsToDelete = Array.from(selectedRows);
    const externalIdMap = mapExternalIdsToUrls(extensions);
    await deleteExtensions(idsToDelete, externalIdMap);
    setSelectedRows(new Set());
    setDeleteModalIsOpen(false);
  };

  return (
    <div className={cls.extensionHeader}>
      <div className={cls.actionsLeft}>
        <Button
          className={clsx(cls.btn, cls[ButtonTypes.deleteIcon])}
          isActionIcon
          onClick={isOpenDeleteExtension}
          leftIcon={<IconTrash width={16} height={16} style={{ marginRight: '2px' }} />}>
          {t('Delete')}
        </Button>
      </div>

      <div className={cls.actionsRight}>
        <Button
          className={clsx(cls[ButtonTypes.createAccount])}
          color="primary"
          onClick={modalOpen}
          leftIcon={<IconPlusCircle width={18} height={18} style={{ marginRight: '2px' }} />}>
          {t('Add')}
        </Button>
        <ModalWindow modalWindowOpen={modalIsOpen} onClose={modalClose}>
          <div>
            <div className={cls.modalWindowHeader}>
              <div className={cls.modalHeaderTitle}>
                <p className={cls.modalTitle}>{t('Create an application')}</p>
              </div>
              <CloseIcon className={cls.closeBtn} onClick={modalClose} />
            </div>
            <div className={cls.modalWrapper}>
              <div className={cls.tabsContainer}>
                <div className={cls.tabsHeader}>
                  <div
                    className={`${cls.tabButton} ${activeTab === 'webStore' ? cls.activeTab : ''}`}
                    onClick={() => setActiveTab('webStore')}>
                    {t('Add from Chrome Web Store')}
                  </div>
                  <div
                    className={`${cls.tabButton} ${
                      activeTab === 'fileUpload' ? cls.activeTab : ''
                    }`}
                    onClick={() => setActiveTab('fileUpload')}>
                    {t('Upload File')}
                  </div>
                </div>
                {activeTab === 'webStore' && (
                  <ExtensionFormUrl
                    modalClose={modalClose}
                    setModalIsOpen={setModalIsOpen}
                    setActivePages={setActivePages}
                    getExtensions={getExtensions}
                  />
                )}
                {activeTab === 'fileUpload' && (
                  <ExtensionFormFile
                    setFile={setFile}
                    fileName={fileName}
                    setFileName={setFileName}
                    file={file}
                    setActivePages={setActivePages}
                    getExtensions={getExtensions}
                    modalClose={modalClose}
                  />
                )}
              </div>
            </div>
          </div>
        </ModalWindow>
        <ModalWindow modalWindowOpen={deleteModalIsOpen} onClose={closeDeleteExtension}>
          <div className={cls.modalWindowHeader}>
            <span className={cls.freeSpace} />
            <div className={cls.modalHeaderTitle}>
              <TrashIcon1 />
              <p className={cls.modalTitle}>{t('Delete extension')}</p>
            </div>
            <CloseIcon className={cls.closeBtn} onClick={closeDeleteExtension} />
          </div>
          <div className={cls.modalContent}>
            <div className={cls.warningTextContent}>
              <p className={cls.warningText1}>
                {t('Are you sure you want to delete the selected extensions?')}
              </p>
              <p className={cls.warningText2}>{t('Deleted files will be deleted permanently.')}</p>
            </div>
            <div className={cls.approveContent}>
              <button className={cls.btnCancel} onClick={closeDeleteExtension}>
                {t('Cancel')}
              </button>
              <button className={cls.btnDelete} onClick={() => handleDelete()}>
                {t('Delete')}
              </button>
            </div>
          </div>
        </ModalWindow>
      </div>
    </div>
  );
};
