import cls from './TableItemsPerPageSelect.module.scss';
import {ReactComponent as ArrowType1Icon} from '@/shared/assets/icons/arrow-type-1.svg';
import {useTranslation} from "react-i18next";
import {useState} from "react";

type CustomOption = { value: number };

interface TableItemsPerPageSelectProps {
    value?: CustomOption;
    options?: CustomOption[];
    onChange: (value: number) => void;
}

export const TableItemsPerPageSelect = (props: TableItemsPerPageSelectProps) => {
    const {value, onChange, options} = props;

    const {t} = useTranslation();

    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (option: CustomOption) => {
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className={cls.countSelect}>
            <span className={cls.text}>{t('Output by')}:</span>
            <div className={cls.selectWrapper}>
                <div
                    className={cls.selectedOption}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {value && value.value}
                    <ArrowType1Icon className={cls.dropdownIndicator} />
                </div>
                {isOpen && (
                    <div className={cls.optionsList}>
                        {options?.map((option, index) => (
                            <div
                                key={index}
                                className={cls.option}
                                onClick={() => handleOptionClick(option)}
                            >
                                {option.value}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
