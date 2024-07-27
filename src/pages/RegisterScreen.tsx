import { Form, Link } from "react-router-dom";

export const RegisterScreen = () => {
  return (
    <>

      <h3
        className="auth__title"
      >
        Register
      </h3>
      <Form>

        <div>
          <label htmlFor="name">Name</label>
          <br />
          <input type="name" id="name" name="name"
            className="auth__input"
          />
        </div>
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
        <div>
          <label htmlFor="repeatPassword">Repeat Password</label>
          <br />
          <input type="password" id="repeatPassword" name="repeatPassword"
            className="auth__input"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
        >Sign Up</button>
        <hr />
        <Link
          to="/auth/login"
          title="Create new account"
          className="link"
        >
          Already registered?
        </Link>
      </Form>
    </>
  );
};
