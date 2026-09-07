import Modal from './Modal'
import Button from './Button'
import Icon from './Icon'

export default function ConfirmDialog({ open = false, onClose, onConfirm, title, body, confirmLabel = 'Confirm', tone = 'primary', loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width={380}>
      <div className="flex flex-col items-center text-center gap-3">
        <span className={`w-14 h-14 rounded-full grid place-items-center ${tone === 'danger' ? 'bg-[#ffedec] text-[#ba1a1a]' : 'bg-[#d7e3ff] text-[#004ac6]'}`}>
          <Icon name={tone === 'danger' ? 'warning' : 'help'} size={26} />
        </span>
        {body ? <p className="text-body text-[#434655]">{body}</p> : null}
        <div className="w-full flex flex-col gap-2 mt-3">
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} block loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="secondary" block onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}