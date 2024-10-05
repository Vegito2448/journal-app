import { authSlice, login, logoutUser } from "../../../../src/store";

const { reducer } = authSlice;

describe('authSlice', () => {

  const initialState = {
    loading: false,
    error: null,
    user: null,
    token: null
  };

  test('should return initial state', () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  test('should handle login', () => {
    const newState = {
      user: {
        name: 'John Doe',

        email: 'example@mail.com',

      }, token: 'token123',
      error: null,
      loading: false
    };
    expect(reducer(initialState, login(
      newState
    ))).toEqual(newState);
  });

  test('should logout user and return to initial State', () => {

    expect(reducer(undefined, logoutUser())).toEqual(initialState);

  });

});