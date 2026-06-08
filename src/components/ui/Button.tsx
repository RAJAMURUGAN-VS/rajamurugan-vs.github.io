import React from 'react'
import { cn } from '@/lib/utils'

interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
}

type ButtonAsButton = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    href?: undefined
    download?: undefined
  }

type ButtonAsAnchor = BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
    href: string
    download?: boolean | string
  }

type ButtonProps = ButtonAsButton | ButtonAsAnchor

const variantClasses: Record<NonNullable<BaseButtonProps['variant']>, string> = {
  primary: 'bg-accent text-[#080808] font-semibold hover:bg-[#a5f0fa]',
  secondary: 'border border-accent text-accent hover:bg-accent/10',
  ghost: 'text-muted hover:text-[#e8e8e8]',
}

const sizeClasses: Record<NonNullable<BaseButtonProps['size']>, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const baseClasses =
  'inline-flex items-center justify-center rounded-[var(--radius-md)] transition-all duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className)

  if ('href' in props && props.href !== undefined) {
    const { href, download, ...anchorProps } = props as ButtonAsAnchor
    return (
      <a href={href} download={download} className={classes} {...anchorProps}>
        {children}
      </a>
    )
  }

  const { ...buttonProps } = props as ButtonAsButton
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  )
}

export default Button
