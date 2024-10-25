export interface DropdownProps {
  label: string;
  items: { label: string; link?: string; onClick?: () => void }[];
  isMobile?: boolean;
}

export interface LanguageSwitcherProps {
  isMobile?: boolean;
}
