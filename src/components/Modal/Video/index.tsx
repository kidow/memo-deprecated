import type { FC } from 'react'
import { Input, Modal, Button } from 'components'
import { useObjectState } from 'services'

export interface Props extends ModalProps {}
interface State {
  url: string
}

const VideoModal: FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  const [{ url }, , onChange] = useObjectState<State>({ url: '' })
  return (
    <Modal
      title="동영상 삽입"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <Button size="sm">삽입</Button>
        </div>
      }
    >
      <div className="mt-4">
        <Input
          value={url}
          name="url"
          onChange={onChange}
          placeholder="동영상 URL"
          type="url"
          autoFocus
        />
      </div>
    </Modal>
  )
}

export default VideoModal
