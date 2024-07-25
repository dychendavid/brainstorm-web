import React, { ReactNode } from "react";
import ReactModal from "react-modal";
import Modal from "react-modal";

export type ModalProps = {
  title?: String;
  desc?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

type BaseModalProps = ModalProps & {
  children: ReactNode;
};

Modal.setAppElement("body");

const BaseModal = ({
  title = "",
  desc = "Are you sure you want to continue?",
  onClose = () => {},
  isOpen = false,
  children = [],
}: BaseModalProps) => {
  return (
    <ReactModal
      id="resetModal"
      isOpen={isOpen}
      contentLabel="Example Modal"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
        },
      }}
      closeTimeoutMS={400}
    >
      <div className="flex justify-between items-center pb-3">
        <p className="text-2xl font-bold">{title}</p>
        <div className="modal-close cursor-pointer z-50 ml-3">
          <svg
            className="fill-current text-black"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            onClick={onClose}
          >
            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
          </svg>
        </div>
      </div>
      <div className="my-5">
        <p>{desc}</p>
      </div>
      <div className="flex justify-end pt-2">{children}</div>
    </ReactModal>
  );
};

export default BaseModal;
