import { useCallback, useEffect, useRef } from 'react'
import type { FC, ChangeEvent } from 'react'
import { Icon, Modal, Tooltip } from 'components'
import { useObjectState } from 'services'
import classnames from 'classnames'

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return function (...args: any) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

type Theme = 'light' | 'dark'
interface State {
  content: string
  isLinkOpen: boolean
  isImageOpen: boolean
  isVideoOpen: boolean
  isHelpOpen: boolean
  isCodeMode: boolean
  preview: string
  theme: Theme
}

const App: FC = () => {
  const [
    {
      content,
      isLinkOpen,
      isHelpOpen,
      isImageOpen,
      isVideoOpen,
      isCodeMode,
      preview,
      theme
    },
    setState
  ] = useObjectState<State>({
    content: '',
    isLinkOpen: false,
    isHelpOpen: false,
    isImageOpen: false,
    isVideoOpen: false,
    isCodeMode: false,
    preview: '',
    theme: (window.localStorage.getItem('theme') as Theme) || 'light'
  })
  const ref = useRef<HTMLDivElement>(null)

  const saveValue = useCallback(
    debounce(
      (value: string) => window.localStorage.setItem('content', value),
      200
    ),
    []
  )

  const onInput = (e: ChangeEvent<HTMLDivElement>) => {
    setState({ content: e.target.innerHTML })
    saveValue(e.target.innerHTML)
  }

  const onThemeChange = () => {
    if (theme === 'light') {
      window.localStorage.setItem('theme', 'dark')
      document.getElementsByTagName('html')[0].classList.add('dark')
      setState({ theme: 'dark' })
    }
    if (theme === 'dark') {
      window.localStorage.setItem('theme', 'light')
      document.getElementsByTagName('html')[0].classList.remove('dark')
      setState({ theme: 'light' })
    }
  }

  const htmlToDom = (html: string) => {
    const newElement = document.createElement('div')
    newElement.innerHTML = html
    return newElement.children[0]
  }

  const Heading1 = () => {
    const selection = document.getSelection()
    if (!selection) return
    for (let i = selection.rangeCount; i--; ) {
      const wrapper = htmlToDom('<h1/>')
      const range = selection.getRangeAt(i)
      wrapper.appendChild(range.extractContents())
      range.insertNode(wrapper)
    }
    // document.execCommand('formatBlock', false, 'h1')
  }

  const Heading2 = () => {
    document.execCommand('formatBlock', false, 'h2')
  }

  const Heading3 = () => {
    document.execCommand('formatBlock', false, 'h3')
  }

  const Heading4 = () => {
    document.execCommand('formatBlock', false, 'h4')
  }

  const Bold = () => {
    document.execCommand('bold')
  }

  const Italic = () => {
    document.execCommand('italic')
  }

  const Underline = () => {
    document.execCommand('underline')
  }

  const StrikeThrough = () => {
    document.execCommand('strikeThrough')
  }

  const Clear = () => {
    document.execCommand('removeFormat')
  }

  const UnorderedList = () => {
    document.execCommand('insertUnorderedList')
  }

  const OrderedList = () => {
    document.execCommand('insertOrderedList')
  }

  const Blockquote = () => {
    document.execCommand('formatBlock', false, 'blockquote')
  }

  const Code = () => {
    if (!ref.current) return

    if (isCodeMode) {
      ref.current.innerHTML = content
      setState({ isCodeMode: false })
    } else {
      setState({ preview: ref.current.innerHTML, isCodeMode: true })
    }
  }

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!e.ctrlKey || e.code === 'ControlLeft') return
      e.preventDefault()
      if (e.code === 'Digit1') Heading1()
      if (e.code === 'Digit2') Heading2()
      if (e.code === 'Digit3') Heading3()
      if (e.code === 'Digit4') Heading4()
      if (e.code === 'KeyB') Bold()
      if (e.code === 'KeyI') Italic()
      if (e.code === 'KeyU') Underline()
      if (e.code === 'KeyS') StrikeThrough()
      if (e.code === 'KeyC') Clear()
      if (e.code === 'Digit5') UnorderedList()
      if (e.code === 'Digit6') OrderedList()
      if (e.code === 'KeyQ') Blockquote()
      if (e.code === 'KeyL') setState({ isLinkOpen: !isLinkOpen })
      if (e.code === 'KeyM') setState({ isImageOpen: !isImageOpen })
      if (e.code === 'KeyV') setState({ isVideoOpen: !isVideoOpen })
      if (e.code === 'KeyD') Code()
      if (e.code === 'KeyH') setState({ isHelpOpen: !isHelpOpen })
    },
    [isLinkOpen, isImageOpen, isVideoOpen, isCodeMode, isHelpOpen]
  )

  useEffect(() => {
    document.onkeydown = onKeyDown

    return () => {
      document.onkeydown = null
    }
  }, [isLinkOpen, isImageOpen, isVideoOpen, isCodeMode, isHelpOpen])

  useEffect(() => {
    if (window.localStorage.getItem('theme') === 'dark') {
      document.getElementsByTagName('html')[0].classList.add('dark')
    }

    if (!ref.current) return

    const currentContent = window.localStorage.getItem('content')
    if (!currentContent) {
      ref.current.focus()
      return
    }

    ref.current.innerHTML = currentContent
    setState({ content: currentContent })

    const selection = window.getSelection()
    const newRange = document.createRange()
    newRange.selectNodeContents(ref.current)
    newRange.collapse(false)
    selection?.removeAllRanges()
    selection?.addRange(newRange)

    return () => {
      window.localStorage.setItem('content', content)
    }
  }, [])
  return (
    <>
      <div className="container mx-auto max-w-screen-md">
        <nav role="toolbar" className="toolbar">
          <ul>
            <li>
              <Tooltip content="제목 1 (Ctrl + 1)">
                <button onClick={Heading1}>
                  <Icon.Heading1 />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="제목 2 (Ctrl + 2)">
                <button onClick={Heading2}>
                  <Icon.Heading2 />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="제목 3 (Ctrl + 3)">
                <button onClick={Heading3}>
                  <Icon.Heading3 />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="제목 4 (Ctrl + 4)">
                <button>
                  <Icon.Heading4 />
                </button>
              </Tooltip>
            </li>
          </ul>
          <ul>
            <li>
              <Tooltip content="굵게 (Ctrl + B)">
                <button>
                  <Icon.Bold />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="기울임꼴 (Ctrl + I)">
                <button>
                  <Icon.Italic />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="밑줄 (Ctrl + U)">
                <button>
                  <Icon.Underline />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="취소선 (Ctrl + S)">
                <button>
                  <Icon.StrikeThrough />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="서식 지우기 (Ctrl + C)">
                <button>
                  <Icon.Clear />
                </button>
              </Tooltip>
            </li>
          </ul>
          <ul>
            <li>
              <Tooltip content="글자색">
                <button>
                  <Icon.TextColor />
                </button>
              </Tooltip>
            </li>
          </ul>
          <ul>
            <li>
              <Tooltip content="글머리 기호 (Ctrl + 5)">
                <button>
                  <Icon.UnorderedList />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="번호 매기기 (Ctrl + 6)">
                <button>
                  <Icon.OrderedList />
                </button>
              </Tooltip>
            </li>
          </ul>
          <ul>
            <li>
              <Tooltip content="인용문 (Ctrl + Q)">
                <button>
                  <Icon.Blockquote />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="링크 (Ctrl + L)">
                <button onClick={() => setState({ isLinkOpen: true })}>
                  <Icon.Link />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="이미지 (Ctrl + M)">
                <button onClick={() => setState({ isImageOpen: true })}>
                  <Icon.Image />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="동영상 (Ctrl + V)">
                <button onClick={() => setState({ isVideoOpen: true })}>
                  <Icon.Video />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="코드보기 (Ctrl + D)">
                <button onClick={Code}>
                  <Icon.Code />
                </button>
              </Tooltip>
            </li>
          </ul>
          <ul>
            <li>
              <Tooltip content="도움말 (Ctrl + H)">
                <button onClick={() => setState({ isHelpOpen: true })}>
                  <Icon.Help />
                </button>
              </Tooltip>
            </li>
          </ul>
        </nav>

        <textarea
          className={classnames(
            'min-h-[400px] w-full cursor-default resize-none border-none bg-transparent px-3 focus:outline-none sm:px-0',
            isCodeMode ? 'block' : 'hidden'
          )}
          readOnly
          value={preview}
        />
        <div
          contentEditable
          spellCheck={false}
          className={classnames(
            "prose-sm prose-neutral min-h-[400px] px-3 pb-40 empty:before:italic empty:before:text-neutral-500 empty:before:content-['아무_내용이나_입력하세요...'] focus:outline-none dark:prose-invert sm:prose sm:px-0",
            isCodeMode ? 'hidden' : 'block'
          )}
          onInput={onInput}
          ref={ref}
        ></div>
      </div>

      <a
        href="https://github.com/kidow"
        rel="noreferrer"
        className="fixed top-2 right-2 hidden sm:inline-block"
        target="_blank"
      >
        <button>
          <Icon.Github />
        </button>
      </a>

      <button
        className="fixed bottom-4 right-4 duration-150"
        onClick={onThemeChange}
      >
        {theme === 'dark' ? <Icon.Moon /> : <Icon.Light />}
      </button>

      <Modal.Link
        isOpen={isLinkOpen}
        onClose={() => setState({ isLinkOpen: false })}
      />
      <Modal.Image
        isOpen={isImageOpen}
        onClose={() => setState({ isImageOpen: false })}
      />
      <Modal.Video
        isOpen={isVideoOpen}
        onClose={() => setState({ isVideoOpen: false })}
      />
      <Modal.Help
        isOpen={isHelpOpen}
        onClose={() => setState({ isHelpOpen: false })}
      />
    </>
  )
}

export default App
