import { Link } from "react-router-dom";
import "./pgSucesso.css";

export default function PgSucesso() {

  return (
    <div className="container-login text-center">
      <div className="area-pg-sucesso">
        <img src="https://static.wixstatic.com/media/1c92b2_352bfdb524654143b0879a274cd14463~mv2.gif" alt="pg-concluido" />
        <h1 style={{ color: "#76B540" }}>Pagamento realizado!</h1>
        <Link className="btn btn-secondary mt-5 mb-2" to='/minha-conta/historico-de-compras'>
          Acessar ultimas compras
        </Link>
      </div>
    </div>
  );
}
