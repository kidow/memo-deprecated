import type { FC } from 'react'
import { Modal, Input, Button } from 'components'
import { useObjectState } from 'services'

export interface Props extends ModalProps {}
interface State {
  url: string
}

const ImageModal: FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  const [{ url }, , onChange] = useObjectState<State>({ url: '' })
  return (
    <Modal
      title="이미지 삽입"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <Button size="sm">삽입</Button>
        </div>
      }
    >
      <div className="space-y-8">
        <input className="cursor-pointer" type="file" accept="image/*" />
        <Input
          value={url}
          name="url"
          onChange={onChange}
          placeholder="사진 URL"
          autoFocus
        />
      </div>
    </Modal>
  )
}

export default ImageModal
