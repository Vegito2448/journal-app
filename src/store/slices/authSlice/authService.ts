import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, UserCredential } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase";
import { Provider, User } from "../../../types";

export interface UserLogin extends User {
  provider?: Provider;
  password?: string;
}

export interface UserRegister extends User {
  password: string;
}

const signInWithProvider = ({ email, password, provider }: UserLogin) => {
  switch (provider) {
    case Provider.GOOGLE:
      return signInWithPopup(auth, googleProvider);
    default:
      return signInWithEmailAndPassword(auth, email, password || '');
  }
};

const getUserData = async (user: UserCredential['user'], name?: string) => {
  const token = await user.getIdToken();
  if (!user || !token) throw new Error('No user data found');

  if (name) {
    await updateProfile(user, { displayName: name });
  }

  return {
    user: {
      email: user.email || '',
      name: user.displayName || name || '',
      photoURL: user.photoURL || '',
      uid: user.uid,
    },
    token,
  };
};

export const authService = {
  async login(props: UserLogin) {
    const response = await signInWithProvider(props);
    return getUserData(response.user);
  },

  async register({ email, password, name }: UserRegister) {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    return getUserData(response.user, name);
  },

  async logout() {
    await signOut(auth);
  }
};