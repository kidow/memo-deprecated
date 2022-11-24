import classnames from 'classnames'
import type { FC } from 'react'

export interface Props {
  label?: string
  indeterminate?: boolean
  checked?: boolean
  onChange?: (checked: boolean) => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
}
interface State {}

const Checkbox: FC<Props> = ({
  label,
  indeterminate = false,
  checked = false,
  onChange,
  size = 'md',
  disabled = false
}) => {
  return (
    <label
      className={classnames(
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        {
          'inline-flex items-center': !!label,
          'gap-1': !!label && size === 'sm',
          'gap-1.5': !!label && size === 'md',
          'gap-2': !!label && size === 'lg',
          'gap-2.5': !!label && size === 'xl',
          'h-4': size === 'sm',
          'h-5': size === 'md',
          'h-6': size === 'lg',
          'h-7': size === 'xl'
        }
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        ref={(input) => {
          if (!input || indeterminate === undefined) return
          input.indeterminate = indeterminate
        }}
        className={classnames(
          'relative cursor-pointer appearance-none border duration-150 disabled:cursor-not-allowed',
          size === 'sm' ? 'rounded' : 'rounded-lg',
          {
            'h-4 w-4': size === 'sm',
            'h-5 w-5': size === 'md',
            'h-6 w-6': size === 'lg',
            'h-7 w-7': size === 'xl',
            'before:rotate-45': checked,
            'before:top-0.5 before:left-[5px] before:h-2 before:w-1 before:border-b before:border-r':
              checked && size === 'sm',
            'before:top-[3px] before:left-1.5 before:h-2.5 before:w-1.5':
              checked && size === 'md',
            'before:top-1 before:left-[7px] before:h-3 before:w-2':
              checked && size === 'lg',
            'before:top-1 before:left-[9px] before:h-3.5 before:w-2':
              checked && size === 'xl',
            'before:border-b-2 before:border-r-2':
              checked && (size === 'md' || size === 'lg' || size === 'xl'),
            'before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-white':
              !checked && indeterminate,
            'before:h-px before:w-2':
              !checked && indeterminate && size === 'sm',
            'before:h-0.5 before:w-2.5':
              !checked && indeterminate && size === 'md',
            'before:h-[3px] before:w-3':
              !checked && indeterminate && size === 'lg',
            'before:h-1 before:w-3.5':
              !checked && indeterminate && size === 'xl',
            'before:absolute before:border-white': checked || indeterminate,
            'border-orange-500 bg-orange-500':
              !disabled && (checked || indeterminate),
            'bg-white': !checked && !indeterminate,
            'bg-neutral-400': disabled && checked
          }
        )}
        onChange={(e) => {
          if (onChange) onChange(e.target.checked)
        }}
        disabled={disabled}
      />
      {!!label && (
        <span
          className={classnames(
            'select-none',
            disabled ? 'text-neutral-400' : 'text-neutral-800',
            {
              'text-sm': size === 'sm',
              'text-lg': size === 'lg',
              'text-xl': size === 'xl'
            }
          )}
        >
          {label}
        </span>
      )}
    </label>
  )
}

export default Checkbox
