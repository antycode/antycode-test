import React from 'react';
import cls from './ModalDialog.module.scss';
import clsx from 'clsx';
import Modal from 'react-modal';

type ModalDialogProps = {
    children: JSX.Element
    isOpen: boolean;
    onRequestClose: () => void;
    className?: string;
    testId?: string;
};

export const ModalDialog: React.FC<ModalDialogProps> = ({
        isOpen,
        onRequestClose,
        children,
        className,
        testId
    }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName={cls.modalOverlay}
            className={clsx(cls.modalDialog, className)}
            data-testid={testId}>
            {children}
        </Modal>
    )
}
