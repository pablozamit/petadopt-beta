import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import PublicPetAdoptionHomepage from "pages/public-pet-adoption-homepage";
import AuthenticationLoginRegister from "pages/authentication-login-register";
import ShelterDashboard from "pages/shelter-dashboard";
import SheltersDirectory from "pages/shelters-directory";
import AddEditPetForm from "pages/add-edit-pet-form";
import PetDetail from "pages/pet-detail";
import AdopterPanel from "pages/adopter-panel";
import AdminPanel from "pages/admin-panel";
import ProfessionalsDirectory from "pages/professionals-directory";
import ProfessionalDetail from "pages/professional-detail";
import ProfessionalRegister from "pages/professional-register";
import ProfessionalPanel from "pages/professional-panel";
import ProfessionalLogin from "pages/professional-login";
import ComparisonPage from "pages/comparison";
import PoliticaCookies from "pages/politica-cookies";
import PoliticaPrivacidad from "pages/politica-privacidad";
import TerminosCondiciones from "pages/terminos-condiciones";
import ComoFunciona from "pages/como-funciona";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<PublicPetAdoptionHomepage />} />
          <Route path="/public-pet-adoption-homepage" element={<PublicPetAdoptionHomepage />} />
          <Route path="/authentication-login-register" element={<AuthenticationLoginRegister />} />
          <Route path="/shelter-dashboard" element={<ShelterDashboard />} />
          <Route path="/shelters" element={<SheltersDirectory />} />
          <Route path="/add-edit-pet-form" element={<AddEditPetForm />} />
          <Route path="/pet/:id" element={<PetDetail />} />
          <Route path="/adopter-panel" element={<AdopterPanel />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          
          {/* Professional Routes */}
          <Route path="/professionals" element={<ProfessionalsDirectory />} />
          <Route path="/professional/:id" element={<ProfessionalDetail />} />
          <Route path="/professional-register" element={<ProfessionalRegister />} />
          <Route path="/professional-panel" element={<ProfessionalPanel />} />
          <Route path="/professional-login" element={<ProfessionalLogin />} />
          
          {/* Comparison Route */}
          <Route path="/compare" element={<ComparisonPage />} />
          
          {/* Legal Pages */}
          <Route path="/politica-cookies" element={<PoliticaCookies />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
          
          {/* Página Cómo Funciona */}
          <Route path="/como-funciona" element={<ComoFunciona />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
