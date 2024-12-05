import { ReactNode } from "react";
import {Button} from "@/components/ui/button";

interface ModalProps {
    isVisible: boolean;
    title?: string;
    content: ReactNode;
    onClose: () => void;
    onContinue?: () => void;
}

const Modal = ({ isVisible, title, content, onClose }: ModalProps) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-background rounded-lg p-6 w-[30rem] shadow-xl">
                {title && <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>}
                <div className="text-white">{content}</div>
                <div className="flex justify-start gap-4 mt-6">
                    <Button onClick={onClose}>Zurück</Button>
                </div>
            </div>
        </div>
    );
};

export default Modal;