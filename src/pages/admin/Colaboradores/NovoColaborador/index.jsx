import axios from "axios";
import { useState } from "react";
import Title from "../../../../components/admin/Title";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { url_base } from "../../../../services/apis";
import ReactInputMask from "react-input-mask";
import { FiUserPlus } from "react-icons/fi";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "./colaborador.css";
import { useEffect } from "react";

export default function NovoColaborador() {
  const [cpf, setCpf] = useState(null);
  const [nome, setNome] = useState(null);
  const [email, setEmail] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [celular, setCelular] = useState(null);
  const [instituicoes, setInstituicoes] = useState([]);
  const [idInstituicao, setIdInstituicao] = useState(null);
  const [senha, setSenha] = useState(null);
  const [validSenha, setValidSenha] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const animatedComponents = makeAnimated();

  useEffect(() => {
    async function getInstituicoes() {
      await axios
        .get(url_base + "instituicoes")
        .then((response) => {
          const data = response.data.content;

          const objetoInst = data
            .filter((inst) => inst.ativo === "S")
            .map((inst) => ({
              value: inst.idInstituicao,
              label: inst.nomeFantasia,
            }));

          setInstituicoes(objetoInst);
        })
        .catch((erro) => {
          console.log(erro);
          toast.error("Erro ao buscar instituições.");
        });
    }
    getInstituicoes();
  }, []);

  const objeto = {
    nome,
    cpf: limparMascara(cpf),
    email,
    celular: Number(limparMascara(celular)),
    usuario,
    senha,
    idInstituicao: instituicoes[0]?.value,
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
        .post(url_base + "colaboradores", objeto)
        .then(() => {
          toast.success("Cadastrado com sucesso!");
          setLoading(false);
          navigate("/admin/colaboradores");
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          toast.error("Erro ao Cadastrar.");
        });
    }
  }

  function limparMascara(valor) {
    return valor?.replace(/[^\d]+/g, "");
  }

  return (
    <>
      <Title name="Novo colaborador">
        <FiUserPlus size={28} />
      </Title>
      <form
        id="form-colaborador"
        className="card mt-4 p-4 col-9 mx-auto"
        onSubmit={submit}
      >
        <h1 className="text-center mb-5">Novo colaborador</h1>

        <div className="row mb-2">
          <div className="col-md-6">
            <label htmlFor="diaSemana" className="form-label">
              Instituição
            </label>
            <Select
              required
              isClearable={true}
              components={animatedComponents}
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  borderColor: "#0086C4",
                  "&:hover": {
                    borderColor: "#0086C4",
                  },
                }),
              }}
              name="diaSemana"
              isDisabled
              value={instituicoes[0]}
              options={instituicoes}
              className="basic-singl mt-1 mb-4"
              classNamePrefix="select"
              onChange={(valor) => setIdInstituicao(valor ? valor.value : null)}
              placeholder="Selecione..."
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="nome" className="form-label">
              Nome:
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
        </div>
        <div className="row mb-2">
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
          <div className="col-md-6">
            <label htmlFor="cpf" className="form-label">
              CPF:
            </label>
            <ReactInputMask
              mask="999.999.999-99"
              type="tel"
              autoComplete="off"
              id="cpf"
              required
              name="cpf"
              className="form-control inputForm"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
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
