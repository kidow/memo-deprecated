import { useId } from 'react'
import type {
  FC,
  ReactNode,
  DetailedHTMLProps,
  InputHTMLAttributes,
  KeyboardEvent
} from 'react'
import classnames from 'classnames'

export interface Props
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'size'
  > {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  onEnter?: () => void
  error?: ReactNode
  info?: ReactNode
}

const Input: FC<Props> = ({
  size = 'md',
  className,
  onEnter,
  error,
  info,
  ...props
}) => {
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !!onEnter) onEnter()
  }
  const id = useId()
  return (
    <div>
      <div
        className={classnames(
          !!error ? 'border-red-500' : 'border-neutral-300',
          {
            relative: !!props.placeholder,
            'cursor-default': props.readOnly,
            'cursor-not-allowed bg-neutral-100': props.disabled
          }
        )}
      >
        <input
          {...props}
          id={props.id || id}
          className={classnames(
            'block w-full border border-neutral-500 bg-transparent text-neutral-900 focus:outline-none dark:text-neutral-200',
            {
              'rounded-sm text-xs': size === 'xs',
              'p-1': size === 'xs',
              'rounded py-1 text-sm': size === 'sm',
              'px-2': size === 'sm',
              'rounded-md py-2 text-base': size === 'md',
              'px-3': size === 'md',
              'rounded-md py-3 text-lg': size === 'lg',
              'px-4': size === 'lg',
              peer: !!props.placeholder,
              'placeholder-transparent': !!props.placeholder
            },
            !!error
              ? 'border-red-500'
              : 'border-neutral-300 focus:ring focus:ring-orange-400',
            className
          )}
          onKeyDown={onKeyDown}
          spellCheck={false}
        />
        {!!props.placeholder && (
          <label
            htmlFor={props.id || id}
            className={classnames(
              'absolute -top-6 max-w-[calc(100%-24px)] cursor-text select-none truncate text-neutral-600 transition-all peer-placeholder-shown:text-neutral-400 peer-focus:left-0 peer-focus:max-w-full peer-focus:cursor-default peer-focus:text-neutral-600 dark:text-neutral-200 dark:peer-focus:text-neutral-200',
              !!props.value ? 'left-0' : 'left-3',
              {
                'text-xs peer-placeholder-shown:left-1 peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-xs peer-focus:-top-5 peer-focus:text-xs':
                  size === 'xs',
                'text-sm peer-placeholder-shown:left-1.5 peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-sm':
                  size === 'sm',
                'text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm':
                  size === 'md',
                '-top-7 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-lg peer-focus:-top-7 peer-focus:text-base':
                  size === 'lg'
              }
            )}
          >
            {props.placeholder}
          </label>
        )}
      </div>
      {(!!error || !!info) && (
        <div
          className={classnames('mt-1 text-xs', {
            'text-red-500': !!error,
            'text-neutral-400': !!info
          })}
        >
          {error || info}
        </div>
      )}
    </div>
  )
}

export default Input
