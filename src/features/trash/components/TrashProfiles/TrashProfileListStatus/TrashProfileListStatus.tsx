import clsx from 'clsx';
import { ProfStatus } from '@/features/profile/types';
import cls from './TrashProfileListStatus.module.scss';
import { useTranslation } from 'react-i18next';

interface Props {
  status: ProfStatus;
}

export const TrashProfileListStatus = ({ status }: any) => {
  const { t } = useTranslation();

  const { label, className } = getStatusInfo(status);

  return (
    <div className={clsx(cls.accListStatus, cls[className])}>
      {t(`accStatuses.${label}`)}
    </div>
  );
};

const getStatusInfo = (status: ProfStatus) => {
  switch (status) {
    case ProfStatus.InProgress:
      return {
        label: 'In progress',
        className: 'inProgress',
      };
    case ProfStatus.Error:
      return {
        label: 'Error',
        className: 'error',
      };
    case ProfStatus.NotActive:
      return {
        label: 'Not activated',
        className: 'notActivated',
      };
    case ProfStatus.ActivationPending:
      return {
        label: 'Activation pending',
        className: 'activationPending',
      };
    case ProfStatus.Active:
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
