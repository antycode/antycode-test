import React from 'react';
import cls from './LoaderDotsGreen.module.scss';

const LoaderDotsGreen = () => {
    return (
        <div className={cls.loaderBlock}>
            <div className={cls.dotLoader}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default LoaderDotsGreen;