// import { type Component } from 'vue';
// import { ObjectsCategory } from './enums';
// import { deviceFormMapping } from './mappings';
// import DefaultForm from '@/components/forms/DefaultForm.vue';

// export function getDeviceFormComponent(category: ObjectsCategory, type: string): Component {
//   const mapping = deviceFormMapping.find((item) => item.category === category && item.type === type);

//   if (!mapping) {
//     const defaultMapping = deviceFormMapping.find((item) => item.category === ObjectsCategory.Default) as { component: Component } | undefined;

//     return defaultMapping?.component || DefaultForm;
//   }

//   return mapping.component;
// }
