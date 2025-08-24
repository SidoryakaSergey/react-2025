import { useEffect, useState } from 'react';

import { Modal } from './components/Modal';
import { RHFForm } from './forms/RHFForm';
import { UncontrolledForm } from './forms/UncontrolledForm';
import { useFormsStore } from './store';

function App() {
  const [open, setOpen] = useState<null | 'uncontrolled' | 'rhf'>(null);
  const entries = useFormsStore((s) => s.entries);
  const lastId = useFormsStore((s) => s.lastCreatedId);
  const clearHighlight = useFormsStore((s) => s.clearHighlight);

  useEffect(() => {
    if (!lastId) return;
    const t = setTimeout(() => clearHighlight(), 2500);
    return () => clearTimeout(t);
  }, [lastId, clearHighlight]);

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">React Forms</h1>
      <div className="flex items-center gap-3 mb-4">
        <button
          className="px-3 py-2 rounded border bg-white hover:border-indigo-500"
          onClick={() => setOpen('uncontrolled')}
        >
          Open Uncontrolled Form
        </button>
        <button
          className="px-3 py-2 rounded border bg-white hover:border-indigo-500"
          onClick={() => setOpen('rhf')}
        >
          Open RHF Form
        </button>
      </div>
      {entries.length > 0 && (
        <div className="mb-4">
          <button
            className="px-3 py-2 rounded border bg-white hover:border-indigo-500"
            onClick={clearHighlight}
          >
            Clear Highlight
          </button>
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`rounded-lg border p-3 ${entry.id === lastId ? 'border-indigo-500 animate-pulse' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between">
              <strong>{entry.name}</strong>
              <span className="text-sm text-gray-500">{entry.source}</span>
            </div>
            <div>Age: {entry.age}</div>
            <div>Email: {entry.email}</div>
            <div>Gender: {entry.gender}</div>
            <div>Country: {entry.country}</div>
            {entry.imageBase64 && (
              <img
                src={entry.imageBase64}
                alt="uploaded"
                className="w-full mt-2 rounded"
              />
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={open !== null}
        title={
          open === 'uncontrolled'
            ? 'Uncontrolled Form'
            : open === 'rhf'
              ? 'React Hook Form'
              : ''
        }
        onClose={() => setOpen(null)}
      >
        {open === 'uncontrolled' && (
          <UncontrolledForm onSuccess={() => setOpen(null)} />
        )}
        {open === 'rhf' && <RHFForm onSuccess={() => setOpen(null)} />}
      </Modal>
    </>
  );
}

export default App;
