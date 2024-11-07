import React from 'react';
import cls from './Preload.module.scss';

const Preload = () => {
    return (
        <div className={cls.appLoadingWrap}>
            <div className={cls.loaderContent}>

            </div>
        </div>
    );
};

export default Preload;