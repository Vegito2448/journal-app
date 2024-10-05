import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { PropsWithChildren, ReactNode } from "react";
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { allRoutes, mainPath } from "../../src/router";
import { setupStore, type AppStore, type RootState } from '../../src/store';
// As a basic setup, import your same slice reducers


// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  initialEntries?: string[];
  customComponent?: ReactNode;
}

export function renderWithProviders(
  extendedRenderOptions: ExtendedRenderOptions = {},
) {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    initialEntries = [mainPath],
    customComponent,
    ...renderOptions

  } = extendedRenderOptions;

  const router = createMemoryRouter(allRoutes, {
    initialEntries,
  });

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

  // Return an object with the store and all of RTL's query functions
  return {
    user: userEvent.setup(),
    history: router,
    store,
    ...render(customComponent || <RouterProvider router={router} />, { wrapper: Wrapper, ...renderOptions })
  };
}