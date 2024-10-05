import { act, screen } from '@testing-library/react';
import * as storeModule from '../../src/store';
import { useAppDispatch, userLogin } from "../../src/store";
import { Provider } from "../../src/types";
import { renderWithProviders } from "../utils";

vi.spyOn(storeModule, 'useAppDispatch').mockImplementation(vi.fn().mockReturnValue(vi.fn()));
vi.spyOn(storeModule, 'userLogin').mockImplementation(vi.fn());

describe('LoginScreen', () => {

  const user = {
    email: 'test@example.com',
    password: '12345678'
  };

  let render: ReturnType<typeof renderWithProviders>;

  beforeEach(() => {
    render = renderWithProviders();
    // logRoles(render.container);
  });

  test('renders LoginScreen component', () => {
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('renders form  elements', () => {

    const buttons = screen.getAllByRole('button');


    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(buttons).toHaveLength(2);

    expect(buttons[0]).toHaveTextContent(/sign in/i);

    expect(screen.getByText(/sign in with social networks/i)).toBeInTheDocument();
  });

  test('allows user to input email and password', async () => {
    const { user: userEvent } = render;
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(emailInput, user.email);
    await userEvent.type(passwordInput, user.password);

    expect(emailInput).toHaveValue(user.email);
    expect(passwordInput).toHaveValue(user.password);
  });

  test('submits the form', async () => {
    const { user: userEvent } = render;


    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    await userEvent.type(emailInput, user.email);
    await userEvent.type(passwordInput, user.password);
    await act(async () => submitButton.click());


    expect(useAppDispatch).toHaveBeenCalled();
    expect(userLogin).toHaveBeenCalledWith({
      ...user,
      provider: Provider.EMAIL
    });

  });

  test('signs in with Google', async () => {

    const { user: userEvent } = render;

    const googleButton = screen.getByRole('button', { name: /sign in with google/i });

    await userEvent.click(googleButton);

    expect(useAppDispatch).toHaveBeenCalled();
    expect(userLogin).toHaveBeenCalledWith({
      email: '',
      password: '',
      provider: Provider.GOOGLE
    });

  });
});