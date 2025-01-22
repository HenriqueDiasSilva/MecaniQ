import { ToastContainer } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';

function ToastComponent({ title, message, show, onClose }: any) {
    return (
        <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1 }}>
            <Toast show={show} onClose={onClose}>
                <Toast.Header>
                    <strong className="me-auto">{title}</strong>
                    <small>Agora Mesmo</small>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default ToastComponent;