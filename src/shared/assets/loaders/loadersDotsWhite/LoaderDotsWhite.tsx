import React from 'react';
import cls from './LoaderDotsWhite.module.scss';

const LoaderDotsWhite = () => {
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

export default LoaderDotsWhite;