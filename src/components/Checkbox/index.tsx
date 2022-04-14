import type { FC, ReactNode } from 'react'
import classnames from 'classnames'

export interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  className?: string
}

const Checkbox: FC<Props> = ({ checked, onChange, label, className }) => {
  return (
    <label className="mb-0 inline-flex cursor-pointer items-center">
      <input
        onChange={(e) => onChange(e.target.checked)}
        type="checkbox"
        checked={checked}
      />
      <span
        className={classnames(
          'ml-1.5 text-sm text-neutral-600 dark:text-neutral-200',
          className
        )}
      >
        {label}
      </span>
    </label>
  )
}

export default Checkbox
