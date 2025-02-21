export const auth = `${import.meta.env.VITE_AUTH}/token`;

export const translator = import.meta.env.VITE_TRANSLATOR;
export const objectManager = import.meta.env.VITE_OBJECT_MANAGET;
export const actionRouter = import.meta.env.VITE_ACTION_ROUTER;

let result = {
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
  privateItemsSensor: `${translator}/private/item/sensor`,

  // Object Manager
  scripts: `${objectManager}/scripts`,
  objects: `${objectManager}/objects`,
  objectsTags: `${objectManager}/objects/tags`,
  objectsByTags: `${objectManager}/objects/by_tags`,
  objectModel: `${objectManager}/objects/model`,
  objectsTypes: `${objectManager}/objects/types`,
  controllers: `${objectManager}/controllers`,
  objectsByProps: `${objectManager}/objects/by_props`,

  // Action Router
  eventsActions: `${actionRouter}/events/actions`,
  eventsActionsOrder: `${actionRouter}/events/actions/order`,
};
if (import.meta.env.VITE_USE_OWN_URL) {
  const apiPath = `${window.location.origin}:8081`;
  result = {
    // Translator
    privateCp: `${apiPath}/private/cp`,
    privateItem: `${apiPath}/private/item`,
    privateRoom: `${apiPath}/private/room`,
    privateUsers: `${apiPath}/private/users`,
    privateSensor: `${apiPath}/private/sensor`,
    privateWizard: `${apiPath}/private/wizard/create_item`,
    privateRoomsList: `${apiPath}/private/rooms-list-all`,
    privateZonesOrder: `${apiPath}/private/zones/order`,
    privateItemsOrder: `${apiPath}/private/items/order`,
    privateItemsSensor: `${apiPath}/private/item/sensor`,

    // Object Manager
    scripts: `${apiPath}/scripts`,
    objects: `${apiPath}/objects`,
    objectsTags: `${apiPath}/objects/tags`,
    objectsByTags: `${apiPath}/objects/by_tags`,
    objectModel: `${apiPath}/objects/model`,
    objectsTypes: `${apiPath}/objects/types`,
    controllers: `${apiPath}/controllers`,
    objectsByProps: `${objectManager}/objects/by_props`,

    // Action Router
    eventsActions: `${apiPath}/events/actions`,
    eventsActionsOrder: `${apiPath}/events/actions/order`,
  };
}

export const paths = result;
