import axios from "axios";
import { useState } from "react";
import Title from "../../../../components/admin/Title";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { url_base } from "../../../../services/apis";
import ReactInputMask from "react-input-mask";
import { FiEdit } from "react-icons/fi";
import { useEffect } from "react";
import Select from "react-select";

export default function EditarColaborador() {
  const [cpf, setCpf] = useState(null);
  const [nome, setNome] = useState(null);
  const [email, setEmail] = useState(null);
  const [celular, setCelular] = useState(null);
  const [senha, setSenha] = useState(null);
  const [validSenha, setValidSenha] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alteraSenha, setAlteraSenha] = useState(null);
  const [instituicao, setInstituicao] = useState(null);
  const [usuario, setUsuario] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function getColaborador() {
      await axios
        .get(url_base + `colaboradores/${id}`)
        .then(async (response) => {
          const data = response.data;
          setNome(data.nome);
          setEmail(data.email);
          setCpf(data.cpf);
          setCelular(data.celular);
          setUsuario(data.usuario)
          await axios
            .get(url_base + `instituicoes/${data.idInstituicao}`)
            .then((response) => {
              setInstituicao({
                value: response.data.idInstituicao,
                label: response.data.nomeFantasia,
              });
            });
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erro ao buscar dados do colaborador.");
        });
    }

    getColaborador();
  }, []);

  async function submit(e) {
    e.preventDefault();

    const objeto = {
      idColaborador: id,
      nome,
      cpf: limparMascara(cpf),
      email,
      ...(senha !== null && { senha: senha }),
      celular: Number(limparMascara(celular)),
      idInstituicao: instituicao.value,
      usuario: usuario
    };

    if (senha !== validSenha) {
      toast.error("Senhas não conferem!", {
        position: "top-center",
      });
    } else {
      setLoading(true);
      await axios
        .put(url_base + "colaboradores", objeto)
        .then(() => {
          toast.success("Editado com sucesso!");
          setLoading(false);
          navigate("/admin/colaboradores");
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          toast.error("Erro ao editar.");
        });
    }
  }

  function limparMascara(valor) {
    return valor?.replace(/[^\d]+/g, "");
  }
  function handleSenha(valor) {
    setAlteraSenha(valor);

    if (valor === "N") {
      setSenha(null);
      setValidSenha(null);
    }
  }

  return (
    <>
      <Title name="Editar Colaborador">
        <FiEdit size={28} />
      </Title>
      <form
        id="form-colaborador"
        className="card mt-4 p-4 col-9 mx-auto"
        onSubmit={submit}
      >
        <h1 className="text-center mb-5">Dados do Colaborador</h1>

        <div className="row mb-2">
          <div className="col-md-6">
            <label htmlFor="diaSemana" className="form-label">
              Instituição
            </label>
            <Select
              required
              isClearable={true}
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
              value={instituicao}
              className="basic-singl mt-1 mb-4"
              classNamePrefix="select"
              onChange={(valor) => setInstituicao(valor ? valor.value : null)}
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
              readOnly
              name="usuario"
              className="form-control inputForm"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-md-6">
            <label htmlFor="tipoPessoa" className="form-label">
              Alterar senha ?
            </label>
            <div
              className="btn-group area-radio mb-4"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                required
                className="btn-check"
                name="alteraSenha"
                id="alteraSenhaS"
                autoComplete="off"
                value="S"
                checked={alteraSenha === "S"}
                onChange={(e) => handleSenha(e.target.value)}
              />
              <label className="btn btn-outline-primary" htmlFor="alteraSenhaS">
                SIM
              </label>

              <input
                type="radio"
                required
                className="btn-check"
                name="alteraSenha"
                id="alteraSenhaN"
                autoComplete="off"
                value="N"
                checked={alteraSenha === "N"}
                onChange={(e) => handleSenha(e.target.value)}
              />
              <label className="btn btn-outline-primary" htmlFor="alteraSenhaN">
                NÃO
              </label>
            </div>
          </div>
          {alteraSenha === "S" && (
            <>
              <div className="col-md-6">
                <label htmlFor="senha" className="form-label">
                  Nova senha
                </label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  required
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
                  autoComplete="off"
                  type="password"
                  id="validSenha"
                  name="validSenha"
                  required
                  className="form-control inputForm"
                  value={validSenha}
                  onChange={(e) => setValidSenha(e.target.value)}
                />
              </div>
            </>
          )}
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
            Salvar
          </button>
        )}
      </form>
    </>
  );
}
