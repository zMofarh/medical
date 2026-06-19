import { BrowserRouter, useLocation } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import WhatsAppButton from "@/components/feature/WhatsAppButton";
import CustomCursor from "@/components/base/CustomCursor";
import ScrollProgress from "@/components/base/ScrollProgress";
import PageTransition from "@/components/base/PageTransition";
import MouseFollower from "@/components/base/MouseFollower";
import { DataProvider } from "@/context/DataContext";

function GlobalEffects() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <>
      <ScrollProgress />
      <WhatsAppButton />
    </>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <DataProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <GlobalEffects />
          <PageTransition>
            <AppRoutes />
          </PageTransition>
        </BrowserRouter>
      </DataProvider>
    </I18nextProvider>
  );
}

export default App;

