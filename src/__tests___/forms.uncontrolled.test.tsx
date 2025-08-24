import { render, screen, fireEvent } from '@testing-library/react';
import { UncontrolledForm } from '../forms/UncontrolledForm';

describe('UncontrolledForm', () => {
  it('renders required fields and validates on submit', async () => {
    const onSuccess = vi.fn();
    render(<UncontrolledForm onSuccess={onSuccess} />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findAllByRole('alert')).toBeTruthy();
  });
});
