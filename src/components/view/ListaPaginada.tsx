import {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import type {Pessoa} from '../../types/Pessoa';
import '../../assets/css/ListaPaginada.css';

export function ListaPaginada() {
    const navigate = useNavigate();
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5);
    const [totalElements, setTotalElements] = useState(0);

    const API = 'http://localhost:8080/jogador';
    const TOKEN = 'Bearer ' + localStorage.getItem('token');

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(API + '/buscar?page=' + currentPage + '&size=' + itemsPerPage, {
                headers: {
                    method: 'GET',
                    'Authorization': TOKEN
                }
            });
            const data = await response.json();
            setPessoas(data.content);
            setTotalElements(data.page.totalElements);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }, [TOKEN, currentPage, itemsPerPage]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, [fetchData]);


    const handleEdit = (id: number) => {
        const pessoaToEdit = pessoas.find(pessoa => pessoa.id === id);
        navigate('/formulario', {state: {pessoa: pessoaToEdit}});
    };

    const handleDelete = async (id: number) => {
        if (globalThis.confirm('Tem certeza que deseja excluir este jogador?')) {
            try {
                await fetch(`${API}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': TOKEN
                    }
                });
                setPessoas([]);
                setCurrentPage(0);
                await fetchData();
            } catch (error) {
                console.error('Erro ao excluir jogador:', error);
            }
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="m-0">Lista de Jogadores</h2>
                <button className="btn btn-primary" onClick={() => navigate('/formulario')}>Cadastrar</button>
            </div>
            <table className="table">
                <thead className="table-primary" style={{ backgroundColor: '#f2f2f2' }}>
                <tr>
                    <th scope="col" className={'table-th'}>Nome</th>
                    <th scope="col" className={'table-th'}>E-mail</th>
                    <th scope="col" className={'table-th'}>Telefone</th>
                    <th scope="col" className={'table-th'}>Números</th>
                    <th scope="col" className={'table-th'}>Ações</th>
                </tr>
                </thead>
                <tbody>
                {pessoas.map((pessoa) => (
                    <tr key={pessoa.id}>
                        <td className={'table-td'}>{pessoa.nome}</td>
                        <td className={'table-td-center'}>{pessoa.email}</td>
                        <td className={'table-td-center'}>{pessoa.phone}</td>
                        <td className={'table-td-center'}>
                            {pessoa.num1} -
                            {pessoa.num2} -
                            {pessoa.num3} -
                            {pessoa.num4} -
                            {pessoa.num5}
                        </td>
                        <td className={'table-td-center'}>
                            <button className="btn btn-primary me-2" onClick={() => handleEdit(pessoa.id)}>
                                Editar
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(pessoa.id)}>
                                Excluir
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-between mt-3">
                <button
                    className="btn btn-secondary"
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                >
                    Anterior
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={(currentPage + 1) * itemsPerPage >= totalElements}
                >
                    Próxima
                </button>
            </div>
        </div>
    )
}