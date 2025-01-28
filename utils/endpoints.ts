export const auth = `${import.meta.env.VITE_AUTH}/token`;

export const translator = import.meta.env.VITE_TRANSLATOR;
export const objectManager = import.meta.env.VITE_OBJECT_MANAGET;
export const actionRouter = import.meta.env.VITE_ACTION_ROUTER;

export const paths = {
  // Translator
  privateCp: `${translator}/private/cp`,
  privateItem: `${translator}/private/item`,
  privateRoom: `${translator}/private/room`,
  privateUsers: `${translator}/private/users`,
  privateSensor: `${translator}/private/sensor`,
  privateWizard: `${translator}/private/wizard/create_item`,
  privateRoomsList: `${translator}/private/rooms-list-all`,
  privateZonesOrder: `${translator}/private/zones/order`,
  privateItemsOrder: `${translator}/private/items/order`,

  // Object Manager
  scripts: `${objectManager}/scripts`,
  objects: `${objectManager}/objects`,
  objectsTags: `${objectManager}/objects/tags`,
  objectsByTags: `${objectManager}/objects/by_tags`,
  objectModel: `${objectManager}/objects/model`,
  objectsTypes: `${objectManager}/objects/types`,
  controllers: `${objectManager}/controllers`,

  // Action Router
  eventsActions: `${actionRouter}/events/actions`,
  eventsActionsOrder: `${actionRouter}/events/actions/order`,
};
