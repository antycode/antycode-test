import React, {ReactNode, useContext, useEffect, useRef} from 'react'
import cls from './ModalWindow2.module.scss';
import {SidebarModeContext, SidebarModeContextType} from "@/shared/context/SidebarModeContext";
import {SidebarMode} from "@/shared/const/context";

type ModalWindowProps = {
    children: ReactNode;
    modalWindowOpen?: boolean;
    onClose?: () => void;
}

export const ModalWindow2: React.FC<ModalWindowProps> = ({modalWindowOpen, children, onClose}) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const {sidebarMode} = useContext(SidebarModeContext) as SidebarModeContextType;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as HTMLElement)) {
                if (onClose) {
                    onClose();
                }
            }
        };

        if (modalWindowOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalWindowOpen, onClose]);
    return (
        <div className={cls.modalWindowWrapper} data-modal-window-open={modalWindowOpen} data-mini-sidebar={sidebarMode === SidebarMode.MINI}>
            <div className={cls.modalWindowContent}>
                {children}
            </div>
        </div>
    );
};