import { getPasswordStrength } from '../utils/validation';

export function PasswordStrength({ password }: { password: string }) {
  const score = getPasswordStrength(password);
  const widthClass =
    score >= 4
      ? 'w-full bg-green-600'
      : score === 3
        ? 'w-3/4 bg-lime-500'
        : score === 2
          ? 'w-1/2 bg-amber-500'
          : score === 1
            ? 'w-1/4 bg-amber-500'
            : 'w-0';
  return (
    <div
      className="h-2 bg-gray-200 rounded overflow-hidden"
      aria-label={`password-strength-${score}`}
    >
      <div className={`h-full transition-all ${widthClass}`} />
    </div>
  );
}
