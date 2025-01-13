export interface Filter {
  label: string,
  key: string,
  value: any,
  show?: boolean
  options?: (Options | string)[]
}

export interface Options {
  title: string,
  value: string,
}

export interface Header {
  text: string,
  value: string,
}
