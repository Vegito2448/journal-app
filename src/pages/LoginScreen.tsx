import GoogleButton from 'react-google-button';
import { Form, Link } from "react-router-dom";


export const LoginScreen = () => {
  return (
    <>
      <h3
        className="auth__title"
      >Login</h3>
      <Form

      >

        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input type="email" id="email" name="email"
            className="auth__input"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <br />
          <input type="password" id="password" name="password"
            className="auth__input"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
        >Sign In</button>
        <hr />
        <div
          className="auth__social-networks"
        >
          <p>Sign in with social networks</p>
          <div>
            <GoogleButton
              onClick={() => console.log('Google button clicked')}
            />
          </div>
        </div>
        <Link
          to="/auth/register"
          title="Create new account"
          className="link"
        >
          Create new account
        </Link>
      </Form>
    </>
  );
};
