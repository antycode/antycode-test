import React, { useState } from 'react';
import cls from './DropdownMenu.module.scss';
import clsx from 'clsx';
import DropdownItem from './DropdownItem/DropdownItem';
import { usePopper } from 'react-popper';

interface IDropdownMenu {
  showDropdown: boolean;
  items: any[];
  referenceElement: HTMLElement | null;
  offset?: [number, number]; 
  isFlipEnabled?: boolean;   
}

const DropdownMenu = React.forwardRef<HTMLDivElement, IDropdownMenu>(
  ({ items, showDropdown, referenceElement, offset = [0, 0], isFlipEnabled = false }, ref) => {
    const [dropdownElement, setDropdownElement] = useState<HTMLDivElement | null>(null);

    const { styles, attributes, update } = usePopper(referenceElement, dropdownElement, {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: offset,
          },
        },
        {
          name: 'flip',
          enabled: isFlipEnabled,
        },
        {
          name: 'preventOverflow',
          options: {
            boundary: 'clippingParents',
          },
        },
      ],
    });
    
    React.useEffect(() => {
      if (showDropdown && update) {
        update(); 
      }
    }, [showDropdown, update]);
    return (
      <div
        ref={(el) => {
          setDropdownElement(el); 
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        className={clsx(cls.dropdownMenu, {
          [cls.dropdownMenuActive]: showDropdown,
        })}
        style={styles.popper} 
        {...attributes.popper} 
      >
        <ul className={cls.listMenu}>
          {items.map((item, index) => (
            <DropdownItem key={index} {...item} />
          ))}
        </ul>
      </div>
    );
  }
);
export default DropdownMenu;
