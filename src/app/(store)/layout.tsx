import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </>
  );
}
