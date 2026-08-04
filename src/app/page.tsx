import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        {/* Las secciones se agregan aquí en las tasks siguientes, en este orden:
            Problem, Pillars, UseCases, HowItWorks, Integrations, Pilot */}
      </main>
    </>
  );
}
