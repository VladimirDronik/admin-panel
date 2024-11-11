import { DevicesIcon } from 'vue-tabler-icons';
import {
  IconVideo, IconDoor, IconReportAnalytics, IconResize, IconGraph,
} from '@tabler/icons-vue';

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
  {
    title: 'pages.general',
    icon: IconReportAnalytics,
    to: '/general',
  },
  { header: 'pages.equipment' },
  {
    title: 'pages.devices',
    icon: DevicesIcon,
    to: '/devices',
  },
  {
    title: 'pages.rooms',
    icon: IconDoor,
    to: '/rooms',
  },
  {
    title: 'pages.video',
    icon: IconVideo,
    to: '/video',
  },
  {
    title: 'pages.display',
    icon: IconResize,
    to: '/display',
  },
  { header: 'pages.charts' },
  {
    title: 'pages.charts',
    icon: IconGraph,
    to: '/devices',
  },
  // { header: 'pages.visualization' },
  // {
  //   title: 'Мобильное прил.',
  //   icon: ApertureIcon,
  //   to: '/login',
  // },
  // {
  //   title: 'Планшетная версия',
  //   icon: ApertureIcon,
  //   to: '/login',
  // },
  // { header: 'Функции' },
  // {
  //   title: 'Сценарии',
  //   icon: ApertureIcon,
  //   to: '/login',
  // },
  // {
  //   title: 'Графики',
  //   icon: ApertureIcon,
  //   to: '/login',
  // },
  // {
  //   title: 'Планировщик',
  //   icon: ApertureIcon,
  //   to: '/login',
  // },
  // {
  //   title: 'Оповещения',
  //   icon: ApertureIcon,
  //   to: '/login',
  // },
];

export default sidebarItem;
