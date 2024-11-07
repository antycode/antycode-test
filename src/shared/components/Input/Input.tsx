import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { InputError } from './InputError/InputError';
import { InputWrapper, InputWrapperBaseProps } from './InputWrapper/InputWrapper';
import cls from './Input.module.scss';

export interface InputProps
  extends React.HTMLProps<HTMLInputElement>,
    InputWrapperBaseProps {}

export interface CompoundedComponent
  extends React.ForwardRefExoticComponent<
    Omit<InputProps, 'ref'> & React.RefAttributes<HTMLInputElement>
  > {
  Wrapper: typeof InputWrapper;
  Error: typeof InputError;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { error, errorProps, className, ...inputProps } = props;

  return (
    <InputWrapper error={error} errorProps={errorProps}>
      <input
        {...inputProps}
        ref={ref}
        className={clsx(cls.input, className, { [cls.inputError]: error })}
      />
    </InputWrapper>
  );
}) as CompoundedComponent;

Input.Wrapper = InputWrapper;
Input.Error = InputError;
