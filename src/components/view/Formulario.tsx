import {useEffect, useState} from 'react';
import type {Pessoa, PessoaFormData, PessoaRequest} from "../../types/Pessoa.ts";
import { Util } from "../utils/Util.ts";
import { List } from "./Lista.tsx";
import '../../assets/css/Formulario.css';


export function Formulario() {
    const [pessoa, setPessoa] = useState<Pessoa[] >([]);
    const [formData, setFormData] = useState<PessoaFormData>({
        nome: '',
        email: '',
        phone: '',
        num1: '',
        num2: '',
        num3: '',
        num4: '',
        num5: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const API = 'http://localhost:8080/jogador';
    const TOKEN = 'Bearer ' + localStorage.getItem('token');

    // Função para buscar jogadores
    const fetchJogadores = async () => {
        try {
            const response = await fetch(API+'/todos', {
                headers: {
                    method: 'GET',
                    'Authorization': TOKEN
                }
            });
            if (!response.ok) {
                throw new Error('Falha ao buscar jogadores');
            }
            const data: Pessoa[] = await response.json();
            setPessoa(data);
        } catch (err) {
            console.error('Erro ao buscar jogadores:', err);
        }
    };

    // Buscar jogadores ao montar o componente
    useEffect(() => {
        fetchJogadores();
    }, []);

    // Adicionar nova pessoa
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (!formData.nome ||
            !formData.email ||
            !formData.phone ||
            !formData.num1 ||
            !formData.num2 ||
            !formData.num3 ||
            !formData.num4 ||
            !formData.num5) {
            return;
        }

        const newPessoaRequest: PessoaRequest = {
            nome: formData.nome,
            email: formData.email,
            phone: formData.phone,
            aposta: [formData.num1, formData.num2, formData.num3, formData.num4, formData.num5]
        }

        fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': TOKEN
            },
            body: JSON.stringify(newPessoaRequest)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao cadastrar jogador');
                }
                return response.json();
            })
            .then(() => {
                fetchJogadores();
                resetForm();
            })
            .catch(err => {
                alert(err.message);
            });
    };

    // Editar pessoa existente
    const handleEdit = (pessoa: Pessoa) => {
        setFormData({
            nome: pessoa.nome,
            email: pessoa.email,
            phone: pessoa.phone,
            num1: pessoa.num1,
            num2: pessoa.num2,
            num3: pessoa.num3,
            num4: pessoa.num4,
            num5: pessoa.num5,
        });
        setEditingId(pessoa.id);
    };

    // Salvar edição
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nome ||
            !formData.email ||
            !formData.phone ||
            !formData.num1 ||
            !formData.num2 ||
            !formData.num3 ||
            !formData.num4 ||
            !formData.num5) {
            alert('Por favor, preencha todos os campos!');
            return;
        }
        const updatePessoaRequest: PessoaRequest = {
            nome: formData.nome,
            email: formData.email,
            phone: formData.phone,
            aposta: [formData.num1, formData.num2, formData.num3, formData.num4, formData.num5]
        }

        fetch(`${API}/alterar/${editingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': TOKEN
            },
            body: JSON.stringify(updatePessoaRequest)
        })
            .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao atualizar jogador');
            }
            return response.json();
        })
            .then(() => {
            fetchJogadores();
        })
            .catch(err => {
            alert(err.message);
        })
        resetForm();
    };

    // Excluir pessoa
    const handleDelete = (id: number) => {
        if (globalThis.confirm('Deseja realmente excluir este registro?')) {
        }
        fetch(`${API}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': TOKEN
            },
        }).then(() => {
            fetchJogadores();
        });
    };

    // Resetar formulário
    const resetForm = () => {
        setFormData({
            nome: '',
            email: '',
            phone: '',
            num1: '',
            num2: '',
            num3: '',
            num4: '',
            num5: ''
        });
        setEditingId(null);
        setIsSubmitted(false);
    };

    // Atualizar campos do formulário
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };



    return (
        <div className="main">
            <h1>Cadastro Jogadores da Quina </h1>

            {/* Formulário */}
            <form onSubmit={editingId ? handleUpdate : handleAdd}>
                <h2>{editingId ? 'Editar: Jogador' : 'Cadastro: Jogador'}</h2>
                <div className="format-flex-gap-10">
                    <div className="mb-3 witdh-50">
                        <label htmlFor="nome" className="form-label">Nome</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nome"
                            name={"nome"}
                            value={formData.nome}
                            onChange={handleChange}
                            onInput={Util.handleLetras}/>
                        {isSubmitted && !formData.nome && (
                            <div className="alert alert-danger" role="alert">Campo obrigatório </div>
                        )}
                    </div>
                    <div className="mb-3 witdh-50">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name={"email"}
                            value={formData.email}
                            onChange={handleChange}/>
                        {isSubmitted && !formData.email && (
                            <div className="alert alert-danger" role="alert">Campo obrigatório </div>
                        )}
                    </div>

                </div>
                <div className="format-flex-gap-10">
                    <div className="mb-3">
                        <label htmlFor="telefone" className="form-label">Telefone</label>
                        <input
                            type="text"
                            className="form-control"
                            id="telefone"
                            name={"phone"}
                            value={formData.phone}
                            onChange={handleChange}
                        onInput={Util.handleNumericPhone}/>
                        {isSubmitted && !formData.phone && (
                            <div className="alert alert-danger" role="alert">Campo obrigatório </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="numeros" className="form-label">números da Quina</label>
                        <div className="format-flex-gap-10">
                            <input
                                type="text"
                                className="form-control"
                                id="num1"
                                name="num1"
                                value={formData.num1}
                                onChange={handleChange}
                                onInput={Util.handleNumericInput}
                                style={{width: '45px'}}/>
                            {isSubmitted && !formData.num1 && (
                                <div className="alert alert-danger" role="alert">Obrigatório </div>
                            )}
                            <input
                                type="text"
                                className="form-control"
                                id="num2"
                                name="num2"
                                value={formData.num2}
                                onChange={handleChange}
                                onInput={Util.handleNumericInput}
                                style={{width: '45px'}}
                            />
                            {isSubmitted && !formData.num2 && (
                                <div className="alert alert-danger" role="alert">Obrigatório </div>
                            )}
                            <input
                                type="text"
                                className="form-control"
                                id="num3"
                                name="num3"
                                value={formData.num3}
                                onChange={handleChange}
                                onInput={Util.handleNumericInput}
                                style={{width: '45px'}}
                            />
                            {isSubmitted && !formData.num3 && (
                                <div className="alert alert-danger" role="alert">Obrigatório </div>
                            )}
                            <input
                                type="text"
                                className="form-control"
                                id="num4"
                                name="num4"
                                value={formData.num4}
                                onChange={handleChange}
                                onInput={Util.handleNumericInput}
                                style={{width: '45px'}}
                            />
                            {isSubmitted && !formData.num4 && (
                                <div className="alert alert-danger" role="alert">Obrigatório </div>
                            )}
                            <input
                                type="text"
                                className="form-control"
                                id="num5"
                                name="num5"
                                value={formData.num5}
                                onChange={handleChange}
                                onInput={Util.handleNumericInput}
                                style={{width: '45px'}}
                            />
                            {isSubmitted && !formData.num5 && (
                                <div className="alert alert-danger" role="alert">Obrigatório </div>
                            )}
                        </div>

                    </div>
                </div>
                <div className="format-flex-gap-10">
                    <button
                        type="submit" className="btn btn-primary" >{editingId ? 'Atualizar' : 'Adicionar'}</button>
                    {!editingId && (<button type="button" className="btn btn-secondary" onClick={resetForm}>Limpar</button>)}
                    {editingId && (
                        <button
                            type="button"
                            className="btn btn-secondary ms-2"
                            onClick={resetForm}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
            <List
                pessoa={pessoa}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </div>
    );

}