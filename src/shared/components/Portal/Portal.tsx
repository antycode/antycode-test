import React from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  target?: Element | DocumentFragment;
}

export const Portal = (props: PortalProps) => {
  const { children, target = document.body } = props;

  return createPortal(children, target);
};
