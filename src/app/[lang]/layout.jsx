import PageTransition from "../../components/PageTransition";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { NavbarProvider } from "../../lib/navbarContext";

export default function LangLayout({ children }) {
  return (
    <NavbarProvider>
      <Navbar />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
    </NavbarProvider>
  );
}
