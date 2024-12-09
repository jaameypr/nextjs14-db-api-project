import { ReactNode } from "react"; // Importiert den Typ ReactNode, der beliebige React-Komponenten oder Text repräsentieren kann
import { Button } from "@/components/ui/button"; // Importiert die Button-Komponente

// Definiert die Eigenschaften, die der Modal-Komponente übergeben werden
interface ModalProps {
    isVisible: boolean; // Steuert, ob das Modal sichtbar ist
    title?: string; // Optionaler Titel für das Modal
    content: ReactNode; // Der Inhalt, der im Modal angezeigt werden soll
    onClose: () => void; // Funktion, die beim Schließen des Modals ausgeführt wird
    onContinue?: () => void; // Optionale Funktion, die bei einer weiteren Aktion (z. B. "Weiter") ausgeführt wird
}

// Definition der Modal-Komponente
const Modal = ({ isVisible, title, content, onClose }: ModalProps) => {
    if (!isVisible) return null; // Gibt null zurück, wenn das Modal nicht sichtbar ist

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Hintergrund (Backdrop) */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose} // Schließt das Modal, wenn der Benutzer auf den Hintergrund klickt
            ></div>

            {/* Modal-Inhalt */}
            <div className="relative bg-background rounded-lg p-6 w-[30rem] shadow-xl">
                {/* Titel des Modals (optional) */}
                {title && <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>}

                {/* Der Hauptinhalt des Modals */}
                <div className="text-white">{content}</div>

                {/* Schaltflächen am unteren Rand des Modals */}
                <div className="flex justify-start gap-4 mt-6">
                    <Button onClick={onClose}>Zurück</Button> {/* Schließt das Modal */}
                </div>
            </div>
        </div>
    );
};

export default Modal; // Exportiert die Modal-Komponente als Standard
