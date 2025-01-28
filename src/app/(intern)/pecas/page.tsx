'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase";
import { Button, Table } from "react-bootstrap";
import ToastComponent from "@/app/components/toast";

import { Trash, Pencil } from 'react-bootstrap-icons';
import ModalComponent from "@/app/components/modal";

interface Part {
    id: number;
    name: string;
    number: string;
    price: string;
}

export default function Parts() {
    const [parts, setParts] = useState<Part[]>([]);
    const [partId, setPartId] = useState(0);
    const [partName, setPartName] = useState('');

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState('');
    const [messageModal, setMessageModal] = useState('');

    const router = useRouter();

    useEffect(() => {
        fetchParts();
    }, []);

    async function fetchParts() {
        setLoading(true);
        try {
            const { data: partsData } = await supabase.from('parts').select('*');
            setParts(partsData || []);
        } catch (error) {
            setShow(true);
            setTitle('Erro');
            setMessage('Erro ao carregar pe as. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDeletePart() {
        setLoading(true);
        try {
            await supabase.from('parts').delete().eq('id', partId);
            fetchParts();
        } catch (error) {
            setShow(true);
            setTitle('Erro');
            setMessage('Erro ao deletar peça. Tente novamente.');
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    }

    function handleEditPart(id: number) {
        router.push(`/pecas/${id}`);
    }

    return (
        <div className="page-intern row">
            <div className="d-flex justify-content-center align-items-center">
                {loading ? (
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="col-12 col-md-8 ms-auto me-auto mb-auto p-4">
                            <h3 className="fw-bold text-center mb-3">Peças no Estoque</h3>
                            <div className="d-flex justify-content-end">
                                <Button className="" variant="success" type="button" href="/pecas/0">
                                    + Novo
                                </Button>
                            </div>
                            <Table striped hover responsive>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Quantidade</th>
                                        <th>Preço</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parts.map((part) => (
                                        <tr key={part.id}>
                                            <td>{part.name}</td>
                                            <td>{part.number}</td>
                                            <td>R$ {Number(part.price).toFixed(2)}</td>
                                            <td>
                                                <Pencil size={22} className="link me-3 text-primary" onClick={() => handleEditPart(part.id)} />
                                                <Trash size={22} className="link text-danger" onClick={() => { setPartId(part.id); setPartName(part.name); setShowModal(true); }} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </>
                )}
            </div>
            <ToastComponent title={title} message={message} show={show} onClose={() => setShow(false)} />
            <ModalComponent title={'Deletar Peça'} message={'Confirma a exclusão da peça ' + partName + '?'} show={showModal} onClose={() => setShowModal(false)} event={handleDeletePart} />
        </div>
    );
}