import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  let pathname;
  
  try {
    const location = useLocation();
    pathname = location.pathname;
  } catch (error) {
    // Si useLocation falla (no está dentro de <BrowserRouter>), retorna null
    // Esto puede ocurrir en contextos de debugging o test
    return null;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
