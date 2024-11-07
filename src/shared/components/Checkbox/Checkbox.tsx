import clsx from 'clsx';
import { ReactComponent as IconMinus } from '@/shared/assets/icons/minus.svg';
import { ReactComponent as IconCheck } from '@/shared/assets/icons/check.svg';
import cls from './Checkbox.module.scss';

interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  indeterminate?: boolean;
}

export const Checkbox = (props: CheckboxProps) => {
  const { className, checked, onChange, indeterminate, ...otherProps } = props;

  const icon = checked ? (
    <IconCheck className={cls.icon} />
  ) : (
    <IconMinus className={clsx(cls.icon, cls.iconIndeterminate)} />
  );

  const classMode = checked ? cls.checked : indeterminate ? cls.indeterminate : null;

  return (
    <div className={clsx(cls.checkbox, className, classMode)}>
      <input
        {...otherProps}
        className={cls.input}
        checked={checked}
        onChange={onChange}
        type="checkbox"
      />
      <div className={cls.box}>{icon}</div>
    </div>
  );
};
