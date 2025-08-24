import { create } from 'zustand';

export type Gender = 'male' | 'female' | 'other';

export interface FormData {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  gender: Gender;
  acceptTos: boolean;
  imageBase64?: string;
  country: string;
  source: 'uncontrolled' | 'rhf';
  createdAt: number;
}

export interface FormsState {
  entries: FormData[];
  countries: string[];
  lastCreatedId?: string;
}

type FormsStore = FormsState & {
  addEntry: (entry: FormData) => void;
  clearHighlight: () => void;
};

const initialCountries = [
  'United States',
  'Canada',
  'Mexico',
  'Brazil',
  'United Kingdom',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Ukraine',
  'Poland',
  'Romania',
  'Netherlands',
  'Belgium',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Estonia',
  'Latvia',
  'Lithuania',
  'Portugal',
  'Greece',
  'Turkey',
  'India',
  'China',
  'Japan',
  'South Korea',
  'Australia',
  'New Zealand',
  'South Africa',
  'Israel',
  'United Arab Emirates',
  'Saudi Arabia',
  'Egypt',
];

export const useFormsStore = create<FormsStore>((set) => ({
  entries: [],
  countries: initialCountries,
  lastCreatedId: undefined,
  addEntry: (entry) =>
    set((state) => ({
      entries: [entry, ...state.entries],
      lastCreatedId: entry.id,
    })),
  clearHighlight: () => set({ lastCreatedId: undefined }),
}));

export const selectEntries = (state: FormsStore) => state.entries;
export const selectCountries = (state: FormsStore) => state.countries;
export const selectLastCreatedId = (state: FormsStore) => state.lastCreatedId;

export function resetFormsStore() {
  useFormsStore.setState({
    entries: [],
    countries: initialCountries,
    lastCreatedId: undefined,
  });
}
