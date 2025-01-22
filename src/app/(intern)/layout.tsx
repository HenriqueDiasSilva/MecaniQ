'use client'

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

import NavbarComponent from "../components/navbar";

export default function InternLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("usuario");
            if (userData) {
                try {
                    const parsedData = JSON.parse(userData);
                    fetchPerson(parsedData.id);
                } catch (error) {
                    console.error("Erro ao analisar os dados do localStorage:", error);
                }
            } else {
                console.log("Nenhum dado encontrado no localStorage para a chave 'usuario'");
            }
        }
    }, []);

    async function fetchPerson(id: number) {
        const { data } = await supabase
            .from('people')
            .select('*')
            .eq('id_user', id);

        setName(data![0]?.name);
    }

    return (
        <>
            <NavbarComponent name={name} />
            {children}
        </>
    );
}