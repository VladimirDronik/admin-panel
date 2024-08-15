import { ApertureIcon, LayoutDashboardIcon } from 'vue-tabler-icons';

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
  { header: 'Оборудование' },
  {
    title: 'Контроллеры',
    icon: ApertureIcon,
    to: '/controllers',
  },
  {
    title: 'Устройства',
    icon: ApertureIcon,
    to: '/login',
  },
  {
    title: 'Датчики',
    icon: ApertureIcon,
    to: '/login',
  },
  { header: 'Визуализация' },
  {
    title: 'Мобильное прил.',
    icon: ApertureIcon,
    to: '/login',
  },
  {
    title: 'Планшетная версия',
    icon: ApertureIcon,
    to: '/login',
  },
  { header: 'Функции' },
  {
    title: 'Сценарии',
    icon: ApertureIcon,
    to: '/login',
  },
  {
    title: 'Графики',
    icon: ApertureIcon,
    to: '/login',
  },
  {
    title: 'Планировщик',
    icon: ApertureIcon,
    to: '/login',
  },
  {
    title: 'Оповещения',
    icon: ApertureIcon,
    to: '/login',
  },
];

export default sidebarItem;
