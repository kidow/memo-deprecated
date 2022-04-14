import { useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { XIcon } from '@heroicons/react/solid'
import classnames from 'classnames'
import { Portal } from 'components'

import LinkModal from './Link'
import ImageModal from './Image'
import VideoModal from './Video'
import HelpModal from './Help'

interface Props extends ModalProps {
  children: ReactNode
}
interface IModal extends FC<Props> {
  Link: typeof LinkModal
  Image: typeof ImageModal
  Video: typeof VideoModal
  Help: typeof HelpModal
}

const Modal: IModal = ({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-lg',
  title,
  description,
  padding = true,
  footer
}) => {
  if (!isOpen) return null
  const onEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }

  useEffect(() => {
    window.addEventListener('keydown', onEscape)
    return () => {
      window.removeEventListener('keydown', onEscape)
    }
  }, [])
  return (
    <Portal role="dialog">
      <div
        className="fixed inset-0 z-30 overflow-y-auto"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <div className="flex min-h-screen justify-center p-2 text-center sm:p-0 md:block">
          <div
            className="fixed inset-0 bg-white opacity-30 transition-opacity dark:bg-black"
            aria-hidden="true"
            onClick={onClose}
          />
          <span
            className="hidden h-screen align-middle md:inline-block"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div
            className={classnames(
              'my-8 inline-block w-full transform overflow-hidden rounded-lg text-left align-top shadow-xl transition-all',
              maxWidth
            )}
          >
            <header className="border-t-4 border-indigo-500 bg-white dark:border-indigo-800 dark:bg-neutral-800">
              <div className="flex items-center border-b border-neutral-200 py-3 px-4 dark:border-neutral-600">
                <div className="flex-1">
                  <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {title}
                  </h1>
                  {!!description && (
                    <p className="mt-1 text-sm text-neutral-400">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-900"
                >
                  <XIcon className="h-5 w-5 text-neutral-800 dark:text-neutral-100" />
                </button>
              </div>
            </header>
            <div
              className={classnames('bg-white dark:bg-neutral-800', {
                'py-6 px-7': padding,
                'rounded-b-lg': !footer
              })}
            >
              {children}
            </div>
            {footer && (
              <footer className="rounded-b-lg border-t bg-white py-4 px-7 dark:border-neutral-600 dark:bg-neutral-800">
                {footer}
              </footer>
            )}
          </div>
        </div>
      </div>
    </Portal>
  )
}

Modal.Link = LinkModal
Modal.Image = ImageModal
Modal.Video = VideoModal
Modal.Help = HelpModal

export default Modal
