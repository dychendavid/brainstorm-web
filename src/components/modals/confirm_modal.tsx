import React from "react";
import BaseModal, { ModalProps } from "@/components/modals/base_modal";
import { Button } from "@/components/generals/button";

type ConfirmModalProps = ModalProps & {
  onCancel?: () => void;
  btnCancel?: string;

  onConfirm?: () => void;
  btnConfirm?: string;
};

const ConfirmModal = ({
  title = "Confirming",
  desc = "Are you sure you want to continue?",
  isOpen = false,
  onClose = null,

  btnCancel = "Cancel",
  onCancel = null,
  btnConfirm = "Confirm",
  onConfirm = null,
}: ConfirmModalProps) => {
  return (
    <BaseModal onClose={onClose} isOpen={isOpen} title={title} desc={desc}>
      <Button theme="alternative" onClick={onCancel}>
        {btnCancel}
      </Button>
      <Button theme="red" onClick={onConfirm}>
        {btnConfirm}
      </Button>
    </BaseModal>
  );
};

export default ConfirmModal;
