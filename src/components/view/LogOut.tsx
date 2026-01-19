import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export function LogOut() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
        navigate('/login');
    }, [navigate]);

    return (
        <div>
            <h2>Ate a próxima ...</h2>
        </div>
    );
}