"use client"
import RoutenPlaner from "@/components/comp/routenplaner";
import Modal from "@/components/comp/modal";
import {useModal} from "@/hooks/useModal";

// Hauptkomponente für die Home-Seite
export default function Home() {

    // Hook zur Verwaltung des Modals
    const { activeModal, openModal, closeModal, continueModal } = useModal();

    return (
        <main className="grid grid-cols-6 min-h-screen font-[family-name:var(--font-geist-sans)]">
            {/* Hauptinhalt der Seite */}
            <section className={"col-start-2 col-span-4 p-8 gap-2 flex flex-col"}>
                {/* Kopfzeile mit Titeln */}
                <div className={"flex flex-col gap-2 justify-start"}>
                    <span className={"font-bold text-2xl"}>Fahrplan</span>
                    <span className={"font-bold text-xl"}>Route auswählen</span>
                </div>

                {/* Routenplaner-Komponente */}
                <RoutenPlaner openModal={openModal} />

                {/* Modal-Komponente */}
                <Modal
                    isVisible={!!activeModal} // Sichtbarkeit des Modals basierend auf "activeModal"
                    title={activeModal?.title} // Titel des Modals
                    content={activeModal?.content} // Inhalt des Modals
                    onClose={closeModal} // Aktion zum Schließen des Modals
                    onContinue={continueModal} // Aktion zum Fortfahren im Modal
                />
            </section>
        </main>
    );
}
