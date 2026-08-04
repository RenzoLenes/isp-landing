import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Pillars } from "@/components/sections/Pillars";
import { UseCases } from "@/components/sections/UseCases";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Integrations } from "@/components/sections/Integrations";

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
        {/* Las secciones se agregan aquí en las tasks siguientes, en este orden:
            Pilot */}
      </main>
    </>
  );
}
