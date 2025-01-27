'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabase";
import { Button, FloatingLabel, Form, Table } from "react-bootstrap";
import ToastComponent from "@/app/components/toast";

interface Part {
    id: number;
    name: string;
    number: string;
    price: string;
}

export default function Parts() {
    const [parts, setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setLoading(true);
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("usuario");
            if (userData) {
                try {
                    const parsedData = JSON.parse(userData);
                    fetchParts(parsedData.id);
                } catch (error) {
                    setShow(true);
                    setTitle("Erro");
                    setMessage("Erro ao buscar usuário. Tente novamente.");
                } finally {
                    setLoading(false);
                }
            } else {
                console.log("Nenhum dado encontrado no localStorage para a chave 'usuario'");
                setShow(true);
                setTitle("Erro");
                setMessage("Nenhum usuário logado. Tente logar novamente.");
            }
        }
    }, []);

    async function fetchParts(id: number) {
        const { data, error } = await supabase.from('parts').select('*').eq('id_user', id);
        if (error) {
            setShow(true);
            setTitle("Erro");
            setMessage("Erro ao carregar peças. Tente novamente.");
        } else {
            setParts(data || []);
        }
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {parts.map((peca) => (
                                        <tr key={peca.id}>
                                            <td>{peca.name}</td>
                                            <td>{peca.number}</td>
                                            <td>R$ {Number(peca.price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </>
                )}
            </div>
            <ToastComponent title={title} message={message} show={show} onClose={() => setShow(false)} />
        </div>
    );
}