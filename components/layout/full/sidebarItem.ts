import {
  IconVideo,
  IconDoor,
  IconReportAnalytics,
  IconResize,
  IconTimeline,
  IconSettings,
  IconBrandTabler,
  IconPlug,
  IconLogs,
  IconDevices,
  IconUsers,
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
  { header: 'pages.home' },
  {
    title: 'pages.general',
    icon: IconReportAnalytics,
    to: '/general',
  },
  { header: 'pages.equipment' },
  {
    title: 'pages.devices',
    icon: IconDevices,
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
  { header: 'pages.settings' },
  {
    title: 'pages.networkSettings',
    icon: IconPlug,
    to: '/networks',
  },
  {
    title: 'pages.scripts',
    icon: IconBrandTabler,
    to: '/scripts',
  },
  {
    title: 'pages.users',
    icon: IconUsers,
    to: '/users',
  },
  {
    title: 'pages.parameters',
    icon: IconSettings,
    to: '/parameters',
  },
  { header: 'pages.diagnostics' },
  {
    title: 'pages.logging',
    icon: IconLogs,
    to: '/logs',
  },
  {
    title: 'pages.charts',
    icon: IconTimeline,
    to: '/charts',
  },
];

export default sidebarItem;
