import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Modal } from '../components/Modal';

function setupDom() {
  const modal = document.createElement('div');
  modal.id = 'modal-root';
  document.body.appendChild(modal);
}

describe('Modal', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    setupDom();
  });

  it('renders via portal when open and closes on ESC and outside click', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen title="Test" onClose={onClose}>
        content
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();

    cleanup();
    setupDom();
    render(
      <Modal isOpen title="Test" onClose={onClose}>
        content
      </Modal>
    );
    const backdrop = screen.getAllByRole('presentation')[0];
    fireEvent.mouseDown(backdrop);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
