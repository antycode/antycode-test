import { ReactNode } from "react";
import cls from '../DropdownMenu.module.scss'

interface IDropdownItem {
  icon?: ReactNode; 
  label: string; 
  onClick: () => void; 
}

const DropdownItem = ({ icon, label, onClick }:IDropdownItem) => {
  return (
    <li onClick={onClick} className={cls.listItem}>
      {icon && <span className={cls.icon}>{icon}</span>}
      <p>{label}</p>
    </li>
  );
};

export default DropdownItem;