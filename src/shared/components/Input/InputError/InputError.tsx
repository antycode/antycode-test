import { ReactNode } from 'react';
import cls from './InputError.module.scss';
import clsx from 'clsx';

interface InputErrorProps {
  className?: string;
  children: ReactNode;
}

export const InputError = (props: InputErrorProps) => {
  const { children, className, ...other } = props;

  return (
    <div {...other} className={clsx(cls.inputError, className)}>
      {children}
    </div>
  );
};
