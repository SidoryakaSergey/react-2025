import { describe, it, expect } from 'vitest';
import { useFormsStore, resetFormsStore } from '../store';

describe('store', () => {
  it('adds entry and clears highlight', () => {
    resetFormsStore();
    const id = 'id1';
    useFormsStore.getState().addEntry({
      id,
      name: 'John',
      age: 20,
      email: 'j@e.com',
      password: 'Ab1!',
      gender: 'male',
      acceptTos: true,
      country: 'United States',
      source: 'uncontrolled',
      createdAt: Date.now(),
    });
    const state = useFormsStore.getState();
    expect(state.entries[0].id).toBe(id);
    expect(state.lastCreatedId).toBe(id);
    useFormsStore.getState().clearHighlight();
    expect(useFormsStore.getState().lastCreatedId).toBeUndefined();
  });
});
