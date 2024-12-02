export const auth = 'http://178.57.106.190:18081/token';

export const translator = 'http://10.35.16.1:8081';
export const objectManager = 'http://10.35.16.1:8082';
export const actionRouter = 'http://10.35.16.1:8083';

export const paths = {
  // Translator
  privateRoomsList: `${translator}/private/rooms-list-all`,
  privateZonesOrder: `${translator}/private/zones/order`,

  // Object Manager
  scripts: `${objectManager}/scripts`,
  objects: `${objectManager}/objects`,
  objectsTags: `${objectManager}/objects/tags`,
  objectModel: `${objectManager}/objects/model`,
  objectsTypes: `${objectManager}/objects/types`,

  // Action Router
  eventsActions: `${actionRouter}/events/actions`,
  eventsActionsOrder: `${actionRouter}/events/actions/order`,
};
