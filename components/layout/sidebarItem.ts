// Builtin modules
import {
  IconVideo,
  IconDoor,
  IconScript,
  IconResize,
  IconTimeline,
  IconSettings,
  IconBrandTabler,
  IconPlug,
  IconLogs,
  IconDevices,
  IconUsers,
  IconCalendarWeek,
} from '@tabler/icons-vue';

export interface Menu {
  title?: string,
  icon?: any,
  to?: string,
  header?: string
}

const sidebarItem: Menu[] = [
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
  {
    title: 'pages.scheduler',
    icon: IconCalendarWeek,
    to: '/scheduler',
  },
  {
    title: 'pages.scenario',
    icon: IconScript,
    to: '/scenario',
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
