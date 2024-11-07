import React, {ReactNode, useEffect, useRef} from 'react'
import cls from './ModalWindow.module.scss';

type ModalWindowProps = {
    children: ReactNode;
    modalWindowOpen: boolean;
    onClose: () => void;
}

export const ModalWindow: React.FC<ModalWindowProps> = ({modalWindowOpen, children, onClose}) => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as HTMLElement)) {
                onClose();
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
        <div className={cls.modalWindowWrapper} data-modal-window-open={modalWindowOpen}>
            <div className={cls.modalWindowContent} ref={modalRef}>
                {children}
            </div>
        </div>
    );
};