import { ReactNode } from 'react';
import cls from './Tooltip.module.scss';

interface TooltipProps {
  content: ReactNode;
}

export const Tooltip = (props: TooltipProps) => {
  const { content } = props;

  return <div className={cls.tooltip}>{content}</div>;
};
