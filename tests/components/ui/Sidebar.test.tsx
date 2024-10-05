import { cleanup, logRoles, screen } from '@testing-library/react';
import { vi } from 'vitest';
import * as storeModule from '../../../src/store';
import { invalidateAllTags, useAddNoteMutation, useAppDispatch, userLogout } from "../../../src/store";
import { renderWithProviders } from "../../utils";

// Mock the actions

// Mock the store module
vi.spyOn(storeModule, 'useAppDispatch').mockImplementation(vi.fn().mockReturnValue(vi.fn()));
vi.spyOn(storeModule, 'userLogout').mockImplementation(vi.fn());
vi.spyOn(storeModule, 'invalidateAllTags').mockImplementation(vi.fn());
vi.spyOn(storeModule, 'useAddNoteMutation').mockImplementation(vi.fn().mockReturnValue([vi.fn()]));


describe('Sidebar', () => {
  const preloadedState = {
    auth: {
      user: {
        name: 'Test User',
        photoURL: 'http://example.com/photo.jpg',
        email: 'test@example.com',
      },
      token: 'your-token-value',
    }
  };

  test('renders user information', () => {
    const { container } = renderWithProviders({
      preloadedState
    });

    logRoles(container);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByAltText('Test User')).toBeInTheDocument();
  });

  test('calls logout actions on logout button click', async () => {
    const { user: userEvent } = renderWithProviders({
      preloadedState
    });

    await userEvent.click(screen.getByText('Logout'));


    expect(useAppDispatch).toHaveBeenCalled();
    expect(useAppDispatch()).toHaveBeenCalledWith(userLogout());
    expect(useAppDispatch()).toHaveBeenCalledWith(invalidateAllTags());
    expect(userLogout).toHaveBeenCalled();
    expect(invalidateAllTags).toHaveBeenCalled();
  });

  // Uncomment and adjust this test if needed
  test('calls addNote on new entry click', async () => {
    cleanup();

    const { user: userEvent, findByText, } = renderWithProviders({
      preloadedState
    });
    const newEntry = await findByText('New Entry');

    await userEvent.click(newEntry);

    const [addNote] = useAddNoteMutation();
    expect(useAppDispatch).toHaveBeenCalled();
    expect(useAppDispatch()).toHaveBeenCalledWith(addNote());
    expect(useAddNoteMutation).toHaveBeenCalled();

  });
});