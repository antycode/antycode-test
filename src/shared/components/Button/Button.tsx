import clsx from 'clsx';
import cls from './Button.module.scss';
import { ButtonHTMLAttributes, SVGAttributes } from 'react';
import { getPrefixedClassName } from '@/shared/utils';
import { ReactComponent as Spinner } from '@/shared/assets/icons/spinner.svg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  color?: 'primary' | 'danger' | 'orange' | 'none';
  variant?: 'light' | 'outline' | 'filled' | 'icon' | 'unstyled';
  leftIcon?: React.ReactNode;
  loaderPosition?: 'left' | 'right';
  loading?: boolean;
  isActionIcon?: boolean;
  iconRight?: React.ReactNode;
  notNeedSpan?: boolean;
}

export const Button = (props: ButtonProps) => {
  const {
    className,
    children,
    leftIcon,
    loading,
    color = 'none',
    variant = 'filled',
    loaderPosition = 'left',
    isActionIcon,
    iconRight,
    notNeedSpan,
    ...restProps
  } = props;

  const loader = <Spinner />;

  return (
    <button
      className={clsx(cls.btn, className, {
        [cls.actionIcon]: isActionIcon,
        [cls.btnLoading]: loading,
        [cls.btnWithLeftIcon]: leftIcon,
        [cls[getPrefixedClassName('color', color)]]: color,
        [cls[getPrefixedClassName('variant', variant)]]: variant,
      })}
      {...restProps}
    >
      {(leftIcon || (loading && loaderPosition === 'left')) && (
        <span className={clsx(cls.leftIcon)}>
          {loading && loaderPosition === 'left' ? loader : leftIcon}
        </span>
      )}
      {!notNeedSpan && (
        <span className={cls.label}>
          {loading ? null : children}
        </span>
      )}
      {iconRight && (
        <span className={cls.rightIcon}>
          {loading && loaderPosition === 'right' ? loader : iconRight}
        </span>
      )}
    </button>
  );
};
