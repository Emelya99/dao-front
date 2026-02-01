type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="proposal-modal-overlay" onClick={onClose}>
      <div
        className="proposal-modal-window flex-column gap-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-between-center gap-8">
          {title && <h3>{title}</h3>}
          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal