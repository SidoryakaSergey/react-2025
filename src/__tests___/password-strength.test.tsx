import { render, screen } from '@testing-library/react';
import { PasswordStrength } from '../components/PasswordStrength';

describe('PasswordStrength', () => {
  it('shows no strength for empty password', () => {
    render(<PasswordStrength password="" />);
    const strengthBar = screen.getByLabelText('password-strength-0');
    expect(strengthBar).toBeInTheDocument();

    const innerBar = strengthBar.querySelector('div');
    expect(innerBar).toHaveClass('w-0');
  });

  it('shows weak strength for password with only lowercase', () => {
    render(<PasswordStrength password="abc" />);
    const strengthBar = screen.getByLabelText('password-strength-1');
    expect(strengthBar).toBeInTheDocument();

    const innerBar = strengthBar.querySelector('div');
    expect(innerBar).toHaveClass('w-1/4', 'bg-amber-500');
  });

  it('shows medium strength for password with multiple character types', () => {
    render(<PasswordStrength password="abcA" />);
    const strengthBar = screen.getByLabelText('password-strength-2');
    expect(strengthBar).toBeInTheDocument();

    const innerBar = strengthBar.querySelector('div');
    expect(innerBar).toHaveClass('w-1/2', 'bg-amber-500');
  });

  it('shows good strength for password with three character types', () => {
    render(<PasswordStrength password="abcA1" />);
    const strengthBar = screen.getByLabelText('password-strength-3');
    expect(strengthBar).toBeInTheDocument();

    const innerBar = strengthBar.querySelector('div');
    expect(innerBar).toHaveClass('w-3/4', 'bg-lime-500');
  });

  it('shows strong strength for password with all character types', () => {
    render(<PasswordStrength password="abcA1!" />);
    const strengthBar = screen.getByLabelText('password-strength-4');
    expect(strengthBar).toBeInTheDocument();

    const innerBar = strengthBar.querySelector('div');
    expect(innerBar).toHaveClass('w-full', 'bg-green-600');
  });

  it('updates strength dynamically', () => {
    const { rerender } = render(<PasswordStrength password="abc" />);
    expect(screen.getByLabelText('password-strength-1')).toBeInTheDocument();

    rerender(<PasswordStrength password="abcA1!" />);
    expect(screen.getByLabelText('password-strength-4')).toBeInTheDocument();
  });
});
