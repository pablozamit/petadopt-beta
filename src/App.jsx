import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import Footer from "./components/ui/Footer";
import CookieConsent from "./components/ui/CookieConsent";
import CookieSettingsButton from "./components/ui/CookieSettingsButton";
import { AuthProvider } from "./hooks/useAuth";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes />
        <Footer />
        <CookieConsent />
        <CookieSettingsButton />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
