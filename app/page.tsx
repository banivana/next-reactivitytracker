import { AboutSection } from "./components/marketing/about-section";
import { ContactSection } from "./components/marketing/contact-section";
import { FAQSection } from "./components/marketing/faq-section";
import { FeaturesSection } from "./components/marketing/features-section";
import { FooterSection } from "./components/marketing/footer-section";
import { HeroSection } from "./components/marketing/hero-section";
import { NavBar } from "./components/marketing/nav-bar";
import { ProblemSolution } from "./components/marketing/problem-solution";

export default function Home() {
  return (
    <main>
      <NavBar />
      <HeroSection />
      <ProblemSolution />
      <FeaturesSection />
      <AboutSection />
      <FAQSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
