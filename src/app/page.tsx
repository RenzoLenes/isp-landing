import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Pillars } from "@/components/sections/Pillars";
import { UseCases } from "@/components/sections/UseCases";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Problem />
        <Pillars />
        <UseCases />
        {/* Las secciones se agregan aquí en las tasks siguientes, en este orden:
            HowItWorks, Integrations, Pilot */}
      </main>
    </>
  );
}
