import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, UserCredential } from 'firebase/auth';
import { auth, googleProvider } from "../../../../src/firebase";
import { authService } from "../../../../src/store/slices/authSlice/authService";
import { Provider } from "../../../../src/types";

vi.mock(import('../../../../src/firebase/config'), async (actualImports) => {
  const { auth } = await actualImports();

  Object.assign(auth, {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('mockToken'),
    },
  });

  return ({
    auth,
  });
});

vi.mock(import('firebase/auth'), async (importOriginal) => {
  const actual = await importOriginal();

  return ({
    ...actual,
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    updateProfile: vi.fn(),
  });
});

describe('authService', () => {
  const mockUser = {
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'http://example.com/photo.jpg',
    uid: '12345',
    getIdToken: vi.fn().mockResolvedValue('mockToken'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should login with email and password', async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({ user: mockUser } as unknown as UserCredential);

    const result = await authService.login({ email: 'test@example.com', password: 'password' });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password');
    expect(result).toEqual({
      user: {
        email: 'test@example.com',
        name: 'Test User',
        photoURL: 'http://example.com/photo.jpg',
        uid: '12345',
      },
      token: 'mockToken',
    });
  });

  it('should handle login error with email and password', async () => {
    const errorMessage = 'Login failed';
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(new Error(errorMessage));

    await expect(authService.login({ email: 'test@example.com', password: 'password' })).rejects.toThrow(errorMessage);
  });

  it('should login with Google provider', async () => {
    vi.mocked(signInWithPopup).mockResolvedValue({ user: mockUser } as unknown as UserCredential);

    const result = await authService.login({ email: 'test@example.com', provider: Provider.GOOGLE });

    expect(signInWithPopup).toHaveBeenCalledWith(auth, googleProvider);
    expect(result).toEqual({
      user: {
        email: 'test@example.com',
        name: 'Test User',
        photoURL: 'http://example.com/photo.jpg',
        uid: '12345',
      },
      token: 'mockToken',
    });
  });

  it('should handle login error with Google provider', async () => {
    const errorMessage = 'Google login failed';
    vi.mocked(signInWithPopup).mockRejectedValue(new Error(errorMessage));

    await expect(authService.login({ email: 'test@example.com', provider: Provider.GOOGLE })).rejects.toThrow(errorMessage);
  });

  it('should register a new user', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({ user: mockUser } as unknown as UserCredential);

    const result = await authService.register({ email: 'test@example.com', password: 'password', name: 'Test User' });

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password');
    expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: 'Test User' });
    expect(result).toEqual({
      user: {
        email: 'test@example.com',
        name: 'Test User',
        photoURL: 'http://example.com/photo.jpg',
        uid: '12345',
      },
      token: 'mockToken',
    });
  });

  it('should handle registration error', async () => {
    const errorMessage = 'Registration failed';
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(new Error(errorMessage));

    await expect(authService.register({ email: 'test@example.com', password: 'password', name: 'Test User' })).rejects.toThrow(errorMessage);
  });

  it('should logout the user', async () => {
    await authService.logout();

    expect(signOut).toHaveBeenCalledWith(auth);
  });

  it('should handle logout error', async () => {
    const errorMessage = 'Logout failed';
    vi.mocked(signOut).mockRejectedValue(new Error(errorMessage));

    await expect(authService.logout()).rejects.toThrow(errorMessage);
  });
});