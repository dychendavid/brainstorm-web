import React from "react";
import BaseModal, { ModalProps } from "@/components/modals/base_modal";
import { Button } from "@/components/generals/button";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";

type AlertModalProps = ModalProps & {
  onOk?: () => void;
  btnOk?: string;
};

const AlertModal = ({
  title = "",
  desc = "",
  isOpen = false,
  onClose = null,

  btnOk = "Ok",
  onOk = null,
}: AlertModalProps) => {
  return (
    <BaseModal onClose={onClose} isOpen={isOpen} title={title} desc={desc}>
      <Button theme="default" onClick={onOk} rightIcon={faCheck}>
        {btnOk}
      </Button>
    </BaseModal>
  );
};

export default AlertModal;
