import { Navbar } from "@/components/sections/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-x-clip">
        {/* Las secciones se agregan aquí en las tasks siguientes, en este orden:
            Hero, Problem, Pillars, UseCases, HowItWorks, Integrations, Pilot */}
      </main>
    </>
  );
}
