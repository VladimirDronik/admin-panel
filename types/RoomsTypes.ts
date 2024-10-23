export interface Room {
  id: number
  is_group: boolean
  rooms_in_group: Room[]
  sort: number
  style: string
  name: string
}

export interface RequestData {
  data: {
    response: Room[]
  }
}
