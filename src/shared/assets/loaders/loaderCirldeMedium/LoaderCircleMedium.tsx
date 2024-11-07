import React from 'react';
import cls from './LoaderCircleMedium.module.scss'

interface LoaderCircleMediumProps {
    selectedRow: boolean
}

const LoaderCircleMedium = (props: LoaderCircleMediumProps) => {
    const {selectedRow} = props;
    return (
        <div className={cls.loaderBlock} data-selected-row={selectedRow}>
            <div className={cls.loader}></div>
        </div>
    );
};

export default LoaderCircleMedium;