import "./novoFornecedor.css";
import ReactInputMask from "react-input-mask";
import axios from "axios";
import { useState } from "react";
import Title from "../../../../components/admin/Title";
import { FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { url_base } from "../../../../services/apis";
import makeAnimated from "react-select/animated";
import Select from "react-select";

export default function EditarFornecedor() {
  const [cpfResponsavel, setCpfResponsavel] = useState(null);
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [gatewayPagamento, setGatewayPagamento] = useState([]);
  const [telefone, setTelefone] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cep, setCep] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState(null);
  const [validSenha, setValidSenha] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState("");
  const [loading, setLoading] = useState(false);
  const [usuarioCadastro, setUsuarioCadastro] = useState(null);
  const [alteraSenha, setAlteraSenha] = useState(null);

  const { id } = useParams();
  const animatedComponents = makeAnimated();

  const gateways = [{ value: 1, label: "PagBank" }];

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("@gdv-login-admin"));
    setUsuarioCadastro(user.usuario);
    async function getFornecedor() {
      await axios
        .get(url_base + `fornecedor/obter?idFornecedor=${id}`)
        .then((data) => {
          const dadosFornecedor = data.data;
          console.log(dadosFornecedor);
          setNomeResponsavel(dadosFornecedor.nomeResponsavel);
          setCnpj(dadosFornecedor.cnpj);
          setRazaoSocial(dadosFornecedor.razaoSocial);
          setNomeFantasia(dadosFornecedor.nomeFantasia);
          setGatewayPagamento([{
            value: dadosFornecedor.idGateway,
            label: dadosFornecedor.gatewayPagamento,
          }]);
          setTelefone(dadosFornecedor.telefone);
          setCelular(dadosFornecedor.celular);
          setEmail(dadosFornecedor.email);
          setLogradouro(dadosFornecedor.logradouro);
          setNumero(dadosFornecedor.numero);
          setComplemento(dadosFornecedor.complemento);
          setCep(dadosFornecedor.cep);
          setUsuario(dadosFornecedor.usuario);

          if (dadosFornecedor.cnpj) {
            setTipoPessoa("J");
          } else {
            setCpfResponsavel(dadosFornecedor.cpfResponsavel);
            setTipoPessoa("F");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erro ao buscar dados do parceiro.");
        });
    }

    getFornecedor();
  }, []);

  function getCep() {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => response.json())
      .then((data) => {
        setLogradouro(data.logradouro);
        setNumero(data.numero);
      })
      .catch((error) => {
        console.log("Erro ao buscar CEP:", error);
      });
  }

  async function editarFornecedor(e) {
    e.preventDefault();

    const objeto = {
      idFornecedor: id,
      usuarioCadastro: usuarioCadastro,
      ativo: "S",
      cpfResponsavel:
        typeof cpfResponsavel === "string"
          ? limparMascara(cpfResponsavel)
          : cpfResponsavel,
      nomeResponsavel: nomeResponsavel,
      cnpj: typeof cnpj === "string" ? limparMascara(cnpj) : cnpj,
      razaoSocial: razaoSocial,
      nomeFantasia: nomeFantasia,
      gatewayPagamento: gatewayPagamento.length > 0 ? gatewayPagamento[0].label : null,
      idGateway: gatewayPagamento.length > 0 ? gatewayPagamento[0].value : null,
      telefone:
        typeof telefone === "string" ? limparMascara(telefone) : telefone,
      celular: typeof celular === "string" ? limparMascara(celular) : celular,
      email: email,
      logradouro: logradouro,
      numero: numero,
      complemento: complemento,
      cep: typeof cep === "string" ? limparMascara(cep) : cep,
      usuario: usuario,
      ...(senha !== null && { senha: senha }),
    };

    if (senha !== validSenha) {
      toast.error("Senhas não conferem!", {
        position: "top-center",
      });
    } else {
      setLoading(true);

      await axios
        .post(url_base + "fornecedor/alterar", objeto)
        .then(() => {
          toast.success("Atualizado com sucesso!");
          setLoading(false);
          navigate("/admin/parceiros");
        })
        .catch((error) => {
          setLoading(false);
          toast.error("Erro ao editar.");
          console.log(error);
        });
    }
  }

  function limparMascara(valor) {
    return valor?.replace(/[^\d]+/g, "");
  }

  function handleTipoPessoa(valor) {
    setTipoPessoa(valor);

    if (valor === "F") {
      setCnpj(null);
      setNomeFantasia(null);
      setRazaoSocial(null);
    } else {
      setCpfResponsavel(null);
    }
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
      <div>
        <Title name="Editar dados do Parceiro">
          <FiEdit size={28} />
        </Title>
        <form
          id="formFornecedor"
          className="card mt-4 p-4 col-8 mx-auto"
          onSubmit={editarFornecedor}
        >
          <h1 className="text-center mb-5">Dados do Parceiro</h1>

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="nomeResponsavel" className="form-label">
                Nome do Responsável
              </label>
              <input
                required
                type="text"
                id="nomeResponsavel"
                name="nomeResponsavel"
                className="form-control inputForm"
                value={nomeResponsavel}
                onChange={(e) => setNomeResponsavel(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                name="email"
                className="form-control inputForm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="usuario" className="form-label">
                Usúario
              </label>
              <input
                type="text"
                id="usuario"
                required
                name="usuario"
                className="form-control inputForm"
                readOnly
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>
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
                <label
                  className="btn btn-outline-primary"
                  htmlFor="alteraSenhaS"
                >
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
                <label
                  className="btn btn-outline-primary"
                  htmlFor="alteraSenhaN"
                >
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

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="tipoPessoa" className="form-label">
                É pessoa física ou jurídica ?
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
                  name="tipoPessoa"
                  id="tipoPessoaF"
                  autoComplete="off"
                  value="F"
                  checked={tipoPessoa === "F"}
                  onChange={(e) => handleTipoPessoa(e.target.value)}
                />
                <label
                  className="btn btn-outline-primary"
                  htmlFor="tipoPessoaF"
                >
                  Física
                </label>

                <input
                  type="radio"
                  required
                  className="btn-check"
                  name="tipoPessoa"
                  id="tipoPessoaJ"
                  autoComplete="off"
                  value="J"
                  checked={tipoPessoa === "J"}
                  onChange={(e) => handleTipoPessoa(e.target.value)}
                />
                <label
                  className="btn btn-outline-primary"
                  htmlFor="tipoPessoaJ"
                >
                  Jurídica
                </label>
              </div>
            </div>
            {tipoPessoa === "F" && (
              <div className="col-md-6">
                <label htmlFor="cpf" className="form-label">
                  CPF do Responsável
                </label>
                <ReactInputMask
                  mask="999.999.999-99"
                  type="tel"
                  id="cpf"
                  required
                  name="cpf"
                  className="form-control inputForm"
                  value={cpfResponsavel}
                  onChange={(e) => setCpfResponsavel(e.target.value)}
                />
              </div>
            )}
            {tipoPessoa === "J" && (
              <>
                <div className="col-md-6">
                  <label htmlFor="cnpj" className="form-label">
                    CNPJ
                  </label>
                  <ReactInputMask
                    mask="99.999.999/9999-99"
                    type="tel"
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
                    Nome Fantasia
                  </label>
                  <input
                    type="text"
                    id="nomeFantasia"
                    required
                    name="nomeFantasia"
                    className="form-control inputForm"
                    value={nomeFantasia}
                    onChange={(e) => setNomeFantasia(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="razaoSocial" className="form-label">
                    Razão Social
                  </label>
                  <input
                    type="text"
                    id="razaoSocial"
                    required
                    name="razaoSocial"
                    className="form-control inputForm"
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="col-md-6">
              <label className="form-label" htmlFor="telefone">
                Telefone
              </label>
              <ReactInputMask
                mask="(99) 9999-9999"
                type="tel"
                id="telefone"
                required
                name="telefone"
                className="form-control inputForm"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="celular" className="form-label">
                Celular
              </label>
              <ReactInputMask
                type="tel"
                mask="(99) 99999-9999"
                id="celular"
                name="celular"
                required
                className="form-control inputForm"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="gateway" className="form-label">
                Gateway de pagamento -{" "}
                <span className="form-text"> (opcional)</span>
              </label>
              <Select
                isClearable={true}
                components={animatedComponents}
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    borderColor: "#dee2e6",
                    "&:hover": {
                      borderColor: "#dee2e6",
                    },
                  }),
                }}
                name="gateway"
                value={gatewayPagamento.length > 0 && gatewayPagamento[0]}
                options={gateways}
                className="basic-singl mt-1 mb-4"
                classNamePrefix="select"
                onChange={(valor) => valor ? setGatewayPagamento([valor]) : setGatewayPagamento([])}
                placeholder="Selecione..."
              />
            </div>
          </div>

          <div className="col-md-12 mt-2 mb-4">
            <span className="form-text fs-5 text">
              Endereço - <span className="form-text"> (opcional)</span>
            </span>
            <hr className="mt-2" />
          </div>

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="cep" className="form-label">
                CEP
              </label>
              <ReactInputMask
                type="tel"
                mask="99999-999"
                id="cep"
                name="cep"
                className="form-control inputForm"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onBlur={getCep}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="numeroCasa" className="form-label">
                Número
              </label>
              <input
                type="tel"
                id="numeroCasa"
                maxLength={6}
                name="numeroCasa"
                className="form-control inputForm"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="logradouro" className="form-label">
                Logradouro
              </label>
              <input
                type="text"
                id="logradouro"
                name="logradouro"
                className="form-control inputForm"
                value={logradouro}
                onChange={(e) => setLogradouro(e.target.value)}
              />
            </div>
            <div className="col-md-6">
            <label htmlFor="complemento" className="form-label">
                Complemento
              </label>
              <input
                type="text"
                id="complemento"
                name="complemento"
                className="form-control inputForm"
                autoComplete="off"
                placeholder="Opcional"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
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
              Salvar
            </button>
          )}
        </form>
      </div>
    </>
  );
}
