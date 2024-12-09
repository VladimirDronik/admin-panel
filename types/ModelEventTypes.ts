export type Action = any

export interface Event {
  code: string;
  name: string;
  description: string;
  actions: Action[]
  actionTypes: {
    method: number
    delay: number
    script: number
    notification: number
  };
}

export interface EventsObject {
  [key: string]: Event[]
}
