import { useRef, useState } from 'react';
import { formSchema, fileToBase64, validateImage } from '../utils/validation';
import { PasswordStrength } from '../components/PasswordStrength';
import { useFormsStore } from '../store';

interface Props {
  onSuccess: () => void;
}

export function UncontrolledForm({ onSuccess }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageError, setImageError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const countries = useFormsStore((s) => s.countries);
  const [countryFilter, setCountryFilter] = useState('');
  const addEntry = useFormsStore((s) => s.addEntry);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentForm = formRef.current;
    if (!currentForm) return;
    const formData = new FormData(currentForm);
    const values = {
      name: String(formData.get('name') || ''),
      age: String(formData.get('age') || ''),
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
      confirmPassword: String(formData.get('confirmPassword') || ''),
      gender: String(formData.get('gender') || ''),
      acceptTos: formData.get('acceptTos') === 'on',
      country: String(formData.get('country') || ''),
      imageBase64: undefined as string | undefined,
    };

    const file = (formData.get('image') as File | null) || null;
    if (file && file.size > 0) {
      const err = validateImage(file);
      if (err) {
        setImageError(err);
        return;
      }
      values.imageBase64 = await fileToBase64(file);
    }

    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      const newErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('.');
        newErrors[key] = issue.message;
      }
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setImageError(null);
    addEntry({
      id: crypto.randomUUID(),
      name: parsed.data.name,
      age: Number(parsed.data.age),
      email: parsed.data.email,
      password: parsed.data.password,
      gender: parsed.data.gender,
      acceptTos: parsed.data.acceptTos,
      imageBase64: parsed.data.imageBase64,
      country: parsed.data.country,
      source: 'uncontrolled',
      createdAt: Date.now(),
    });
    onSuccess();
    currentForm.reset();
    setPassword('');
  };

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countryFilter.toLowerCase())
  );

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-3"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="px-3 py-2 rounded border"
        />
        {errors.name && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.name}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="age" className="font-medium">
          Age
        </label>
        <input
          id="age"
          name="age"
          type="number"
          min={0}
          className="px-3 py-2 rounded border"
        />
        {errors.age && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.age}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="px-3 py-2 rounded border"
        />
        {errors.email && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.email}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="px-3 py-2 rounded border"
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordStrength password={password} />
        {errors.password && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.password}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="font-medium">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="px-3 py-2 rounded border"
        />
        {errors.confirmPassword && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.confirmPassword}
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
            <input type="radio" name="gender" value="male" /> Male
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="gender" value="female" /> Female
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="gender" value="other" /> Other
          </label>
        </div>
        {errors.gender && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.gender}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2">
          <input id="acceptTos" name="acceptTos" type="checkbox" /> Accept Terms
          and Conditions
        </label>
        {errors.acceptTos && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.acceptTos}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="image" className="font-medium">
          Upload picture
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
        />
        {imageError && (
          <div role="alert" className="text-red-600 text-sm">
            {imageError}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="country" className="font-medium">
          Country
        </label>
        <input
          id="country"
          name="country"
          type="text"
          autoComplete="off"
          value={countryFilter}
          className="px-3 py-2 rounded border"
          onChange={(e) => setCountryFilter(e.target.value)}
        />
        <div
          role="listbox"
          aria-label="countries"
          className="rounded border divide-y mt-1"
        >
          {filteredCountries.slice(0, 6).map((c) => (
            <button
              key={c}
              role="option"
              type="button"
              onClick={() => setCountryFilter(c)}
              className="px-3 py-2 text-left hover:bg-gray-50"
            >
              {c}
            </button>
          ))}
        </div>
        {errors.country && (
          <div role="alert" className="text-red-600 text-sm">
            {errors.country}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="px-3 py-2 rounded border bg-white hover:border-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
