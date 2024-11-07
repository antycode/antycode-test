import { useId } from 'react';
import clsx from 'clsx';
import { useUncontrolled } from '@/shared/hooks';
import cls from './SegmentedControl.module.scss';

export interface SegmentedControlOption {
  value: any;
  label: string;
}

interface SegmentedControlProps {
  options: string[] | SegmentedControlOption[];
  value?: string | boolean | null | number;
  onChange?(value: string): void;
  defaultValue?: string;
  name?: string;
  getOptionLabel?: (o: SegmentedControlOption) => string;
  className?: string
}

export const SegmentedControl = (props: SegmentedControlProps) => {
  const {
    options: _options,
    value,
    defaultValue,
    onChange,
    name,
    className,
    getOptionLabel,
  } = props;

  const id = useId();
  const _name = name ?? id;

  const options = _options.map(
    (item: string | SegmentedControlOption): SegmentedControlOption =>
      typeof item === 'string' ? { label: item, value: item } : item
  );

  const [_value, handleValueChange] = useUncontrolled({
    value,
    defaultValue,
    finalValue: Array.isArray(options) ? options[0]?.value ?? null : null,
    onChange,
  });

  return (
    <div className={clsx(cls.segmentedControl, className)}>
      {options.map((item) => (
        <div className={cls.control} key={item.value}>
          <input
            className={cls.input}
            type="radio"
            name={_name}
            value={item.value}
            id={`${id}-${item.value}`}
            checked={_value === item.value}
            onChange={() => handleValueChange(item.value)}
          />

          <label
            className={clsx(cls.label, { [cls.labelActive]: _value === item.value })}
            htmlFor={`${id}-${item.value}`}
          >
            {getOptionLabel !== undefined ? getOptionLabel(item) : item.label}
          </label>
        </div>
      ))}
    </div>
  );
};
