import clsx from 'clsx';
import {ReactComponent as ArrowIcon} from '@/shared/assets/icons/arrow.svg';
import cls from './Pagination.module.scss';
import React from 'react';

interface PaginationProps {
    totalPages: number,
    currentPage: number,
    activePages: number[],
    onPageChange: (page: number) => void
}

export const Pagination = (props: PaginationProps) => {
    const {totalPages, currentPage, activePages, onPageChange} = props;

    const handlePageChange = (page: number) => {
        if (!activePages.includes(page)) {
            onPageChange(page);
        }
    };

    const generatePagesArray = () => {
        const pageArray: number[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pageArray.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pageArray.push(i);
                }
                pageArray.push(-1);
                pageArray.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pageArray.push(1);
                pageArray.push(-1);
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageArray.push(i);
                }
            } else {
                pageArray.push(1);
                pageArray.push(-1);
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageArray.push(i);
                }
                pageArray.push(-1);
                pageArray.push(totalPages);
            }
        }
        return pageArray;
    };

    const isArrowGreyClassForLeftArrow = () => {
        let allPagesActive = true;
        for (let i = 1; i <= currentPage; i++) {
            if (!activePages.includes(i)) {
                allPagesActive = false;
                break;
            }
        }
        return allPagesActive;
    };

    const handlePageChangeArrowLeft = () => {
        if (activePages.length === 1) {
            handlePageChange(currentPage - 1);
        } else {
            for (let i = 1; i < currentPage; i++) {
                if (activePages.includes(i)) {
                    if (i - 1 !== 0) {
                        handlePageChange(i - 1);
                    }
                    break;
                }
            }
        }
    };

    return (
        <div className={cls.pagination}>
            <button
                className={clsx(cls.arrowButton, cls.arrowButtonLeft)}
                onClick={handlePageChangeArrowLeft}
                disabled={currentPage === 1}
            >
                <ArrowIcon
                    className={clsx(cls.arrowRotateToLeft, {[cls.arrowGrey]: currentPage === 1 || isArrowGreyClassForLeftArrow()})}/>
            </button>

            {generatePagesArray().map((pageNumber, index) => (
                <React.Fragment key={index}>
                    {pageNumber === -1 ? (
                        <span className={cls.ellipsis}>...</span>
                    ) : (
                        <button
                            className={clsx(cls.pageNumber, activePages.includes(pageNumber) && cls.active)}
                            onClick={() => handlePageChange(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    )}
                </React.Fragment>
            ))}

            <button
                className={clsx(cls.arrowButton, cls.arrowButtonRight)}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ArrowIcon className={clsx({[cls.arrowGrey]: currentPage === totalPages})}/>
            </button>
        </div>
    );
};
