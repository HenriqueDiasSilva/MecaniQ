'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { supabase } from '../../utils/supabase';
import ToastComponent from "@/app/components/toast";

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [show, setShow] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    async function handleLogin(event?: React.FormEvent) {
        if (event) event.preventDefault();
        setLoading(true);

        if (!email || !password) {
            setShow(true);
            setMessage('Por favor, preencha todos os campos.');
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.trim())
            .eq('password', password.trim());

        if (error) {
            setShow(true);
            setMessage('Erro ao buscar usuário. Tente novamente.');
            setLoading(false);
            return;
        }

        if (data.length > 0) {
            const usuario = data[0];
            localStorage.removeItem("usuario");
            localStorage.setItem('usuario', JSON.stringify({ id: usuario.id }));
            setLoading(false);
            router.push('/home');
        } else {
            alert('Usuário ou senha inválidos.');
        }
    }

    return (
        <div className="page-auth row bg-gray">
            <Form
                className="col-10 col-md-8 col-lg-6 col-xl-4 bg-white d-flex flex-column align-items-center m-auto p-4 rounded-3" onSubmit={handleLogin}>
                <h3 className="fw-bold text-center">Bem Vindo ao MecaniQ</h3>
                <p>Faça o login na sua conta</p>

                <div className='col-12 col-md-8 my-3'>
                    <FloatingLabel controlId="floatingInput" label="Usuário" className="text-secondary">
                        <Form.Control
                            autoComplete="off"
                            type="text"
                            placeholder="Usuário"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FloatingLabel>
                </div>

                <div className='col-12 col-md-8'>
                    <FloatingLabel controlId="floatingPassword" label="Senha" className="text-secondary">
                        <Form.Control
                            autoComplete="off"
                            type="password"
                            placeholder="Senha"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FloatingLabel>
                </div>

                <div className='col-12 d-flex justify-content-center mt-4'>
                    <Button className="col-12 col-md-8" variant="dark" type="submit">
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Acessar'}
                    </Button>
                </div>

                <div className="d-flex mt-4 gap-2 align-items-center flex-wrap justify-content-center">
                    <div className="text-dark">Ainda não tem conta?</div>
                    <a className="text-decoration-none link-default" href="/sign">Criar uma conta</a>
                </div>
            </Form>

            <ToastComponent title="Erro" message={message} show={show} onClose={() => setShow(false)} />
        </div>
    );
}