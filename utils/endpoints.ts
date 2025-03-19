export const auth = `${import.meta.env.VITE_AUTH}/token`;

export const backendApi = import.meta.env.VITE_USE_OWN_URL ? `${window.location.origin}:8081` : import.meta.env.VITE_BACKEND_API;

export const paths = {
  // Private
  privateCp: `${backendApi}/private/cp`,
  privateItem: `${backendApi}/private/item`,
  privateRoom: `${backendApi}/private/room`,
  privateUsers: `${backendApi}/private/users`,
  privateSensor: `${backendApi}/private/sensor`,
  privateWizard: `${backendApi}/private/wizard/create_item`,
  privateRoomsList: `${backendApi}/private/rooms-list-all`,
  privateZonesOrder: `${backendApi}/private/zones/order`,
  privateItemsOrder: `${backendApi}/private/items/order`,
  privateItemsSensor: `${backendApi}/private/item/sensor`,

  // Objects
  scripts: `${backendApi}/scripts`,
  objects: `${backendApi}/objects`,
  objectsTags: `${backendApi}/objects/tags`,
  objectsByTags: `${backendApi}/objects/by_tags`,
  objectModel: `${backendApi}/objects/model`,
  objectsTypes: `${backendApi}/objects/types`,
  controllers: `${backendApi}/controllers`,
  objectsByProps: `${backendApi}/objects/by_props`,

  // Events
  eventsActions: `${backendApi}/events/actions`,
  eventsActionsOrder: `${backendApi}/events/actions/order`,

  // Scheduler
  cronTasks: `${backendApi}/cron/all-tasks`,
  cronTask: `${backendApi}/cron/task`,
  cronActions: `${backendApi}/cron/actions`,
};
