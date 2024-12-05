import { useState } from "react";

export interface ModalConfig {
    content: React.ReactNode;
    onContinue?: () => Promise<boolean> | boolean;
    onClose?: () => void;
    title?: string;
}

export const useModal = () => {
    const [activeModal, setActiveModal] = useState<ModalConfig | null>(null);

    const openModal = (config: ModalConfig) => setActiveModal(config);
    const closeModal = () => {
        activeModal?.onClose?.();
        setActiveModal(null);
    };

    const continueModal = async () => {
        if (activeModal?.onContinue) {
            const shouldClose = await activeModal.onContinue();
            if (shouldClose) closeModal(); // Close only if allowed
        } else {
            closeModal(); // Default behavior if no onContinue is provided
        }
    };

    return {
        activeModal,
        openModal,
        closeModal,
        continueModal,
    };
};