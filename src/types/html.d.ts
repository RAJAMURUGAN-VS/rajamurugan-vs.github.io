/* eslint-disable @typescript-eslint/no-unused-vars */
import 'react'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface HTMLAttributes<T> {
    'data-theme'?: 'dark' | 'light'
  }
}
