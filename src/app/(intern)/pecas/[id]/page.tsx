'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabase";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useRouter } from "next/navigation";
import ToastComponent from "@/app/components/toast";

export default function RegisterPart({ params }: { params: Promise<{ id: string }> }) {
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("usuario");
            if (userData) {
                try {
                    const parsedData = JSON.parse(userData);
                    setId(parsedData.id);
                } catch (error) {
                    console.error("Erro ao analisar os dados do localStorage:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log("Nenhum dado encontrado no localStorage para a chave 'usuario'");
            }
        }
    }, []);

    async function handleAddPeca(event: React.FormEvent) {
        setLoading(true);
        event.preventDefault();
        if (!name || !number || !price) {
            setShow(true);
            setTitle("Erro");
            setMessage("Por favor, preencha todos os campos.");
            return;
        }

        const { data, error } = await supabase.from('parts').insert([{ name, number, price, id_user: id }]);
        if (error) {
            setLoading(false);
            setShow(true);
            setTitle("Erro");
            setMessage("Erro ao adicionar peça. Tente novamente.");
        } else {
            setLoading(false);
            router.push(`/parts`);
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
                        <Form className="col-12 col-md-8 col-lg-6 col-xl-4 d-flex flex-column align-items-center ms-auto me-auto mb-auto p-4 rounded-3" onSubmit={handleAddPeca}>
                            <h3 className="fw-bold">Cadastro de Peças</h3>
                            <p>Adicione novas peças ao estoque</p>
                            <div className="col-12">
                                <FloatingLabel controlId="floatingInputName" label="Nome da Peça" className="text-secondary mb-3">
                                    <Form.Control
                                        autoComplete="off"
                                        type="text"
                                        placeholder="Nome da Peça"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel controlId="floatingInputNumber" label="Quantidade" className="text-secondary mb-3">
                                    <Form.Control
                                        autoComplete="off"
                                        type="number"
                                        placeholder="Quantidade"
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                    />
                                </FloatingLabel>
                            </div>

                            <div className="col-12">
                                <FloatingLabel controlId="floatingInputPrice" label="Preço" className="text-secondary mb-3">
                                    <Form.Control
                                        autoComplete="off"
                                        type="number"
                                        step="0.01"
                                        placeholder="Preço"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </FloatingLabel>
                            </div>

                            <div className="d-flex ms-sm-auto gap-2">
                                <Button type="button" variant="secondary" href="/pecas">Voltar</Button>
                                <Button type="button" variant="success" onClick={handleAddPeca}>Salvar</Button>
                            </div>
                        </Form>
                    </>
                )}
            </div>
            <ToastComponent title={title} message={message} show={show} onClose={() => setShow(false)} />
        </div>
    );
}