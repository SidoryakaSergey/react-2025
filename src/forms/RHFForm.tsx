import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, fileToBase64, validateImage } from '../utils/validation';
import type { FormSchema } from '../utils/validation';
import { PasswordStrength } from '../components/PasswordStrength';
import { useFormsStore } from '../store';

interface Props {
  onSuccess: () => void;
}

export function RHFForm({ onSuccess }: Props) {
  const countries = useFormsStore((s) => s.countries);
  const addEntry = useFormsStore((s) => s.addEntry);
  const [imgError, setImgError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
    watch,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const password = watch('password') || '';
  const [filter, setFilter] = useState('');
  const filtered = useMemo(
    () =>
      countries
        .filter((c) => c.toLowerCase().includes(filter.toLowerCase()))
        .slice(0, 6),
    [countries, filter]
  );

  const onSubmit = async (data: FormSchema) => {
    setImgError(null);
    const fileList = (
      document.getElementById('image-rhf') as HTMLInputElement | null
    )?.files;
    if (fileList && fileList[0]) {
      const err = validateImage(fileList[0]);
      if (err) {
        setImgError(err);
        return;
      }
      data.imageBase64 = await fileToBase64(fileList[0]);
    }
    addEntry({
      id: crypto.randomUUID(),
      name: data.name,
      age: Number(data.age), // Преобразуем строку в число
      email: data.email,
      password: data.password,
      gender: data.gender,
      acceptTos: data.acceptTos,
      imageBase64: data.imageBase64,
      country: data.country,
      source: 'rhf',
      createdAt: Date.now(),
    });
    onSuccess();
  };

  useEffect(() => {
    if (!filter) return;
  }, [filter]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="name-rhf" className="font-medium">
          Name
        </label>
        <input
          id="name-rhf"
          type="text"
          className="px-3 py-2 rounded border"
          {...register('name')}
        />
        {errors.name && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.name.message}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="age-rhf" className="font-medium">
          Age
        </label>
        <input
          id="age-rhf"
          type="number"
          min={0}
          className="px-3 py-2 rounded border"
          {...register('age')}
        />
        {errors.age && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.age.message}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email-rhf" className="font-medium">
          Email
        </label>
        <input
          id="email-rhf"
          type="email"
          className="px-3 py-2 rounded border"
          {...register('email')}
        />
        {errors.email && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.email.message}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password-rhf" className="font-medium">
          Password
        </label>
        <input
          id="password-rhf"
          type="password"
          className="px-3 py-2 rounded border"
          {...register('password')}
        />
        <PasswordStrength password={password} />
        {errors.password && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.password.message}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword-rhf" className="font-medium">
          Confirm Password
        </label>
        <input
          id="confirmPassword-rhf"
          type="password"
          className="px-3 py-2 rounded border"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.confirmPassword.message}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-medium">Gender</span>
        <div
          className="flex items-center gap-3"
          role="radiogroup"
          aria-label="gender"
        >
          <label className="flex items-center gap-2">
            <input type="radio" value="male" {...register('gender')} /> Male
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" value="female" {...register('gender')} /> Female
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" value="other" {...register('gender')} /> Other
          </label>
        </div>
        {errors.gender && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.gender.message}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2">
          <input
            id="acceptTos-rhf"
            type="checkbox"
            {...register('acceptTos')}
          />
          Accept Terms and Conditions
        </label>
        {errors.acceptTos && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.acceptTos.message}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="image-rhf" className="font-medium">
          Upload picture
        </label>
        <input id="image-rhf" type="file" accept="image/png,image/jpeg" />
        {imgError && (
          <div role="alert" className="text-red-600 text-sm">
            {imgError}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="country-rhf" className="font-medium">
          Country
        </label>
        <input
          id="country-rhf"
          type="text"
          autoComplete="off"
          className="px-3 py-2 rounded border"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setValue('country', e.target.value, { shouldValidate: true });
          }}
        />
        <div
          role="listbox"
          aria-label="countries"
          className="rounded border divide-y mt-1"
        >
          {filtered.map((c) => (
            <button
              key={c}
              role="option"
              type="button"
              onClick={() => {
                setFilter(c);
                setValue('country', c, { shouldValidate: true });
              }}
              className="px-3 py-2 text-left hover:bg-gray-50"
            >
              {c}
            </button>
          ))}
        </div>
        {errors.country && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.country.message}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="px-3 py-2 rounded border bg-white hover:border-indigo-500 disabled:opacity-60"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
