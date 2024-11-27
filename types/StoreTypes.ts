export type Request<Data> = {
  data: Data,
  meta: {
    content_length: string,
    duration: number
  }
}

export type RequestResponse<Data> = {
  response: Data,
  meta: {
    content_length: string,
    duration: number
  }
}

export type APIDataResponse<Data> = {
  data: RequestResponse<Data> | undefined,
  error: any | null
  status: AsyncDataRequestStatus
  pending: boolean
  clear: () => void
  refresh: () => Promise<void>
  execute: () => Promise<void>
}

export type APIData<Data> = {
  data: Request<Data> | undefined,
  error: any | null
  status: AsyncDataRequestStatus
  pending: boolean
  clear: () => void
  refresh: () => Promise<void>
  execute: () => Promise<void>
}

export type AsyncDataRequestStatus = 'idle' | 'pending' | 'success' | 'error'
