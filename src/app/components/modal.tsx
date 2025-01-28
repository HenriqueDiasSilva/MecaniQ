'use client'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface ModalComponentProps {
    title: string;
    message: string;
    show: boolean;
    onClose: () => void;
    event: () => void;
}

export default function ModalComponent({ title, message, show, onClose, event }: ModalComponentProps) {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>{message}</Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={event}>Confirmar</Button>
            </Modal.Footer>
        </Modal>
    );
}