import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RHFForm } from '../forms/RHFForm';

vi.mock('../store', () => ({
  useFormsStore: vi.fn((selector) => {
    const mockState = {
      entries: [],
      countries: ['United States', 'Canada', 'United Kingdom'],
      lastCreatedId: undefined,
      addEntry: vi.fn(),
      clearHighlight: vi.fn(),
    };
    return selector(mockState);
  }),
}));

describe('RHFForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('disables submit until valid', async () => {
    const onSuccess = vi.fn();
    render(<RHFForm onSuccess={onSuccess} />);
    const submit = screen.getByRole('button', {
      name: /submit/i,
    }) as HTMLButtonElement;
    expect(submit.disabled).toBeTruthy();
  });

  it('validates name field', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<RHFForm onSuccess={onSuccess} />);

    const nameInput = screen.getByLabelText(/name/i);

    await user.type(nameInput, 'john');
    await waitFor(() => {
      expect(
        screen.getByText(/should start with an uppercase letter/i)
      ).toBeInTheDocument();
    });

    await user.clear(nameInput);
    await user.type(nameInput, 'John');
    await waitFor(() => {
      expect(
        screen.queryByText(/should start with an uppercase letter/i)
      ).not.toBeInTheDocument();
    });
  });

  it('validates age field', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<RHFForm onSuccess={onSuccess} />);

    const ageInput = screen.getByLabelText(/age/i);

    await user.type(ageInput, '-5');
    await waitFor(() => {
      expect(
        screen.getByText(/age must be a positive number/i)
      ).toBeInTheDocument();
    });
  });

  it('validates email field', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<RHFForm onSuccess={onSuccess} />);

    const emailInput = screen.getByLabelText(/email/i);

    await user.type(emailInput, 'invalid-email');
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('renders password strength component', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<RHFForm onSuccess={onSuccess} />);

    const passwordInput = screen.getByLabelText(/^password$/i);

    await user.type(passwordInput, 'abc');
    expect(screen.getByLabelText('password-strength-1')).toBeInTheDocument();
  });

  it('filters countries', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<RHFForm onSuccess={onSuccess} />);

    const countryInput = screen.getByLabelText(/country/i);

    await user.type(countryInput, 'United');

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('United Kingdom')).toBeInTheDocument();
      expect(screen.queryByText('Canada')).not.toBeInTheDocument();
    });
  });

  it('selects country from dropdown', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<RHFForm onSuccess={onSuccess} />);

    const countryInput = screen.getByLabelText(/country/i);

    await user.type(countryInput, 'United');
    const usOption = screen.getByText('United States');
    await user.click(usOption);

    expect(countryInput).toHaveValue('United States');
  });

  it('renders terms acceptance checkbox', () => {
    const onSuccess = vi.fn();
    render(<RHFForm onSuccess={onSuccess} />);

    const checkbox = screen.getByLabelText(/accept terms/i);
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });
});
