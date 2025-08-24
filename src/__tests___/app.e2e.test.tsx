import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

function mount() {
  const modal = document.createElement('div');
  modal.id = 'modal-root';
  document.body.appendChild(modal);
  return render(<App />);
}

describe('App integration', () => {
  afterEach(() => {
    cleanup();
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  });

  it('opens uncontrolled form modal', () => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: /uncontrolled/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Uncontrolled Form')).toBeInTheDocument();
  });

  it('opens react hook form modal', () => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: /open rhf form/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('React Hook Form')).toBeInTheDocument();
  });

  it('closes modal on ESC key', async () => {
    const user = userEvent.setup();
    mount();

    fireEvent.click(screen.getByRole('button', { name: /uncontrolled/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes modal on close button click', async () => {
    const user = userEvent.setup();
    mount();

    fireEvent.click(screen.getByRole('button', { name: /uncontrolled/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('displays form entries after submission', async () => {
    const user = userEvent.setup();
    mount();

    fireEvent.click(screen.getByRole('button', { name: /uncontrolled/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/age/i), '25');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'StrongPass123!');
    await user.type(
      screen.getByLabelText(/confirm password/i),
      'StrongPass123!'
    );
    const maleRadio = screen.getAllByRole('radio', { name: /male/i })[0];
    await user.click(maleRadio);
    await user.click(screen.getByLabelText(/accept terms/i));
    await user.type(screen.getByLabelText(/country/i), 'United States');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText(/john@example\.com/)).toBeInTheDocument();
      expect(screen.getByText(/25/)).toBeInTheDocument();
    });
  });

  it('highlights newly added entry', async () => {
    const user = userEvent.setup();
    mount();

    fireEvent.click(screen.getByRole('button', { name: /uncontrolled/i }));

    await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/age/i), '30');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'StrongPass123!');
    await user.type(
      screen.getByLabelText(/confirm password/i),
      'StrongPass123!'
    );
    await user.click(screen.getByRole('radio', { name: /female/i }));
    await user.click(screen.getByLabelText(/accept terms/i));
    await user.type(screen.getByLabelText(/country/i), 'Canada');

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      const entry = screen.getByText('Jane Doe').closest('div');
      expect(entry).toBeInTheDocument();
    });
  });

  it('switches between different modals', async () => {
    const user = userEvent.setup();
    mount();

    fireEvent.click(screen.getByRole('button', { name: /uncontrolled/i }));
    expect(screen.getByText('Uncontrolled Form')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /open rhf form/i }));
    expect(screen.getByText('React Hook Form')).toBeInTheDocument();
  });

  it('shows clear highlight button when entries exist', async () => {
    const user = userEvent.setup();
    mount();

    fireEvent.click(screen.getByRole('button', { name: /uncontrolled/i }));

    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/age/i), '25');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'StrongPass123!');
    await user.type(
      screen.getByLabelText(/confirm password/i),
      'StrongPass123!'
    );
    const maleRadio2 = screen.getAllByRole('radio', { name: /male/i })[0];
    await user.click(maleRadio2);
    await user.click(screen.getByLabelText(/accept terms/i));
    await user.type(screen.getByLabelText(/country/i), 'USA');

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /clear highlight/i })
      ).toBeInTheDocument();
    });
  });
});
