import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { auth } from "../firebase";
import { login, useAppDispatch } from "../store";
import { router } from "./mainRouter";

export const AppRouter = () => {

  // const { token, user } = useAppSelector(({ auth }) => auth);

  const dispatch = useAppDispatch();

  useEffect(() => {

    onAuthStateChanged(auth, async (user) => {
      try {

        if (!user?.uid) return new Error('No user found');

        const token = await user.getIdToken();

        dispatch(login({
          user: {
            email: user.email || '',
            name: user.displayName || '',
            photoURL: user.photoURL || '',
            uid: user.uid
          },
          loading: false,
          error: null,
          token
        }));

      } catch (error) {
        const err = error as Error;
        dispatch(login({
          user: null,
          loading: false,
          error: err?.message || err || null,
          token: null
        }));
      }
    });

  }, [dispatch]);

  // if (!token || !user) return <h1>Wait Please...</h1>;


  return <RouterProvider
    router={router}
  />;
};