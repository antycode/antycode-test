import { Ref, forwardRef } from 'react';
import clsx from 'clsx';
import ReactSelect, { GroupBase, Props } from 'react-select';
import SelectType from 'react-select/dist/declarations/src/Select';
import cls from './Select.module.scss';
import { Input } from '../Input/Input';
import { InputWrapperBaseProps } from '../Input/InputWrapper/InputWrapper';
import {useSelector} from "react-redux";

type CustomOption = { icon?: any; label: any; value: any };

type OriginalSelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> = Props<Option, IsMulti, Group>;

type SelectProps = OriginalSelectProps<CustomOption> & InputWrapperBaseProps;
type RefType = SelectType<CustomOption, false, GroupBase<CustomOption>>;

export const Select = forwardRef<RefType, SelectProps>((props, ref) => {
  const { error, ...other } = props;

  const platform = useSelector((state: any) => state.platformReducer.platform);

  return (
    <Input.Wrapper error={error}>
      <ReactSelect
        ref={ref}
        unstyled
        isSearchable={false}
        classNames={{
          container: () => clsx(cls.select, { [cls.selectError]: error }),
          control: (state) =>
            clsx(cls.control, {
              [cls.controlFocus]: state.menuIsOpen,
            }),
          valueContainer: () => platform === 'Windows' ? cls.valueContainerWin : cls.valueContainer,
          placeholder: () => cls.placeholder,
          indicatorsContainer: () => cls.indicatorContainer,
          menuList: () => cls.menuList,
          menu: () => cls.menu,
          noOptionsMessage: () => cls.noOptionMessage,
          option: (state) =>
            clsx(cls.option, {
              [cls.optionSelected]: state.isSelected,
              [cls.optionDisabled]: state.isDisabled,
            }),
        }}
        components={{
          IndicatorSeparator: null,
        }}
        {...other}
      />
    </Input.Wrapper>
  );
});
