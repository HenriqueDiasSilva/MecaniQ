'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase";

import { Button, FloatingLabel, Form } from "react-bootstrap";
import ToastComponent from "@/app/components/toast";

export default function Profile() {
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [show, setShow] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("usuario");
            if (userData) {
                try {
                    const parsedData = JSON.parse(userData);
                    fetchUserPerson(parsedData.id);
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

    async function fetchUserPerson(id: number): Promise<void> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                email,
                password,
                people (name, phone)
            `)
                .eq('id', id)
                .single();

            if (error) {
                console.error("Erro ao buscar dados do usuário e da pessoa:", error);
                return;
            }

            if (data) {
                setEmail(data.email || '');
                setPassword(data.password || '');

                if (data.people) {
                    setName(data.people[0].name || '');
                    setPhone(data.people[0].phone || '');
                }
            }
        } catch (error) {
            console.error("Erro inesperado ao buscar dados do usuário e da pessoa:", error);
        }
    }

    async function handleEdit(event?: React.FormEvent) {
        if (event) event.preventDefault();

        if (!name || !email || !phone || !password) {
            setShow(true);
            setTitle('Erro');
            setMessage('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const { error: userError } = await supabase
                .from('users')
                .update([{ email: email.trim(), password: password.trim() }])
                .eq('id', id);

            if (userError) {
                setShow(true);
                setTitle('Erro');
                setMessage('Erro ao criar usuário. Tente novamente.');
                return;
            }

            const { error: personError } = await supabase
                .from('people')
                .update([{
                    name: name.trim(),
                    phone: phone.trim(),
                }])
                .eq('user_id', id);

            if (personError) {
                setShow(true);
                setTitle('Erro');
                setMessage('Erro ao salvar dados pessoais. Tente novamente.');
                return;
            }
        } catch (error) {
            console.error("Erro inesperado ao salvar dados do usuário e da pessoa:", error);
        } finally {
            setShow(true);
            setTitle('Sucesso');
            setMessage('Dados atualizados com sucesso.');
            router.refresh();
        }
    }

    return (
        <div className="page-intern row bg-gray">
            <div className="d-flex justify-content-center align-items-center">
                {loading ?
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    :
                    <Form
                        className="col-10 col-md-8 col-lg-6 col-xl-4 bg-white d-flex flex-column align-items-center ms-auto me-auto mb-auto p-4 rounded-3 mt-5"
                        onSubmit={handleEdit}>
                        <h3 className="fw-bold">Perfil do Usuário</h3>
                        <p>Dados Cadastrados</p>
                        <div className="col-9">
                            <FloatingLabel controlId="floatingInputNome" label="Nome" className="text-secondary">
                                <Form.Control
                                    autoComplete="off"
                                    type="text"
                                    placeholder="Nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </FloatingLabel>
                        </div>
                        <div className="col-9 mt-3">
                            <FloatingLabel controlId="floatingInputEmail" label="Email" className="text-secondary">
                                <Form.Control
                                    autoComplete="off"
                                    type="text"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FloatingLabel>
                        </div>

                        <div className="col-9 mt-3">
                            <FloatingLabel controlId="floatingInputWhats" label="Telefone" className="text-secondary">
                                <Form.Control
                                    autoComplete="off"
                                    type="text"
                                    placeholder="Telefone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </FloatingLabel>
                        </div>

                        <div className="col-9 mt-3">
                            <FloatingLabel controlId="floatingInputPassword" label="Senha" className="text-secondary">
                                <Form.Control
                                    autoComplete="off"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </FloatingLabel>
                        </div>

                        <div className="col-9 mt-2">
                            <Form.Check label="Exibir Senha" type={'checkbox'} onChange={() => setShowPassword(!showPassword)} />
                        </div>

                        <div className="d-flex ms-sm-auto mt-4">
                            <Button className="button" variant="success" onClick={handleEdit}>Salvar</Button>
                        </div>
                    </Form>
                }
            </div>
            <ToastComponent title={title} message={message} show={show} onClose={() => setShow(false)} />
        </div>
    );
}