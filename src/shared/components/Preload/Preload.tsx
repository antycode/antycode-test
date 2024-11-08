import React from 'react';
import cls from './Preload.module.scss';
import useApplicationUpdate from '@/shared/hooks/useApplicationUpdate';
import LoadingPage from '@/pages/LoadingPage';

const Preload = () => {
  return (
      <div className={cls.appLoadingWrap}>
        <div className={cls.loaderContent}></div>
      </div>
    )
};
export default Preload;
