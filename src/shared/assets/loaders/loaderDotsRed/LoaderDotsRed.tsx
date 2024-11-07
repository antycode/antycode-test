import React from 'react';
import cls from './LoaderDotsRed.module.scss';

const LoaderDotsRed = () => {
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

export default LoaderDotsRed;