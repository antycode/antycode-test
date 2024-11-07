import clsx from 'clsx';
import cls from './Table.module.scss';
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Loader, LoaderProps } from '../Loader';
import { TableItemsPerPageSelect } from './TableItemsPerPageSelect/TableItemsPerPageSelect';
import { IndeterminateCheckbox } from './IndeterminateCheckbox/IndeterminateCheckbox';

interface TableProps {
  children?: ReactNode;
  place?: string;
  zIndex?: boolean;
  marginTop?: boolean;
  className?: string;
}

export const Table = ({ children, place, zIndex, marginTop, className }: TableProps) => {
  return (
    <div
      className={clsx(cls.tableWrapper, className)}
      style={{
        ...(zIndex ? { zIndex: 1 } : {}),
        ...(marginTop ? { marginTop: '-17px' } : {}),
      }}>
      <div className={cls.table} data-place={place}>
        {children}
      </div>
    </div>
  );
};

// ================================

interface HeaderProps {
  children?: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  return <div className={clsx(cls.row, cls.header)}>{children}</div>;
};

// ================================

interface MainProps {
  children?: ReactNode;
  isLoading?: boolean;
  className?: string;
}

const Main = (props: MainProps) => {
  const { children, isLoading, className, ...restProps } = props;
  return (
    <div {...restProps} className={clsx(cls.main, className, isLoading && cls.mainLoading)}>
      {children}
    </div>
  );
};

// ================================

interface RowProps {
  children: ReactNode;
  className?: string;
  isSelected?: boolean;
}

const Row = ({ children, className, isSelected }: RowProps) => {
  return <div className={clsx(cls.row, className, isSelected && cls.rowSelected)}>{children}</div>;
};

// ================================

interface ColProps {
  children?: ReactNode;
  className?: string;
  width?: number;
  itemId?: string;
  dropdownRef?: any;
  onClick?: () => void
}

const Col = ({ children, className, width, itemId, dropdownRef, onClick, }: ColProps) => {
  const styles = {
    width,
    flex: `${width} 0 auto`,
  };

  return (
    <div className={clsx(cls.col, className)} style={styles} ref={dropdownRef} onClick={onClick}>
      {children}
    </div>
  );
};

// ================================

interface NoItemsTextProps {
  children: React.ReactNode;
  className?: string;
}

const NoItemsText = ({ children, className }: NoItemsTextProps) => {
  return <span className={clsx(cls.noItemsText, className)}>{children}</span>;
};

// ================================

const TableLoader = ({ className, ...restProps }: LoaderProps) => {
  return <Loader {...restProps} className={clsx(cls.loader, className)} size={100} />;
};

// ================================

const EmptyCol = ({ className, ...restProps }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...restProps} className={clsx(cls.emptyCol, className)}>
      {'—'}
    </div>
  );
};

// ================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

const Button = (props: ButtonProps) => {
  const { children, className, ...restProps } = props;

  return (
    <button {...restProps} className={clsx(cls.btn, className)}>
      {children}
    </button>
  );
};

// ================================

Table.Header = Header;
Table.Main = Main;
Table.Row = Row;
Table.Col = Col;
Table.Loader = TableLoader;
Table.NoItemsText = NoItemsText;
Table.EmptyCol = EmptyCol;
Table.Button = Button;
Table.ItemsPerPageSelect = TableItemsPerPageSelect;
Table.IndeterminateCheckbox = IndeterminateCheckbox;
