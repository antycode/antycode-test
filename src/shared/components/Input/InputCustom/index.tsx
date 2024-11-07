import React, { forwardRef } from 'react';
import cls from './InputCustom.module.scss';
import clsx from 'clsx';
import {useTranslation} from "react-i18next";

interface IInputCustom {
    title: string;
    renderComponent?: any;
    inputType?: boolean;
    inputValue?: string | number;
    handleInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    inputRef?: React.RefObject<HTMLInputElement>;
    titleBottom?: boolean;
    type?: string;
    className?: string;
    placeholder?: string;
}

export const InputCustom = forwardRef<HTMLInputElement, IInputCustom>(
    (
        {
            title,
            renderComponent,
            inputType,
            inputValue,
            handleInput,
            inputRef,
            titleBottom,
            type,
            className,
            placeholder,
        },
        ref
    ) => {
        const { t } = useTranslation();
        return (
            <div className={clsx(cls.inputWrapper, className)}>
                <div className={cls.inputMainWrapper}>
                    {/*<div className={clsx(cls.inputWrapperTitle,*/}
                    {/*    { [cls.inputTextBottom]: titleBottom })}>*/}
                    {/*    {t(title)}*/}
                    {/*</div>*/}
                    {/*<div className={cls.inputDivider} />*/}
                    <div className={cls.inputWrapperChildren}>
                        {inputType && (
                            <input
                                ref={inputRef}
                                type={type}
                                className={cls.input}
                                value={inputValue}
                                onChange={handleInput}
                                placeholder={placeholder}
                            />
                        )}
                        {!inputType && renderComponent}
                    </div>
                </div>
            </div>
        );
    }
);

