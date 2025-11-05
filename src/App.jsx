import React from "react";
import Routes from "./Routes";
import CookieConsent from "./components/ui/CookieConsent";
import CookieSettingsButton from "./components/ui/CookieSettingsButton";
import { AuthProvider } from "./hooks/useAuth";

function App() {
  return (
    <AuthProvider>
      <Routes />
      <CookieConsent />
      <CookieSettingsButton />
    </AuthProvider>
  );
}

export default App;
