import { NavBar } from "../components/marketing/nav-bar";
import { FooterSection } from "../components/marketing/footer-section";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">{children}</main>
      <FooterSection />
    </div>
  );
}
