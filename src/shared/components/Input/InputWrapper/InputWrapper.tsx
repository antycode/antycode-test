import React from 'react';
import cls from './InputWrapper.module.scss';
import { InputError } from '../InputError/InputError';
import clsx from 'clsx';

export interface InputWrapperBaseProps {
  error?: React.ReactNode; // Displays error message after input
  errorProps?: Record<string, any>; // Props spread to error element
}

interface InputWrapperProps extends InputWrapperBaseProps {
  children: React.ReactNode;
}

export const InputWrapper = (props: InputWrapperProps) => {
  const { children, error, errorProps } = props;

  return (
    <div className={cls.inputWrapper}>
      {children}

      {typeof error !== 'boolean' && error && (
        <InputError
          {...errorProps}
          className={clsx(cls.inputWrapperError, errorProps?.className)}
        >
          {error}
        </InputError>
      )}
    </div>
  );
};
