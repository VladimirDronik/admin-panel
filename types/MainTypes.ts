export interface Filter {
  label: string,
  key: string,
  value: any,
  show?: boolean
  options?: Options[]
}

export interface Options {
  title: string,
  props: {
    value: number | string
  }
}
