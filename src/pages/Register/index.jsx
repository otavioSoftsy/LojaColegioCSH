import "./register.css";
import WizardForm from "../../components/WizardForm";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="container-cli container-login">
      <section className="section-login">
        <h1 className="text-center">Cadastre-se</h1>
        <div className="card-login text-secondary">
          <WizardForm />
        </div>
        <div className="text-center">
          <Link
            to="/minha-conta/entrar"
            className="link-secondary link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
          >
            Já possui uma conta? Entre aqui.
          </Link>
        </div>
      </section>
    </div>
  );
}
