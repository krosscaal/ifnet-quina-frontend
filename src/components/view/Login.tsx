import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import '../../assets/css/Login.css';
import type {Login} from '../../types/Login';

export function Login() {
    const API_LOGIN = 'http://localhost:8080/auth/login';
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (!email || !password) {
            return;
        }

        const loginData: Login = {
            userLogin: email,
            userSenha: password
        };

        fetch(API_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Credenciais inválidas');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('token', data.token);
                navigate('/home');
            })
            .catch(err => {
                setError(err.message);
                setIsSubmitted(false);
            });

    };

    return (
        <div className="container login-container">
            <div className="login-card border">
                <h2 className="login-title">Acesso ao Sistema</h2>
                <form onSubmit={handleLogin} noValidate>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input
                            type="email"
                            className={`form-control ${isSubmitted && !email ? 'is-invalid' : ''}`}
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                        />
                        {isSubmitted && !email && (
                            <div className="invalid-feedback">O e-mail é obrigatório.</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password [password]" className="form-label">Senha</label>
                        <input
                            type="password"
                            className={`form-control ${isSubmitted && !password ? 'is-invalid' : ''}`}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Sua senha"
                        />
                        {isSubmitted && !password && (
                            <div className="invalid-feedback">A senha é obrigatória.</div>
                        )}
                    </div>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">
                            Entrar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}