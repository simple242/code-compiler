export interface Solution {
  status: {
    description: string
  }
  stderr: any
  compile_output: string | null
  token?: string
  stdout?: string
  time?: string
  memory?: number
}
