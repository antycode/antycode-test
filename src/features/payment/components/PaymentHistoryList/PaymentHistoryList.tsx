import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import cls from '@/pages/PaymentPage/components/PaymentPage.module.scss';
import { Table } from '@/shared/components/Table/Table';
import { Pagination } from '@/shared/components/Pagination/Pagination';
import { useTranslation } from 'react-i18next';
import { usePaymentStore } from '@/features/payment/store';
import { fetchData } from '@/shared/config/fetch';
import { useWorkspacesStore } from '@/features/workspace/store';
import { PaymentHistoryListItem } from '@/features/payment/components/PaymentHistoryList/PaymentHistoryListItem';
import clsx from 'clsx';
import { ReactComponent as Arrow2Left } from '@/shared/assets/icons/arrow-2-left.svg';
import { ReactComponent as ArrowDownWhite } from '@/shared/assets/icons/arrow-down-white.svg';
import { SidebarMode } from '@/shared/const/context';
import { SidebarModeContext, SidebarModeContextType } from '@/shared/context/SidebarModeContext';
import { number } from 'zod';
import { ReactComponent as ArrowIcon } from '@/shared/assets/icons/arrow.svg';
import { Loader } from '@/shared/components/Loader';

const itemsPerPageOptions = [30, 60, 90];

interface PaymentHistoryListProps {
  setActivePages: Dispatch<SetStateAction<number[]>>;
}

export const PaymentHistoryList = ({setActivePages}: PaymentHistoryListProps) => {
  const { t } = useTranslation();
  const { myTeams } = useWorkspacesStore();
  const {
    isLoading,
    transactions,
    pageCount,
    setPageCount,
    setOperation,
    operation,
    setFilteredTransactions,
    filteredTransactions,
    visibleTransactions,
    setVisibleTransactions,
    currentPage,
    setCurrentPage,
    perPageCount,
    setPerPageCount,
    setTotalPages,
    totalPages,
  } = usePaymentStore();

  const { sidebarMode, setSidebarMode } = useContext(SidebarModeContext) as SidebarModeContextType;
  const isMiniSidebar = sidebarMode === SidebarMode.MINI;
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  const operationsTypes = ['All operations', 'Income', 'Expenses'];

  const [isOpenPageCount, setIsOpenPageCount] = useState<boolean>(false);
  const [isOpenOperation, setIsOpenOperation] = useState<boolean>(false);

  const selectRefPageCount = useRef<HTMLDivElement | null>(null);
  const selectRefOperation = useRef<HTMLDivElement | null>(null);

  const toggleDropdownPageCount = () => {
    setIsOpenPageCount((prevState) => !prevState);
  };

  const toggleDropdownOperation = () => {
    setIsOpenOperation((prevState) => !prevState);
  };

  const handleMenuClick = () => {
    setSidebarMode((prev) => (prev === SidebarMode.FULL ? SidebarMode.MINI : SidebarMode.FULL));
  };

  const sortTransactionsByOperation = (i: string) => {
    if (i === 'All operations') {
      setOperation(null);
    } else if (i === 'Income') {
      setOperation(true);
    } else if (i === 'Expenses') {
      setOperation(false);
    }
    setIsOpenOperation(false);
  };

  const handlePerPageSelect = (perPageCount: number) => {
    setPerPageCount(perPageCount);
    setCurrentPage(1);
    setIsOpenPageCount(false);
    setActivePages([1]);
    setPageCount(perPageCount);
  };

  useEffect(() => {
    const filteredByType = transactions.filter((transaction) => {
      if (operation === null) return true; // All operations
      return operation ? transaction.type === 1 : transaction.type === 0;
    });

    // Get only the current page's transactions (first 30/60 or more)
    setFilteredTransactions(
      filteredByType.slice(
        0,
        filteredByType.length < pageCount ? filteredByType.length : pageCount,
      ),
    );
  }, [transactions, pageCount, operation, setFilteredTransactions]);

  const handleClickOutsideOperation = (event: MouseEvent) => {
    if (selectRefOperation.current && !selectRefOperation.current.contains(event.target as Node)) {
      setIsOpenOperation(false);
    }
  };

  useEffect(() => {
    if (isOpenOperation) {
      document.addEventListener('click', handleClickOutsideOperation);
    } else {
      document.removeEventListener('click', handleClickOutsideOperation);
    }
    return () => {
      document.removeEventListener('click', handleClickOutsideOperation);
    };
  }, [isOpenOperation]);

  const handleClickOutsidePageCount = (event: MouseEvent) => {
    if (selectRefPageCount.current && !selectRefPageCount.current.contains(event.target as Node)) {
      setIsOpenPageCount(false);
    }
  };

  const fetchPerPage = (page: number = 1) => {
    const teamId = localStorage.getItem('teamId');
    // setIsLoadingHistory(true);
    fetchData({
      url: `/billing/transaction?count=${perPageCount}&page=${page}`,
      method: 'GET',
      team: teamId,
    })
      .then((data: any) => {
        if (data.is_success) {
          setTotalPages(data.settings?.total_pages || 1);
          setVisibleTransactions(data.data);
          setCurrentPage(page);
          // setIsLoadingHistory(false)
        } else {
          console.error('Fetch failed:', data.errors);
        }
      })
      .catch((err) => {
        console.log('Notification fetch error:', err);
      });
  };

  useEffect(() => {
    if (isOpenPageCount) {
      document.addEventListener('click', handleClickOutsidePageCount);
    } else {
      document.removeEventListener('click', handleClickOutsidePageCount);
    }
    return () => {
      document.removeEventListener('click', handleClickOutsidePageCount);
    };
  }, [isOpenPageCount]);

  useEffect(() => {
    fetchPerPage(currentPage);
  }, [perPageCount]);

  return (
    <>
      <div className={cls.paymentHistoryHeader}>
        <div className={cls.actionsLeft}>
        {/*  <div>*/}
        {/*    <button className={cls.btnSidebar} onClick={handleMenuClick}>*/}
        {/*      <Arrow2Left*/}
        {/*        className={clsx(*/}
        {/*          isMiniSidebar && cls.arrowDeg,*/}
        {/*          isMiniSidebar ? cls.marginLeftPlus1 : cls.marginLeftMinus1,*/}
        {/*        )}*/}
        {/*      />*/}
        {/*    </button>*/}
        {/*  </div>*/}
          <p className={cls.mainText}>{t('Payment history')}</p>
        </div>
        <div className={cls.sortWrapper}>
          <div className={cls.selectWrapper} ref={selectRefPageCount}>
            <div
              className={clsx(cls.select, isOpenPageCount && cls.activeSelect)}
              style={{ width: '56px', height: '34px' }}
              onClick={toggleDropdownPageCount}>
              <p>{pageCount}</p>
              <ArrowDownWhite />
            </div>
            {isOpenPageCount && (
              <div
                className={clsx(cls.select2Wrapper, isOpenPageCount && cls.activeSelectDropdown)}
                style={{ width: '56px' }}>
                {itemsPerPageOptions.map((count: number, index) => (
                  <p
                    key={index}
                    className={clsx(cls.selectItem, pageCount === count && cls.activeItem)}
                    onClick={() => handlePerPageSelect(count)}>
                    {count}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className={cls.selectWrapper} ref={selectRefOperation}>
            <div
              className={clsx(cls.select, isOpenOperation && cls.activeSelect)}
              style={{ width: '175px', height: '34px' }}
              onClick={toggleDropdownOperation}>
              {operation === null && <p>{t('All operations')}</p>}
              {operation === true && <p>{t('Income')}</p>}
              {operation === false && <p>{t('Expenses')}</p>}
              <ArrowDownWhite />
            </div>
            {isOpenOperation && (
              <div
                className={clsx(cls.select2Wrapper, isOpenOperation && cls.activeSelectDropdown)}
                style={{ width: '175px' }}>
                {operationsTypes.map((i: string) => (
                  <p
                    className={clsx(
                      cls.selectItem,
                      ((i === 'All operations' && operation === null) ||
                        (i === 'Income' && operation === true) ||
                        (i === 'Expenses' && operation === false)) &&
                        cls.activeItem,
                    )}
                    onClick={() => sortTransactionsByOperation(i)}>
                    {t(`${i}`)}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div>3</div>
        </div>
      </div>
      <Table zIndex={true} marginTop={true}>
        <Table.Header>
          <Table.Col className={clsx(cls.colNumber, cls.colHeader)}>{t('#')}</Table.Col>
          <Table.Col className={clsx(cls.colDate, cls.colHeader)}>{t('Date')}</Table.Col>
          <Table.Col className={clsx(cls.colAmount, cls.colHeader)}>{t('Amount')}, USD</Table.Col>
          <Table.Col className={clsx(cls.colOperation, cls.colHeader)}>{t('Operation')}</Table.Col>
          <Table.Col className={clsx(cls.colType, cls.colHeader)}>{t('Type')}</Table.Col>
          <Table.Col className={clsx(cls.colBalance, cls.colHeader)}>
            {t('Balance before')}
          </Table.Col>
          <Table.Col className={clsx(cls.colBalance, cls.colHeader)}>
            {t('Balance after')}
          </Table.Col>
        </Table.Header>

         
          <Table.Main isLoading={isLoading}>
            <div className={cls.tableMainWrapper}>
              {visibleTransactions.map((item, idx) => (
                <PaymentHistoryListItem key={idx} index={idx} item={item} />
              ))}

              {!isLoading && !transactions.length && (
                <Table.NoItemsText>{t('No transactions')}</Table.NoItemsText>
              )}
            </div>
          </Table.Main>
        
      </Table>
    </>
  );
};
