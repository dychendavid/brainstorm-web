import { useRef, useState } from "react";

export enum ModalType {
  RESET_MODAL,
  SAVE_MODAL,
  ERROR_MODAL,
}

export const useModal = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<ModalType>(null);

  const onCloseRef = useRef<() => void>(() => {
    setIsOpen(false);
  });
  const onClose = () => {
    onCloseRef.current();
  };

  return {
    title,
    setTitle,
    desc,
    setDesc,
    isOpen,
    setIsOpen,
    onClose,
    onCloseRef,
    type,
    setType,
  };
};
