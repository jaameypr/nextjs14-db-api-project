import { useState } from "react"; // Importiert den useState-Hook von React, um lokale Zustände zu verwalten

// Definition der Schnittstelle für die Konfiguration eines Modals
export interface ModalConfig {
    content: React.ReactNode; // Inhalt des Modals (kann ein React-Element oder ein Text sein)
    onContinue?: () => Promise<boolean> | boolean; // Optionale Funktion, die ausgeführt wird, wenn der Benutzer auf "Weiter" klickt
    onClose?: () => void; // Optionale Funktion, die ausgeführt wird, wenn das Modal geschlossen wird
    title?: string; // Optionaler Titel des Modals
}

// Custom-Hook zur Verwaltung von Modals
export const useModal = () => {
    // Zustand für das aktive Modal (oder null, wenn kein Modal angezeigt wird)
    const [activeModal, setActiveModal] = useState<ModalConfig | null>(null);

    // Funktion zum Öffnen eines Modals mit der angegebenen Konfiguration
    const openModal = (config: ModalConfig) => setActiveModal(config);

    // Funktion zum Schließen des Modals
    const closeModal = () => {
        activeModal?.onClose?.(); // Ruft die optionale onClose-Funktion des aktiven Modals auf, falls vorhanden
        setActiveModal(null); // Setzt das aktive Modal auf null, um es zu schließen
    };

    // Funktion zum Fortfahren im Modal (z. B. wenn ein "Weiter"-Button geklickt wird)
    const continueModal = async () => {
        if (activeModal?.onContinue) { // Überprüft, ob die onContinue-Funktion definiert ist
            const shouldClose = await activeModal.onContinue(); // Führt die onContinue-Funktion aus und wartet auf das Ergebnis
            if (shouldClose) closeModal(); // Schließt das Modal nur, wenn die Funktion dies erlaubt
        } else {
            closeModal(); // Standardverhalten, wenn keine onContinue-Funktion definiert ist
        }
    };

    // Gibt die Funktionen und den aktuellen Zustand zurück
    return {
        activeModal, // Aktuelles aktives Modal
        openModal, // Funktion zum Öffnen eines Modals
        closeModal, // Funktion zum Schließen des Modals
        continueModal, // Funktion zum Fortfahren im Modal
    };
};
