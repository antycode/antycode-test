import React, { forwardRef, useId } from 'react';
import { useUncontrolled } from '@/shared/hooks';
import cls from './Switch.module.scss';
import clsx from 'clsx';

interface SwitchProps {
  /** Id is used to bind input and label, if not passed unique id will be generated for each input */
  id?: string;

  /** Value for controlled state */
  checked?: boolean;

  /** Controlled state onChange handler  */
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;

  /** Initial value for uncontrolled state */
  defaultChecked?: boolean;

  className?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>((props, ref) => {
  const { checked, onChange, defaultChecked, className } = props;

  const reactId = useId();
  const id = props.id || reactId;

  const [_checked, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
  });

  return (
    <div className={clsx(cls.switch, className)}>
      <input
        className={cls.input}
        ref={ref}
        id={id}
        type="checkbox"
        checked={_checked}
        onChange={(e) => {
          onChange?.(e);
          handleChange(e.target.checked);
        }}
      />

      <label className={cls.label} htmlFor={id}>
        <div className={cls.labelThumb}></div>

        <div className={cls.labelTrack}></div>
      </label>
    </div>
  );
});
