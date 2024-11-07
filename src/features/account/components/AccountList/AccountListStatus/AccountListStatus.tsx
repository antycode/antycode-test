import clsx from 'clsx';
import { AccStatus } from '../../../types';
import cls from './AccountListStatus.module.scss';
import { useTranslation } from 'react-i18next';

interface Props {
  status: AccStatus;
}

export const AccountListStatus = ({ status }: Props) => {
  const { t } = useTranslation();

  const { label, className } = getStatusInfo(status);

  return (
    <div className={clsx(cls.accListStatus, cls[className])}>
      {t(`accStatuses.${label}`)}
    </div>
  );
};

const getStatusInfo = (status: AccStatus) => {
  switch (status) {
    case AccStatus.InProgress:
      return {
        label: 'In progress',
        className: 'inProgress',
      };
    case AccStatus.Error:
      return {
        label: 'Error',
        className: 'error',
      };
    case AccStatus.NotActive:
      return {
        label: 'Not activated',
        className: 'notActivated',
      };
    case AccStatus.ActivationPending:
      return {
        label: 'Activation pending',
        className: 'activationPending',
      };
    case AccStatus.Active:
      return {
        label: 'Active',
        className: 'active',
      };

    default:
      return {
        label: 'Unknown',
        className: 'unknown',
      };
  }
};
