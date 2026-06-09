import 'react'

declare module 'react' {
  interface HTMLAttributes<T> {
    'data-theme'?: 'dark' | 'light'
  }
}
