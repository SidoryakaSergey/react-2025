import { z } from 'zod';

export const passwordStrengthChecks = {
  number: /\d/,
  upper: /[A-Z]/,
  lower: /[a-z]/,
  special: /[^A-Za-z0-9]/,
};

export function getPasswordStrength(value: string): 0 | 1 | 2 | 3 | 4 {
  let score: 0 | 1 | 2 | 3 | 4 = 0;
  if (!value) return 0;
  if (passwordStrengthChecks.number.test(value)) score++;
  if (passwordStrengthChecks.upper.test(value)) score++;
  if (passwordStrengthChecks.lower.test(value)) score++;
  if (passwordStrengthChecks.special.test(value)) score++;
  return score as 0 | 1 | 2 | 3 | 4;
}

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .regex(/^[A-Z][\p{L}\p{M}'\-\s]*$/u, 'Should start with an uppercase letter'),
    age: z
      .string()
      .min(1, 'Age is required')
      .refine(
        (val) => {
          const num = Number(val);
          return !isNaN(num) && num >= 0;
        },
        { message: 'Age must be a positive number' },
      ),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    gender: z.enum(['male', 'female', 'other']),
    acceptTos: z.boolean().refine((val) => val === true, {
      message: 'You must accept T&C',
    }),
    imageBase64: z.string().optional(),
    country: z.string().min(1, 'Select country'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })
  .refine((data) => getPasswordStrength(data.password) >= 4, {
    message: 'Password is not strong enough',
    path: ['password'],
  });

// Используем z.input и z.output для правильной типизации
export type FormInput = z.input<typeof formSchema>;
export type FormSchema = z.output<typeof formSchema>;

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function validateImage(file: File): string | null {
  const validTypes = ['image/png', 'image/jpeg'];
  const maxSize = 2 * 1024 * 1024;
  if (!validTypes.includes(file.type)) return 'Only PNG or JPEG are allowed';
  if (file.size > maxSize) return 'File size must be <= 2MB';
  return null;
}
