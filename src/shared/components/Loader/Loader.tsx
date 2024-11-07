import {ReactComponent as SpinnerIcon} from '@/shared/assets/icons/spinner.svg';
import cls from './Loader.module.scss';
import clsx from 'clsx';
import {useContext} from "react";
import {SidebarModeContext, SidebarModeContextType} from "@/shared/context/SidebarModeContext";
import {SidebarMode} from "@/shared/const/context";

export interface LoaderProps extends React.SVGAttributes<SVGElement> {
    size?: number;
    className?: string;
    theme?: 'light' | 'dark';
    addUserPopup?: boolean;
}

export const Loader = (props: LoaderProps) => {
    const {size = 18, theme, className, addUserPopup, ...otherProps} = props;
    const {sidebarMode} = useContext(SidebarModeContext) as SidebarModeContextType;

    return (
        <div className={clsx(cls.loaderWrapper,addUserPopup && cls.loaderWrapperAddUserPopup)} data-mini-sidebar={sidebarMode === SidebarMode.MINI}>
            <SpinnerIcon
                {...otherProps}
                className={clsx(cls.loader, className, {
                    [cls.loaderDark]: theme === 'dark',
                    [cls.loaderLight]: theme === 'light',
                })}
                width={size}
                height={size}
            />
        </div>
    );
};
