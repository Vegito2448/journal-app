import { AppRouter } from "./router";
import { ReduxProvider } from "./store";


function App() {

  return (
    <ReduxProvider>
      <AppRouter />
    </ReduxProvider>
  );
}

export default App;
