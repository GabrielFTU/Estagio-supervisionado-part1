import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FornecedoresList = () => {
    const [fornecedores, setFornecedores] = useState([]);
    const API_URL = 'http://localhost:5019/api/Fornecedores';

    useEffect(() => {
        const fetchFornecedores = async () => {
            try {
                const response = await axios.get(API_URL);
                setFornecedores(response.data);
            } catch (error) {
                console.error('Erro ao buscar fornecedores:', error);
            }
        };
        fetchFornecedores();
    }, []);

    return (
        <div>
            <h2>Lista de Fornecedores</h2>
            <ul>
                {fornecedores.map(fornecedor => (
                    <li key={fornecedor.id}>
                        {fornecedor.nome} - {fornecedor.documento}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FornecedoresList;