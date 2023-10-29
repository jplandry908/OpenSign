import React from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/esm/ModalHeader";

function ModalComponent({ isShow, type,setIsShowEmail }) {
  return (
    <Modal show={isShow}>
      <ModalHeader className="bg-danger" style={{ color: "white" }}>
        {type === "pdfFail" ? (
          <span>Failed to load pdf!</span>
        ) : type === "signersAlert" ? (
          <span>Select signers</span>
        ) : (
          <span>Document Expired!</span>
        )}
      </ModalHeader>

      <Modal.Body>
        {type === "pdfFail" ? (
          <p>Something went wrong failed to load pdf file!</p>
        ) : type === "signersAlert" ? (
          <p>Please select signer for add placeholder!</p>
        ) : (
          <p>This Document is no longer available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={() => {
            setIsShowEmail(false)
          }}
          style={{
            color: "black",
          }}
          type="button"
          className="finishBtn"
        >
         Ok
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalComponent;