import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mainPath } from "../../src/router";
import * as storeModule from '../../src/store';
import { useAppDispatch, userRegister } from '../../src/store';

import { renderWithProviders } from "../utils";

vi.spyOn(storeModule, 'useAppDispatch').mockImplementation(vi.fn().mockReturnValue(vi.fn()));
vi.spyOn(storeModule, 'userRegister').mockImplementation(vi.fn());

describe('RegisterScreen', () => {
  const user = {
    email: 'test@mail.com',
    password: 'password123',
    name: 'John Doe',
  };

  let render: ReturnType<typeof renderWithProviders>;

  beforeEach(() => {
    render = renderWithProviders({
      initialEntries: [`${mainPath}auth/register`]
    });
  });

  test('renders RegisterScreen component', () => {
    const { history: { state: { location } } } = render;

    expect(location.pathname).toBe('/auth/register');

    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  test('renders form elements', () => {
    const [password, repeatPassword] = screen.getAllByLabelText(/password/i);


    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(repeatPassword).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('allows user to input name, email, password, and repeat password', async () => {

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const [passwordInput, repeatPasswordInput] = screen.getAllByLabelText(/password/i);

    await userEvent.type(nameInput, user.name);
    await userEvent.type(emailInput, user.email);
    await userEvent.type(passwordInput, user.password);
    await userEvent.type(repeatPasswordInput, user.password);

    expect(nameInput).toHaveValue(user.name);
    expect(emailInput).toHaveValue(user.email);
    expect(passwordInput).toHaveValue(user.password);
    expect(repeatPasswordInput).toHaveValue(user.password);
  });

  test('submits the form', async () => {

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const [passwordInput, repeatPasswordInput] = screen.getAllByLabelText(/password/i);

    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await userEvent.type(nameInput, user.name);
    await userEvent.type(emailInput, user.email);
    await userEvent.type(passwordInput, user.password);
    await userEvent.type(repeatPasswordInput, user.password);
    await userEvent.click(submitButton);
    expect(useAppDispatch).toHaveBeenCalled();
    expect(userRegister).toHaveBeenCalledWith(user);
  });

  test('check if button is disabled when password and repeat password do not match', async () => {
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const [passwordInput, repeatPasswordInput] = screen.getAllByLabelText(/password/i);

    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await userEvent.type(nameInput, user.name);
    await userEvent.type(emailInput, user.email);
    await userEvent.type(passwordInput, user.password);

    await userEvent.type(repeatPasswordInput, 'password12345');
    // Espera a que el formulario se valide
    // await new Promise((r) => setTimeout(r, 10));

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      userEvent.tab();
    });

    const errorMessage = await screen.findByText(/passwords must match/i);
    expect(errorMessage).toBeVisible();
  });

  test('check if button is disabled when state is loading', async () => {
    cleanup();
    renderWithProviders({
      initialEntries: [`${mainPath}auth/register`],
      preloadedState: {
        auth: {
          loading: true,
          user: null,
          token: null
        }
      }
    });
    await waitFor(async () => {
      const submitButton = await screen.findByRole('button', { name: /sign up/i });

      expect(submitButton).toBeDisabled();
    });


  });

});