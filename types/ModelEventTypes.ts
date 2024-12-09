export type Actions = any[]

export interface Event {
  code: string;
  name: string;
  description: string;
  actions: Actions;
}

export interface EventsObject {
  [key: string]: Event[]
}
