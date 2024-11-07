import clsx from 'clsx';
import cls from './PageCounter.module.scss';

interface PageCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  currentPage:number;
  perPageCount:number;
  totalCount:number;
  className?: string;
}
export const PageCounter = (props: PageCounterProps) => {
  const { currentPage, perPageCount, totalCount, className, ...restProps } = props;
  const getRange = () => {

    if (totalCount > 0) {
      const lowerLimit = (currentPage - 1) * perPageCount + 1;
      const upperLimit = Math.min(currentPage * perPageCount, totalCount);
       return (
        <>
          {lowerLimit}
          <span className={cls.hyphen}>-</span>
          {upperLimit}
        </>
      );
    }
    return '–';
  };

  return (
    <span {...restProps} className={clsx(cls.counter, className)}>
      {getRange()} / {totalCount || '–'}
    </span>
  );
};
