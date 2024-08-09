import { ApertureIcon, LayoutDashboardIcon} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'Home' },
  {
    title: 'Dashboard',
    icon: LayoutDashboardIcon,
    to: '/dashboard',
  },
  {
    title: 'Sample Page',
    icon: ApertureIcon,
    to: '/sample-page',
  },
];

export default sidebarItem;
