import { HeroSection } from "../components/marketing/hero-section";
import { ProblemSolution } from "../components/marketing/problem-solution";
import { FeaturesSection } from "../components/marketing/features-section";
import { AboutSection } from "../components/marketing/about-section";
import { ContactSection } from "../components/marketing/contact-section";
import { FAQSection } from "../components/marketing/faq-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProblemSolution />
      <FeaturesSection />
      <ContactSection />
      <AboutSection />
      <FAQSection />
    </main>
  );
}
