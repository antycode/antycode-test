import React, { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Button, ButtonProps } from '../Button';
import { ReactComponent as IconReload } from '@/shared/assets/icons/reload.svg';
import cls from './RefetchButton.module.scss';
import clsx from 'clsx';

interface RefetchButtonProps extends ButtonProps {
  iconsize?:number
}

export const RefetchButton = (props: RefetchButtonProps) => {
  const { onClick, iconsize } = props;
  const [isAnim, setIsAnim] = useState(false);

  const ref = useRef(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsAnim(true);
    onClick?.(e);
  };

  return (
    <Button {...props} color="primary" isActionIcon onClick={handleClick}>
      <CSSTransition
        nodeRef={ref}
        in={isAnim}
        // timeout={800}
        addEndListener={() => setIsAnim(false)}
      >
        <span ref={ref} className={clsx(cls.icon, isAnim && cls.iconActive)}>
          <IconReload height={iconsize || 18} />
        </span>
      </CSSTransition>
    </Button>
  );
};
