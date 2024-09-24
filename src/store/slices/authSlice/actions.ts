import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase";
import { Provider, User } from "../../../types";

interface UserLogin extends User {
  provider?: Provider;
  password?: string;
}

interface UserRegister extends User {
  password: string;
}

const signInWithProvider = ({ email, password, provider }: UserLogin) => {
  switch (provider) {
    case Provider.GOOGLE:
      return signInWithPopup(auth, googleProvider);
    // case Provider.FACEBOOK:
    //   return signInWithFacebook();
    // case Provider.GITHUB:
    //   return signInWithGithub();
    // case Provider.TWITTER:
    //   return signInWithTwitter();
    default:
      return signInWithEmailAndPassword(auth, email, password || '');
  }
};

export const userLogin = createAsyncThunk(
  'auth/login',
  async (props: UserLogin, { rejectWithValue }) => {
    try {
      const signInFunction = signInWithProvider(props);

      const response = await signInFunction;

      const data = response.user;

      const token = await data.getIdToken();

      if (!data || !token) return rejectWithValue('No user data found');

      const user = {
        user: {
          email: data.email || '',
          name: data.displayName || '',
          photoURL: data.photoURL || '',
          uid: data.uid,
        },
        token,
        loading: false,
        error: null,
      };

      localStorage.setItem('userToken', token);
      return user;
    } catch (error) {
      const err = error as Error;


      // return custom error message from API if any
      return rejectWithValue(err?.message || err);
    }
  }
);

export const userRegister = createAsyncThunk(
  'auth/register',
  async ({ email, password, name }: UserRegister, { rejectWithValue }) => {
    try {
      const resp = await createUserWithEmailAndPassword(auth, email, password);

      const data = resp.user;

      const token = await data.getIdToken();

      if (!data || !token) return rejectWithValue('Cannot create user');

      await updateProfile(data, { displayName: name });

      const user = {
        user: {
          email: data.email || '',
          name: name || '',
          photoURL: data.photoURL || '',
          uid: data.uid,
        },
        token,
        loading: false,
        error: null,
      };
      localStorage.setItem('userToken', token);

      return user;
    } catch (error) {
      const err = error as Error;
      // return custom error message from API if any
      return rejectWithValue(err?.message || err);
    }
  }
);

export const userLogout = createAsyncThunk(
  'auth/logout',
  async (_, {
    rejectWithValue
  }) => {
    try {
      await signOut(auth);
      localStorage.removeItem('userToken');
      return null;
    } catch (error) {
      const err = error as Error;
      // return custom error message from API if any
      return rejectWithValue(err?.message || err);
    }
  }
);