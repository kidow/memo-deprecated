import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import { Icon, Tooltip } from 'components'
import { Icons, toast, useObjectState } from 'services'
import Quill from 'quill'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import { useMemo } from 'react'
import { Modal, Toast } from 'containers'

const icons = Quill.import('ui/icons')
icons['header']['1'] = Icons.Heading1
icons['header']['2'] = Icons.Heading2
icons['header']['3'] = Icons.Heading3
icons['header']['4'] = Icons.Heading4
icons['bold'] = Icons.Bold
icons['italic'] = Icons.Italic
icons['underline'] = Icons.Underline
icons['strike'] = Icons.Strike
icons['clean'] = Icons.Clean
icons['list']['ordered'] = Icons.OrderedList
icons['list']['check'] = Icons.Check
icons['list']['bullet'] = Icons.Bullet
icons['blockquote'] = Icons.Blockquote
icons['link'] = Icons.Link
icons['image'] = Icons.Image
icons['video'] = Icons.Video
icons['code-block'] = Icons.Code

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

  const shortKey: string = useMemo(
    () =>
      window.navigator.platform.toUpperCase().indexOf('MAC') !== -1
        ? '⌘'
        : 'Ctrl',
    []
  )

  useEffect(() => {
    if (window.localStorage.getItem('theme') === 'dark') {
      document.getElementsByTagName('html')[0].classList.add('dark')
    }

    if (!ref.current) return
    const quill = new Quill(ref.current, {
      theme: 'snow',
      modules: { toolbar: '#toolbar' },
      placeholder: '아무 내용이나 적어보세요...'
    })
    quill.on('text-change', (delta) => {
      const converter = new QuillDeltaToHtmlConverter(quill.getContents().ops)
      const html = converter.convert()
      window.localStorage.setItem('content', html)
    })
    quill.keyboard.addBinding({ key: '1', shortKey: true }, () =>
      quill.format('header', '1')
    )
    quill.keyboard.addBinding({ key: '2', shortKey: true }, () =>
      quill.format('header', '2')
    )
    quill.keyboard.addBinding({ key: '3', shortKey: true }, () =>
      quill.format('header', '3')
    )
    quill.keyboard.addBinding({ key: '4', shortKey: true }, () =>
      quill.format('header', '4')
    )
    quill.keyboard.addBinding({ key: 'S', shortKey: true }, (range) =>
      quill.formatText(range, 'strike', true)
    )
    quill.keyboard.addBinding(
      { key: 'E', shortKey: true },
      ({ index, length }) => {
        quill.removeFormat(index, length)
      }
    )
    quill.keyboard.addBinding({ key: '5', shortKey: true }, () =>
      quill.format('list', 'bullet')
    )
    quill.keyboard.addBinding({ key: '6', shortKey: true }, () =>
      quill.format('list', 'unchecked')
    )
    quill.keyboard.addBinding({ key: '7', shortKey: true }, () =>
      quill.format('list', 'ordered')
    )
    quill.keyboard.addBinding({ key: 'Y', shortKey: true }, () =>
      quill.format('blockquote', true)
    )
    quill.keyboard.addBinding({ key: 'D', shortKey: true }, () => {
      quill.format('code-block', true)
    })

    const content = window.localStorage.getItem('content')
    if (!!content && content !== '<p><br/></p>') {
      quill.root.innerHTML = content.replaceAll('<br/>', '<br/>\n')
      const selection = window.getSelection()
      if (!selection) return
      const range = document.createRange()
      range.selectNodeContents(quill.root)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      quill.focus()
    }

    document.addEventListener('keydown', (e) => {
      if (!e.target) return
      const target = e.target as HTMLElement

      const tooltip = Array.from(ref.current!.children).find(
        (item) => item.className.indexOf('ql-tooltip') !== -1
      )

      if (
        target?.className !== 'ql-editor' &&
        Array.from(document.body.childNodes).findIndex(
          (item: any) => item.role === 'dialog'
        ) === -1 &&
        tooltip?.className.indexOf('ql-hidden') !== -1
      ) {
        const selection = window.getSelection()
        if (!selection) return
        const range = document.createRange()
        range.selectNodeContents(quill.root)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    })
  }, [])

  useEffect(() => {
    const currentScript = document.querySelector(
      'script[plugin-key="fa46598f-aa5e-46fc-be63-2d3e339383c5"]'
    )
    if (currentScript) {
      currentScript.remove()
      document.querySelector('.fb-plugin')?.remove()
    }
    let script = document.createElement('script')
    script.src = 'https://cdn.feedbank.app/plugin.js'
    script.defer = true
    script.setAttribute('plugin-key', 'fa46598f-aa5e-46fc-be63-2d3e339383c5')
    script.setAttribute(
      'data-fb-button-color',
      theme === 'light' ? '#d4d4d4' : '#262626'
    )
    document.head.insertAdjacentElement('beforeend', script)
  }, [theme])
  return (
    <>
      <div className="container mx-auto max-w-screen-md">
        <nav role="toolbar" id="toolbar">
          <ul className="ql-formats">
            <li>
              <Tooltip content={`제목 1 (${shortKey} + 1)`}>
                <button className="ql-header" value="1" />
              </Tooltip>
            </li>
            <li>
              <Tooltip content={`제목 2 (${shortKey} + 2)`}>
                <button className="ql-header" value="2" />
              </Tooltip>
            </li>
            <li>
              <Tooltip content={`제목 3 (${shortKey} + 3)`}>
                <button className="ql-header" value="3" />
              </Tooltip>
            </li>
            <li>
              <Tooltip content={`제목 4 (${shortKey} + 4)`}>
                <button className="ql-header" value="4" />
              </Tooltip>
            </li>
          </ul>
          <ul className="ql-formats">
            <li>
              <Tooltip content={`굵게 (${shortKey} + B)`}>
                <button className="ql-bold" />
              </Tooltip>
            </li>
            <li>
              <Tooltip content={`기울임꼴 (${shortKey} + I)`}>
                <button className="ql-italic" />
              </Tooltip>
            </li>
            <li>
              <Tooltip content={`밑줄 (${shortKey} + U)`}>
                <button className="ql-underline" />
              </Tooltip>
            </li>
            <li>
              <Tooltip content={`취소선 (${shortKey} + S)`}>
                <button className="ql-strike" />
              </Tooltip>
            </li>
            <li>
              <Tooltip content={`서식 지우기 (${shortKey} + E)`}>
                <button className="ql-clean" />
              </Tooltip>
            </li>
          </ul>
          <ul className="ql-formats">
            <li>
              <Tooltip content={`글머리 기호 (${shortKey} + 5)`}>
                <button className="ql-list" value="bullet" />
              </Tooltip>
            </li>
            <li>
              <Tooltip content={`할 일 목록 (${shortKey} + 6)`}>
                <button className="ql-list" value="check" />
              </Tooltip>
            </li>
            <li>
              <Tooltip content={`번호 매기기 (${shortKey} + 7)`}>
                <button className="ql-list" value="ordered" />
              </Tooltip>
            </li>
          </ul>
          <ul className="ql-formats">
            <li>
              <Tooltip content={`인용문 (${shortKey} + Y)`}>
                <button className="ql-blockquote" />
              </Tooltip>
            </li>
            <li>
              <Tooltip content={`링크 (${shortKey} + K)`}>
                <button
                  className="ql-link"
                  onClick={() => {
                    const selection = window.getSelection()
                    if (selection?.type !== 'Range')
                      toast.info('텍스트를 드래그하세요.')
                  }}
                />
              </Tooltip>
            </li>
            <li>
              <Tooltip content="이미지">
                <button className="ql-image" />
              </Tooltip>
            </li>
            <li>
              <Tooltip content="동영상">
                <button className="ql-video" />
              </Tooltip>
            </li>
            <li>
              <Tooltip content={`코드 (${shortKey} + D)`}>
                <button className="ql-code-block" />
              </Tooltip>
            </li>
          </ul>
        </nav>

        <div ref={ref} spellCheck={false} />
      </div>

      <button
        onClick={() => setState({ isHelpOpen: true })}
        className="fixed top-2 left-2"
      >
        <Icon.Help />
      </button>

      <a
        href="https://github.com/kidow/memo"
        rel="noreferrer noopener"
        className="fixed top-2 right-2 hidden sm:inline-block"
        target="_blank"
      >
        <Icon.Github />
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
      <Toast />
    </>
  )
}

export default App
