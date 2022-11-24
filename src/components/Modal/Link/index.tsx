import type { FC } from 'react'
import { Checkbox, Input, Modal, Button } from 'components'
import { useObjectState } from 'services'

export interface Props extends ModalProps {}
interface State {
  content: string
  url: string
  isNewTab: boolean
}

const LinkModal: FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  const [{ content, url, isNewTab }, setState, onChange] =
    useObjectState<State>({
      content: '',
      url: '',
      isNewTab: false
    })
  return (
    <Modal
      title="링크 삽입"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <Button size="sm">삽입</Button>
        </div>
      }
    >
      <div className="pt-4">
        <Input
          placeholder="링크에 표시할 내용"
          value={content}
          name="content"
          onChange={onChange}
          autoFocus
        />
        <div className="mt-8">
          <Input
            placeholder="이동할 URL"
            value={url}
            name="url"
            type="url"
            onChange={onChange}
          />
        </div>
        <div className="mt-2">
          <Checkbox
            label="새 창에서 열기"
            size="sm"
            checked={isNewTab}
            onChange={(isNewTab) => setState({ isNewTab })}
          />
        </div>
      </div>
    </Modal>
  )
}

export default LinkModal
