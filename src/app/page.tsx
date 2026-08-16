import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Pillars } from "@/components/sections/Pillars";
import { UseCases } from "@/components/sections/UseCases";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Integrations } from "@/components/sections/Integrations";
import { Faq } from "@/components/sections/Faq";
import { Pilot } from "@/components/sections/Pilot";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Problem />
        <Pillars />
        <UseCases />
        <HowItWorks />
        <Integrations />
        <Faq />
        <Pilot />
      </main>
      <Footer />
    </>
  );
}
