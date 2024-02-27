import useContexts from "../../../hooks/useContexts";
import { useState } from "react";
import { url_base } from "../../../services/apis";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LoginAdmin() {
  const [usuario, setUsuario] = useState(null);
  const [senha, setSenha] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loadingAut, setLoadingAut] = useState(false);

  const { storageUser, setColaborador, setFornecedor, setInstituicao } = useContexts();
  const navigate = useNavigate();

  async function logar(e) {
    e.preventDefault();
    setLoadingAut(true);

    let data = {
      usuario,
      senha,
      perfil,
    };
    let admin = {
      usuario,
      perfil
    }
    await axios
      .post(url_base + "login", data)
      .then((response) => {
        const id = response.data.id
        admin.id = id
        storageUser(admin);
        setLoadingAut(false);
        if (perfil === "COLABORADOR") {
          setColaborador(data);
          navigate('/admin/dashboard')
        } else if (perfil === "FORNECEDOR") {
          setFornecedor(data);
          navigate('/admin/atividades')
        } else {
          setInstituicao(data);
          navigate('/admin/dados-instituicao')
        }
        toast.success("Bem-vindo(a) de volta!");
      })
      .catch(() => {
        toast.error("Ops, algo deu errado!");
        setLoadingAut(false);
      });
  }

  return (
    <div style={{ backgroundColor: "#052C65" }}>
      <div className="container">
        <div
          className="d-flex align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <form
            className="card border-0 p-5 col-6 mx-auto shadow"
            onSubmit={logar}
          >
            <h1 className="text-center mb-5">Faça o login</h1>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="usuario"
                value={usuario}
                required
                autoComplete="off"
                placeholder="Usuário"
                onChange={(e) => setUsuario(e.target.value)}
              />
              <label htmlFor="usuario">Usuário</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                required
                autoComplete="off"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Password"
              />
              <label htmlFor="senha">Senha</label>
            </div>
            <select
              className="form-select"
              onChange={(e) => setPerfil(e.target.value)}
              required
              aria-label="Default select example"
              style={{ height: "58px" }}
            >
              <option selected disabled>
                Perfil de acesso
              </option>
              <option value="COLABORADOR">Colaborador</option>
              <option value="FORNECEDOR">Parceiro</option>
              <option value="INSTITUICAO">Instituição</option>
            </select>
            {loadingAut ? (
              <button className="btn btn-primary mt-4" type="button" disabled>
                <span
                  className="spinner-border spinner-border-sm"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden" role="status">
                  Loading...
                </span>
              </button>
            ) : (
              <button type="submit" className="btn btn-primary mt-4">
                ENTRAR
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
