import { KeyboardEvent } from 'react';
import { Input } from '../Input';
import { InputProps } from '../Input/Input';
import { clamp } from '@/shared/utils';
import cls from './NumberInput.module.scss';
import { forwardRef } from 'react';
import clsx from 'clsx';

interface NumberInputProps extends Omit<InputProps, 'onChange'> {
  onChange?(value: number | ''): void;
  min?: number;
  max?: number;
  value?: number | '';
  className?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    const { onChange, min, max, value, className, ...otherProps  } = props;

    const _min = typeof min === 'number' ? min : -Infinity;
    const _max = typeof max === 'number' ? max : Infinity;

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    };

    const handleChange = (newInputValue: string) => {
      const parsedValue = parseFloat(newInputValue);
      const finalValue = Number.isNaN(parsedValue) ? '' : parsedValue;
      onChange?.(finalValue);
    };

    // Correct value on blur if it is less than or greater than max and min props
    const handleBlur = (newInputValue?: number | '') => {
      if (min && newInputValue === '') {
        onChange?.(_min);
      }

      if (typeof newInputValue === 'number') {
        const clampedValue = clamp(newInputValue, _min, _max);
        onChange?.(clampedValue);
      }
    };

    return (
      <Input
        {...otherProps}
        ref={ref}
        value={value}
        className={clsx(cls.numberInput, className)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange(e.target.value)
        }
        onBlur={() => handleBlur(value)}
        onKeyPress={handleKeyPress}
        type="number"
      />
    );
  }
);
