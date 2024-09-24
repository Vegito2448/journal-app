import { FormEvent } from "react";
import GoogleButton from 'react-google-button';
import { Form, Link } from "react-router-dom";
import { useForm } from "../hooks";
import { mainPath } from "../router";
import { useAppDispatch, useAppSelector, userLogin } from "../store";
import { Provider } from "../types";

export const LoginScreen = () => {

  const { loading } = useAppSelector(({ auth }) => auth);

  const dispatch = useAppDispatch();

  const { email, password, handleChange } = useForm({
    initialState: {
      email: '',
      password: ''
    }
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    dispatch(userLogin({
      email, password,
      provider: Provider.EMAIL
    }));

  }

  return (
    <>
      <h3
        className="auth__title"
      >Login</h3>
      <Form
        onSubmit={handleSubmit}
        className="animate__animated animate__fadeIn animate__faster"
      >

        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            className="auth__input"
            value={email}
            required
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            id="password"
            name="password"
            className="auth__input"
            value={password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >Sign In</button>
        <hr />
        <div
          className="auth__social-networks"
        >
          <p>Sign in with social networks</p>
          <div>
            <GoogleButton
              disabled={loading}
              onClick={() => {
                dispatch(userLogin({ email, password, provider: Provider.GOOGLE }));
              }}
            />
          </div>
        </div>
        <Link
          to={`${mainPath}auth/register`}
          title="Create new account"
          className="link"
        >
          Create new account
        </Link>
      </Form>
    </>
  );
};
