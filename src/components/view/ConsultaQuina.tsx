import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { Util } from "../utils/Util.ts";
import type { QuinaData } from "../../types/QuinaData.ts";
import '../../assets/css/ConsultaQuina.css';

export function ConsultaQuina() {
    const API_CAIXA = 'http://localhost:8080/api/quina';
    const navigate = useNavigate();

    const [errorApi, setErrorApi] = useState(false);
    const [quinaData, setQuinaData] = useState<QuinaData | null>(null);
    const [sorteio, setSorteio] = useState<number>(0);

    const [formData, setFormData] = useState<FormData>({
        numero: '',
    });

    const [ultimoSorteio, setUltimoSorteio] = useState<number>(0);

    interface FormData {
        numero: string;
    }

    const TOKEN = 'Bearer '+ localStorage.getItem('token');

    async function handleConsultar() {
        fetch(API_CAIXA, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(function (response) {
            if (response.ok) {
                setErrorApi(false);
                return response.json();
            } else if (response.status === 403) {
                navigate('/login');
                return;
            } else {
                setErrorApi(true);
            }
        }).then(function (data) {
            console.log(data);
            setQuinaData(data);
            setSorteio(data.numero);
            setUltimoSorteio(data.numero);

        }).catch(function (error) {
            console.error('fetch error', error);
            setErrorApi(true);
        });

    }

    async function handleConsultarNumero(num: number) {
        if (num > ultimoSorteio) {
            return;
        }

        fetch(`${API_CAIXA}/${num}`, {
            headers: {
                'Authorization': TOKEN
            }
        }).then(function (response) {
            if (response.ok) {
                setErrorApi(false);
                return response.json();
            } else if (response.status === 403) {
                navigate('/login');
                return;
            } else {
                setErrorApi(true);
            }
        }).then(function (data) {
            setQuinaData(data);
            setSorteio(data.numero);

        }).catch(function (error) {
            console.error('fetch error', error);
            setErrorApi(true);
        });
    }

    useEffect(() => {
        handleConsultar().then(() => {
        });
    }, []);


    function anterior (){
        const numero = sorteio - 1;
        setSorteio(numero);
        handleConsultarNumero(numero);
    }
    function proximo() {
        if (sorteio > ultimoSorteio) {
            return;
        }

        const numero = sorteio + 1;
        setSorteio(numero);
        handleConsultarNumero(numero);
    }


    function buscar() {
        if (formData.numero === '') {
            return;
        }
        handleConsultarNumero(Number(formData.numero));
        resetBuscar();
    }
    const resetBuscar = () => {
        setFormData({
            numero: ''
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <div className="consultaQuina">
                <h2>Consulta Jogo da Quina</h2>
                <img src="src/assets/img/quina.png" alt="Quina" width="588" height="334"/>
            </div>
            <div className="mb-3 busca">
                <input
                    className="form-control"
                    style={{width: '20%'}}
                    type="text" id="numero"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange} onInput={Util.handleNumericInputBusca}/>
                <button className="btn btn-primary" onClick={buscar} disabled={formData.numero === ''}>Buscar
                </button>
            </div>

            <div>
                {errorApi && <h2>Erro ao consultar Api....!</h2>}
                {quinaData && (
                    <div className="card meuCard">
                        <div className="card-body padding-10">
                            <div className="resultado-acoes">
                                <h3>Resultado</h3>
                                <div className="btn-group" role="group" aria-label="Basic outlined example">
                                    <button type="button" className="btn btn-outline-info" onClick={anterior}>Anterior</button>
                                    <button  type="button" className="btn btn-outline-info" onClick={proximo}>Próximo</button>
                                </div>
                            </div>
                            <div>
                                <div className="concurso-data">
                                    <h3>Concurso: {quinaData.numero}</h3>
                                    <h4>{quinaData.dataApuracao}</h4>
                                </div>
                                <div>
                                    <h5>Dezenas</h5>
                                    <ul className="dezenas">
                                        {quinaData.listaDezenas.map((dezena) => (
                                            <li key={dezena}>{dezena}</li>
                                        ))}
                                    </ul>
                                    <h5 className="padding-10">Acumulado: {quinaData.acumulado ? 'Sim' : 'Não'}</h5>
                                    <h4 className="padding-10">Valor Estimado Próximo Concurso:
                                        R$ {Util.formatCurrency(quinaData.valorEstimadoProximoConcurso)}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}