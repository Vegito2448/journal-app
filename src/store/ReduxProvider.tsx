import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { setupStore } from "./store";

export const ReduxProvider = ({
  children,
}: { children: ReactNode; }) => {
  return (
    <Provider
      store={setupStore()}
    >
      {children}
    </Provider>
  );
};
