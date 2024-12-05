import RoutenPlaner from "@/components/comp/routenplaner";

export default function Home() {

  return (
      <main className="grid grid-cols-6 min-h-screen font-[family-name:var(--font-geist-sans)]">
        <section className={"col-start-2 col-span-4 p-8 gap-2 flex flex-col"}>
          <div className={"flex flex-col gap-2 justify-start"}>
            <span className={"font-bold text-2xl"}>Fahrplan</span>
            <span className={"font-bold text-xl"}>Route auswählen</span>
          </div>
          <RoutenPlaner />
        </section>
      </main>
  );
}
