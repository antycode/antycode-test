import React from 'react';
import cls from './LoaderCircle.module.scss'

interface LoaderCircleProps {
    selectedRow: boolean
}

const LoaderCircle = (props: LoaderCircleProps) => {
    const {selectedRow} = props;
    return (
        <div className={cls.loaderBlock} data-selected-row={selectedRow}>
            <div className={cls.loader}></div>
        </div>
    );
};

export default LoaderCircle;