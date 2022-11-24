import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import { Icon, Modal, Tooltip } from 'components'
import { useObjectState } from 'services'
import Quill from 'quill'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

type Theme = 'light' | 'dark'
interface State {
  isLinkOpen: boolean
  isImageOpen: boolean
  isVideoOpen: boolean
  isHelpOpen: boolean
  theme: Theme
}

const App: FC = () => {
  const [
    { isLinkOpen, isHelpOpen, isImageOpen, isVideoOpen, theme },
    setState
  ] = useObjectState<State>({
    isLinkOpen: false,
    isHelpOpen: false,
    isImageOpen: false,
    isVideoOpen: false,
    theme: (window.localStorage.getItem('theme') as Theme) || 'light'
  })
  const ref = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (window.localStorage.getItem('theme') === 'dark') {
      document.getElementsByTagName('html')[0].classList.add('dark')
    }

    if (!ref.current) return
    const editor = new Quill(ref.current, {
      theme: 'snow',
      modules: { toolbar: false },
      placeholder: '아무 내용이나 적어보세요...'
    })
    editor.on('text-change', () => {
      const converter = new QuillDeltaToHtmlConverter(editor.getContents().ops)
      const html = converter.convert()
      window.localStorage.setItem('content', html)
    })

    const content = window.localStorage.getItem('content')
    if (!!content && content !== '<p><br/></p>') {
      editor.root.innerHTML = content.replaceAll('<br/>', '<br/>\n')
      const selection = window.getSelection()
      if (!selection) return
      const range = document.createRange()
      range.selectNodeContents(editor.root)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      editor.focus()
    }

    const onAutoFocus = (e: globalThis.KeyboardEvent) => {
      if (!e.target) return
      const target = e.target as HTMLElement

      if (
        target?.className !== 'ql-editor' &&
        Array.from(document.body.childNodes).findIndex(
          (item: any) => item.role === 'dialog'
        ) === -1
      ) {
        const selection = window.getSelection()
        if (!selection) return
        const range = document.createRange()
        range.selectNodeContents(editor.root)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }

    document.addEventListener('keydown', onAutoFocus)
  }, [])
  return (
    <>
      <div className="container mx-auto max-w-screen-md">
        <nav role="toolbar" className="toolbar">
          <ul>
            <li>
              <Tooltip content="제목 1 (Ctrl + 1)">
                <button>
                  <Icon.Heading1 />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="제목 2 (Ctrl + 2)">
                <button>
                  <Icon.Heading2 />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="제목 3 (Ctrl + 3)">
                <button>
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
                <button className="ql-bold">
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
              <Tooltip content="동영상 (Ctrl + X)">
                <button onClick={() => setState({ isVideoOpen: true })}>
                  <Icon.Video />
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="코드 (Ctrl + D)">
                <button>
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

        <div ref={ref} spellCheck={false} />
      </div>

      <a
        href="https://github.com/kidow/memo"
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
