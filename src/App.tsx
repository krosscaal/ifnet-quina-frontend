import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {Formulario} from "./components/view/Formulario.tsx";
import {Home} from "./components/view/Home.tsx";
import {ConsultaQuina} from "./components/view/ConsultaQuina.tsx";
import {Menu} from "./components/view/Menu.tsx";
import './App.css'

function App() {
    return (
        <Router>
            <div className="App">
                <Menu/>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/formulario" element={<Formulario/>}/>
                    <Route path="/consulta" element={<ConsultaQuina/>}/>
                    <Route path={"*"} element={<Navigate to="/home" replace />}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App
