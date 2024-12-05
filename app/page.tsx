"use client"
import RoutenPlaner from "@/components/comp/routenplaner";
import Modal from "@/components/comp/modal";
import {useModal} from "@/hooks/useModal";

export default function Home() {

  const { activeModal, openModal, closeModal, continueModal } = useModal();

  return (
      <main className="grid grid-cols-6 min-h-screen font-[family-name:var(--font-geist-sans)]">
        <section className={"col-start-2 col-span-4 p-8 gap-2 flex flex-col"}>
          <div className={"flex flex-col gap-2 justify-start"}>
            <span className={"font-bold text-2xl"}>Fahrplan</span>
            <span className={"font-bold text-xl"}>Route auswählen</span>
          </div>
          <RoutenPlaner openModal={openModal}/>

            {/* Modal Component */}
            <Modal
                isVisible={!!activeModal}
                title={activeModal?.title}
                content={activeModal?.content}
                onClose={closeModal}
                onContinue={continueModal}
            />
        </section>
      </main>
  );
}
