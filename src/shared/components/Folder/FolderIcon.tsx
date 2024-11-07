import React, {ReactNode, useEffect, useRef} from 'react'
import cls from './FolderIcon.scss';

type ModalWindowProps = {
    color: string;
}

export const FolderIcon: React.FC<ModalWindowProps> = ({color}) => {

    return (
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.6421 1.47368H6.82105L5.30526 0H1.51579C0.682105 0 1.77632e-08 0.663158 0 1.47368V4.42105H15.1579V2.94737C15.1579 2.13684 14.4758 1.47368 13.6421 1.47368Z" fill={color} style={{opacity: 0.6}}/>
            <path d="M13.6421 1.26172H1.51579C0.682105 1.26172 1.77632e-08 1.95194 0 2.79555V10.4647C0 11.3083 0.682105 11.9986 1.51579 11.9986H13.6421C14.4758 11.9986 15.1579 11.3083 15.1579 10.4647V2.79555C15.1579 1.95194 14.4758 1.26172 13.6421 1.26172Z" fill={color}/>
        </svg>
    );
};