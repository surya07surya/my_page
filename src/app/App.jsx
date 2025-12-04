import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

// ROOT THEME PROVIDER
import { MatxTheme } from "./components";

// ALL CONTEXTS
import SettingsProvider from "./contexts/SettingsContext";
import { FirebaseAuthProvider } from "app/contexts/FirebaseAuthContext";

// ROUTES
import routes from "./routes";

// FAKE SERVER
import "../__api__";

export default function App() {
  const content = useRoutes(routes);

  return (
    <SettingsProvider>
      <FirebaseAuthProvider>
        <MatxTheme>
          <CssBaseline />
          {content}
        </MatxTheme>
      </FirebaseAuthProvider>
    </SettingsProvider>
  );
}
