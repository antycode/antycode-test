import { memo, useState } from 'react';
import { Table } from '@/shared/components/Table/Table';
import cls from './TrashProxyList.module.scss';
import { Proxy } from '@/features/proxy/types';
import { Checkbox } from '@/shared/components/Checkbox/Checkbox';
import { RefetchButton } from '@/shared/components/RefetchButton/RefetchButton';
import { ReactComponent as IconRedCircle } from '@/shared/assets/icons/red_circle.svg';
import { ReactComponent as IconGreenCircle } from '@/shared/assets/icons/green_circle.svg';
import { useTranslation } from 'react-i18next';
import Flag from 'react-world-flags';
import clsx from 'clsx';
import { Button } from '@/shared/components/Button';
import { ReactComponent as Cross2Icon } from '@/shared/assets/icons/cross2.svg';
import { ReactComponent as TrashIcon1 } from '@/shared/assets/icons/trash-icon-1.svg';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { formatDate } from '@/shared/utils';
import { ModalWindow } from '@/shared/components/ModalWindow/ModalWindow';
import { fetchData } from '@/shared/config/fetch';
import { useProxiesStore } from '@/features/proxy/store';

interface TrashProxyListItemProps {
  item: Proxy;
  isSelected: boolean;
  selectRow: (id: string, isSelected: boolean) => void;
}

export const TrashProxyListItem = memo(
  ({ item, isSelected, selectRow }: TrashProxyListItemProps) => {
    const { external_id } = item;
    const { t } = useTranslation();
    const rotateProxyLink = (fullUrl: string) => {
      fetch(fullUrl, {
        method: 'GET',
        mode: 'no-cors',
        body: null,
        redirect: 'follow',
      }).catch((err) => {
        console.log(`Error occurred when rotating a link for ${fullUrl}`);
      });
    };
    const [isOpenDeleteProxyPopup, setIsOpenDeleteProxyPopup] = useState<boolean>(false);
    const { allProxies, setAllProxiesData } = useProxiesStore();

    const deleteSelectedProfiles = async () => {
      await removeProfile();
      setIsOpenDeleteProxyPopup(false);
    };

    const removeProfile = async () => {
      const teamId = localStorage.getItem('teamId');
      fetchData({ url: `/profile/proxy${external_id}`, method: 'DELETE', team: teamId })
        .then((data: any) => {
          if (data?.is_success) {
            const profilesInBasket = allProxies.filter(
              (profile: any) => profile.external_id !== external_id && profile.date_basket,
            );
            setAllProxiesData(profilesInBasket || []);
          }
        })
        .catch((err: Error) => {
          console.log(err);
        });
    };

    return (
      <>
        <Table.Row isSelected={isSelected}>
          <Table.Col className={cls.colCheck}>
            <Checkbox
              checked={isSelected}
              onChange={(e) => selectRow(external_id, e.currentTarget.checked)}
            />
          </Table.Col>

          <Table.Col className={cls.colStatusChecked}>
            {item.speed === 0 ? (
              <IconRedCircle id={item.external_id} />
            ) : (
              <IconGreenCircle id={item.external_id} />
            )}
          </Table.Col>

          <Table.Col className={cls.colName}>{item.title}</Table.Col>

          <Table.Col className={cls.colHost}>{item.host}</Table.Col>

          <Table.Col className={clsx(cls.colPort, cls.colPortCell)}>{item.port}</Table.Col>

          <Table.Col className={clsx(cls.colLogin, cls.colLoginCell)}>{item.login}</Table.Col>

          <Table.Col className={clsx(cls.colPassword, cls.colPasswordCell)}>
            {item.password}
          </Table.Col>

          <Table.Col className={cls.colChangeLink}>{item.link_rotate}</Table.Col>

          <Table.Col className={cls.colProtocol}>{item.type.toUpperCase()}</Table.Col>

          <Table.Col className={clsx(cls.colGeo, cls.colGeoCell)}>
            <Flag
              className={cls.colGeoCountryFlag}
              height="11"
              code={item.country_code.toUpperCase()}
            />
            <span>{item.country_code.toUpperCase()}</span>
          </Table.Col>

          <Table.Col className={cls.colDate}>
            {formatDate(new Date('2023-10-17T12:57:44.000000Z'))}
          </Table.Col>

          <Table.Col itemId={external_id} className={cls.colAction}>
            <Button
              className={cls.buttonClear}
              color={'danger'}
              variant="outline"
              onClick={() => setIsOpenDeleteProxyPopup(true)}>
              <div className={cls.buttonClearContent}>
                <Cross2Icon />
                <p>{t('Delete')}</p>
              </div>
            </Button>
          </Table.Col>
        </Table.Row>
        <ModalWindow
          modalWindowOpen={isOpenDeleteProxyPopup}
          onClose={() => setIsOpenDeleteProxyPopup(false)}>
          <div className={cls.modalWindowHeader}>
            <span className={cls.freeSpace} />
            <div className={cls.modalHeaderTitle}>
              <TrashIcon1 />
              <p className={cls.modalTitle}>{t('Delete proxy')}</p>
            </div>
            <CloseIcon className={cls.closeBtn} onClick={() => setIsOpenDeleteProxyPopup(false)} />
          </div>
          <div className={cls.modalContent}>
            <div className={cls.warningTextContent}>
              <p className={cls.warningText1}>
                {t('Are you sure you want to delete the selected profiles?')}
              </p>
              <p className={cls.warningText2}>{t('The files will be deleted permanently')}</p>
            </div>
            <div className={cls.approveContent}>
              <button className={cls.btnCancel} onClick={() => setIsOpenDeleteProxyPopup(false)}>
                {t('Cancel')}
              </button>
              <button className={cls.btnDelete} onClick={() => deleteSelectedProfiles()}>
                {t('Delete')}
              </button>
            </div>
          </div>
        </ModalWindow>
      </>
    );
  },
);
