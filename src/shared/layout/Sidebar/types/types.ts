export enum LinkTypes {
  primary,
  secondary,
}

export interface NavbarGroup {
  label?: string;
  type: LinkTypes;
  items: NavbarItem[];
  labelClassName?: string;
}

export interface NavbarItem {
  text: string;
  to: string;
  icon: JSX.Element;
}
