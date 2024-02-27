import axios from "axios";
import { useState } from "react";
import Title from "../../../../components/admin/Title";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { url_base } from "../../../../services/apis";
import ReactInputMask from "react-input-mask";
import "./instituicao.css";
import { RiSchoolLine } from "react-icons/ri";

export default function NovaInstituicao() {
  const [cnpj, setCnpj] = useState(null);
  const [nome, setNome] = useState(null);
  const [nomeFantasia, setNomeFantasia] = useState(null);
  const [email, setEmail] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [celular, setCelular] = useState(null);
  const [senha, setSenha] = useState(null);
  const [validSenha, setValidSenha] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const objeto = {
    nomeResponsavel: nome,
    nomeFantasia,
    cnpj: limparMascara(cnpj),
    email,
    celular: Number(limparMascara(celular)),
    usuario,
    senha,
  };

  async function submit(e) {
    e.preventDefault();
    if (senha !== validSenha) {
      toast.error("Senhas não conferem!", {
        position: "top-center",
      });
    } else {
      setLoading(true);
      await axios
        .post(url_base + "instituicoes", objeto)
        .then(() => {
          toast.success("Cadastrado com sucesso!");
          setLoading(false);
          navigate("/admin/dados-instituicao");
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          toast.error("Erro ao cadastrar.");
        });
    }
  }

  function limparMascara(valor) {
    return valor?.replace(/[^\d]+/g, "");
  }

  return (
    <>
      <Title name="Nova instituição">
        <RiSchoolLine size={28} />
      </Title>
      <form
        id="form-instituicao"
        className="card mt-4 p-4 col-7 mx-auto"
        onSubmit={submit}
      >
        <h1 className="text-center mb-5">Nova instituição</h1>

        <div className="row mb-2">
          <div className="col-md-6">
            <label htmlFor="nome" className="form-label">
              Nome do Responsável:
            </label>
            <input
              required
              autoComplete="off"
              type="text"
              id="nome"
              name="nome"
              className="form-control inputForm"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="celular" className="form-label">
              Celular:
            </label>
            <ReactInputMask
              type="tel"
              mask="(99) 99999-9999"
              autoComplete="off"
              id="celular"
              name="celular"
              required
              className="form-control inputForm"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-6">
            <label htmlFor="cnpj" className="form-label">
              CNPJ:
            </label>
            <ReactInputMask
              mask="99.999.999/9999-99"
              type="tel"
              autoComplete="off"
              id="cnpj"
              required
              name="cnpj"
              className="form-control inputForm"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="nomeFantasia" className="form-label">
              Nome fantasia:
            </label>
            <input
              type="text"
              autoComplete="off"
              id="nomeFantasia"
              required
              name="nomeFantasia"
              className="form-control inputForm"
              value={nomeFantasia}
              onChange={(e) => setNomeFantasia(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              required
              autoComplete="off"
              name="email"
              className="form-control inputForm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="usuario" className="form-label">
              Usuário:
            </label>
            <input
              type="text"
              id="usuario"
              required
              autoComplete="off"
              name="usuario"
              className="form-control inputForm"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-6">
            <label htmlFor="senha" className="form-label">
              Senha:
            </label>
            <input
              type="password"
              id="senha"
              required
              autoComplete="off"
              name="senha"
              className="form-control inputForm"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="validSenha" className="form-label">
              Confirme a senha:
            </label>
            <input
              required
              autoComplete="off"
              type="password"
              id="validSenha"
              name="validSenha"
              className="form-control inputForm"
              value={validSenha}
              onChange={(e) => setValidSenha(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-12 mt-2 mb-3">
          <span className="form-text fs-5 text">Financeiro</span>
          <hr className="mt-2" />
        </div>
        <div className="row mb-2 habilitar-pagamento">
          <label htmlFor="senha" className="form-label mb-3">
            Habilitar formas de pagamento
          </label>
          <div className="col-md-4">
            <div className="form-check form-switch form-check-reverse form-control shadow-sm">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="cartao"
              />
              <label className="form-check-label fw-semibold" htmlFor="cartao">
                Cartão de crédito
              </label>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-check form-switch form-check-reverse form-control shadow-sm">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="boleto"
              />
              <label className="form-check-label fw-semibold" htmlFor="boleto">
                Boleto bancário
              </label>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-check form-switch form-control form-check-reverse shadow-sm">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="pix"
              />
              <div>
                <label className="form-check-label fw-semibold" htmlFor="pix">
                  Pix
                </label>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <button
            className="btn btn-primary btn-register"
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
          <button type="submit" className="btn btn-primary btn-register">
            Cadastrar
          </button>
        )}
      </form>
    </>
  );
}
