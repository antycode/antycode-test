import { useEffect } from 'react';

type RefType = React.RefObject<HTMLElement>;
export const useOnClickOutside = (
  ref: RefType,           
  ignoreRef: RefType,      
  handler: () => void      
) => {
  const handleClick = (e: MouseEvent) => {
    if (
      ref.current && 
      !ref.current.contains(e.target as Node) && 
      !(ignoreRef.current && ignoreRef.current.contains(e.target as Node)) 
    ) {
      handler();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, ignoreRef, handler]); 
};