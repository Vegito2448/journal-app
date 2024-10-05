import { waitFor } from '@testing-library/react';
import { onAuthStateChanged, UserCredential } from 'firebase/auth';
import { vi } from 'vitest';
import { AppRouter } from "../../src/router";
import { renderWithProviders } from "../utils";

// Mock Firebase auth
vi.mock(import('firebase/auth'), async (originImport) => {
  const auth = await originImport();

  return ({
    ...auth,
    onAuthStateChanged: vi.fn(),
  });
});

// Mock Redux store


describe('AppRouter', () => {
  const mockUser = {
    uid: '12345',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'http://example.com/photo.jpg',
    getIdToken: vi.fn().mockResolvedValue('mock-token'),
  } as unknown as UserCredential['user'];
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });

  });


  test('dispatches login action with user data on auth state change', async () => {

    vi.mocked(onAuthStateChanged).mockImplementation((_, callback) => {
      if (typeof callback === 'function') {
        callback(mockUser);
      }
      return () => { }; // Return an unsubscribe function
    });

    const { store } = renderWithProviders({
      customComponent: <AppRouter />,
    });

    await waitFor(() => {
      expect(mockUser.getIdToken).toHaveBeenCalled();
      expect(store.getState().auth.user).toEqual({
        email: mockUser.email,
        name: mockUser.displayName,
        photoURL: mockUser.photoURL,
        uid: mockUser.uid,
      });
      expect(store.getState().auth.token).toBe('mock-token');
    });
  });

});