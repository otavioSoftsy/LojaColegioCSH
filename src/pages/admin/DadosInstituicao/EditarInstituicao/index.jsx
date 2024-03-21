import axios from "axios";
import { useEffect, useState } from "react";
import Title from "../../../../components/admin/Title";
import { toast } from "react-toastify";
import { url_base } from "../../../../services/apis";
import ReactInputMask from "react-input-mask";
import { RiSchoolLine } from "react-icons/ri";
import "./editarInstituicao.css";

export default function EditarInstituicao() {
  const [cnpj, setCnpj] = useState(null);
  const [nome, setNome] = useState(null);
  const [nomeFantasia, setNomeFantasia] = useState(null);
  const [email, setEmail] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [celular, setCelular] = useState(null);
  const [senha, setSenha] = useState(null);
  const [validSenha, setValidSenha] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartao, setCartao] = useState(false);
  const [boleto, setBoleto] = useState(false);
  const [pix, setPix] = useState(false);
  const [alteraSenha, setAlteraSenha] = useState(null);
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cep, setCep] = useState("");


  const objeto = {
    idInstituicao: 13,
    nomeResponsavel: nome,
    nomeFantasia,
    cnpj: limparMascara(cnpj),
    email,
    usuario,
    celular: limparMascara(celular),
    ...(senha !== null && { senha: senha }),
    aceitacartao: cartao,
    aceitaBoleto: boleto,
    aceitaPix: pix,
    logradouro,
    numero,
    complemento,
    cep,
    numeroParcelas: 12
  };

  async function getInstituicao() {
    await axios
      .get(url_base + `instituicoes/13`)
      .then((response) => {
        const data = response.data;

        setNome(data.nomeResponsavel);
        setEmail(data.email);
        setCnpj(data.cnpj);
        setCelular(data.celular);
        setNomeFantasia(data.nomeFantasia);
        setLogradouro(data.logradouro);
        setNumero(data.numero);
        setComplemento(data.complemento);
        setCep(data.cep);
        setPix(data.aceitaPix);
        setBoleto(data.aceitaBoleto);
        setCartao(data.aceitacartao);
        setUsuario(data.usuario);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erro ao buscar dados da instituição.");
      });
  }

  useEffect(() => {
    getInstituicao();
  }, []);

  async function editar(e) {
    e.preventDefault();
    if (senha !== validSenha) {
      toast.error("Senhas não conferem!", {
        position: "top-center",
      });
    } else {
      setLoading(true);
      await axios
        .put(url_base + "instituicoes", objeto)
        .then(() => {
          toast.success("Editado com sucesso!");
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          toast.error("Erro ao editar.");
        });
    }
  }

  function handleSenha(valor) {
    setAlteraSenha(valor);

    if (valor === "N") {
      setSenha(null);
      setValidSenha(null);
    }
  }

  function limparMascara(valor) {
    return valor?.replace(/[^\d]+/g, "");
  }
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

  return (
    <>
      <Title name="Instituição">
        <RiSchoolLine size={28} />
      </Title>
      <form
        id="form-instituicao"
        className="card mt-4 p-4 col-9 mx-auto"
        onSubmit={editar}
      >
        <h1 className="text-center mb-5">Dados da instituição</h1>

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
        </div>
        <div className="row mb-2">
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
            <label htmlFor="user" className="form-label">
              Usuário:
            </label>
            <input
              type="text"
              autoComplete="off"
              id="user"
              required
              name="user"
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
        <div className="col-md-12 mt-2 mb-4">
          <span className="form-text fs-5 text">Endereço</span>
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
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
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
                checked={cartao}
                onChange={(e) => setCartao(e.target.checked)}
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
                checked={boleto}
                onChange={(e) => setBoleto(e.target.checked)}
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
                checked={pix}
                onChange={(e) => setPix(e.target.checked)}
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
            Salvar
          </button>
        )}
      </form>
    </>
  );
}
