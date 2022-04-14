import { Children, cloneElement, useRef, useEffect, useMemo } from 'react'
import type { ReactElement, MouseEvent, ReactNode, FC } from 'react'
import classnames from 'classnames'
import { useObjectState } from 'services'
import { Portal } from 'components'

interface Props {
  content: ReactNode
  children: ReactNode
}
interface State {
  isOpen: boolean
  triggerTop: number
  triggerLeft: number
  triggerWidth: number
  tooltipWidth: number
  tooltipHeight: number
}

const Tooltip: FC<Props> = ({ children, content, ...props }) => {
  const [
    {
      isOpen,
      triggerLeft,
      triggerTop,
      triggerWidth,
      tooltipHeight,
      tooltipWidth
    },
    setState,
    ,
    resetState
  ] = useObjectState<State>({
    isOpen: false,
    triggerTop: 0,
    triggerLeft: 0,
    triggerWidth: 0,
    tooltipHeight: 0,
    tooltipWidth: 0
  })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const child = Children.only(
    typeof children === 'string' ? (
      <div tabIndex={-1}>{children}</div>
    ) : (
      children
    )
  ) as ReactElement
  const trigger = cloneElement(child, {
    ...props,
    className: 'inline-block',
    onMouseEnter: (e: MouseEvent) => {
      const element = e.target as HTMLElement
      const { width, top, left } = element.getBoundingClientRect()
      setState({
        isOpen: true,
        triggerLeft: left,
        triggerTop: top,
        triggerWidth: width
      })
    },
    onMouseLeave: () => resetState()
  })

  const left: number = useMemo(() => {
    return triggerLeft + triggerWidth / 2 - tooltipWidth / 2
  }, [triggerLeft, triggerWidth, tooltipWidth])

  const top: number = useMemo(() => {
    return triggerTop + tooltipHeight + 22
  }, [triggerTop, tooltipHeight])

  const isPositioned: boolean = useMemo(() => {
    return !!tooltipWidth && !!tooltipHeight
  }, [left, top])

  useEffect(() => {
    if (isOpen && tooltipRef.current) {
      const { height, width } = tooltipRef.current.getBoundingClientRect()
      setState({
        tooltipHeight: height,
        tooltipWidth: width
      })
    }
  }, [isOpen, tooltipRef])
  return (
    <>
      {trigger}
      {isOpen && (
        <Portal role="tooltip">
          <div
            ref={tooltipRef}
            className={classnames(
              'fixed rounded border border-neutral-900 bg-neutral-50 py-1 px-2 text-xs dark:border-none dark:bg-black dark:text-neutral-50',
              isPositioned ? 'visible' : 'invisible'
            )}
            style={{ left, top }}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  )
}

export default Tooltip
