export interface Filter {
  label: string,
  key: string,
  value: any,
  show?: boolean
  options?: (Options | string)[]
}

export interface Options {
  title: string,
  props: {
    value: any
  }
}

export interface Header {
  text: string,
  value: string,
}
