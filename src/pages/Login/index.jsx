import { Link, useNavigate } from "react-router-dom";
import useContexts from "../../hooks/useContexts";

import "./login.css";
import { url_base } from "../../services/apis";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [senha, setSenha] = useState(null);

  const navigate = useNavigate();
  const { storageClient, setClient } = useContexts();

  const dadosLogin = {
    email,
    senha,
  };

  async function logar(e) {
    e.preventDefault();

    setLoading(true);

    await axios
      .post(url_base + "clientes/login", dadosLogin)
      .then((response) => {
        const user = response.data;
        async function getDados() {
          await axios
            .get(url_base + `clientes/${user.id}`)
            .then((response) => {
              const dados = response.data;
              localStorage.setItem("@csh-login-user", JSON.stringify(dados));
              storageClient(dados);
              setClient(dados);
            })
            .catch(() => {
              toast.error("Erro ao buscar dados.");
            });
        }
        getDados();
        setLoading(false);
        toast.success(`Bem-vindo(a) de volta!`);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Erro ao realizar login.");
        console.log(error);
      });
  }

  return (
    <div className="container-cli container-login">
      <section className="section-login">
        <h1 className="text-center">Entrar</h1>
        <div className="card-login text-secondary">
          <div className="card-body">
            <form onSubmit={logar}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  required={true}
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="floatingInput">Email</label>
              </div>
              <div className="form-floating mb-4">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Senha"
                  autoComplete="off"
                  required={true}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <label htmlFor="floatingPassword">Senha</label>
              </div>

              {loading ? (
                <button
                  className="btn btn-primary mb-4 col-12"
                  type="button"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden" role="status">
                    Loading...
                  </span>
                </button>
              ) : (
                <button type="submit" className="btn btn-primary mb-4 col-12">
                  Entrar
                </button>
              )}
              <div className="text-center">
                <Link
                  to="/minha-conta/cadastro"
                  className="link-secondary link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                >
                  Não possui uma conta? Cadastre-se aqui.
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
