export interface Filter {
  label: string,
  key: string,
  value: number | string | (string | number | never)[] | null,
  options?: Options[]
}

export interface Options {
  title: string,
  props: {
    value: number | string
  }
}