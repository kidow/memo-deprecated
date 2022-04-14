import classnames from 'classnames'
import type { FC, DetailedHTMLProps, ButtonHTMLAttributes } from 'react'

export interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: 'sm' | 'md' | 'lg'
}

const Button: FC<Props> = ({ size = 'md', children, className, ...props }) => {
  return (
    <button
      {...props}
      className={classnames(
        'rounded-md bg-neutral-900 font-medium leading-6 text-white transition duration-150 ease-in-out disabled:cursor-not-allowed dark:border dark:border-neutral-400 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-200 dark:hover:text-neutral-200',
        {
          'gap-2 py-1 px-3 text-sm': size === 'sm',
          'gap-3 py-2 px-4 text-base': size === 'md',
          'gap-3 py-3 px-5 text-lg': size === 'lg'
        },
        className
      )}
    >
      {children}
    </button>
  )
}

export default Button
