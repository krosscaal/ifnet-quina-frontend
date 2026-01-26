import '../../assets/css/Home.css';
import {ListaPaginada} from "./ListaPaginada.tsx";
export function Home() {
    return (
        <>
            <div className="inicio">
                <img src="src/assets/img/quina.png" alt="Quina" width="588" height="334"/>
            </div>
            <ListaPaginada/></>
    );
}