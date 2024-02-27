import { useState, useEffect } from "react";
import axios from "axios";
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";
import { url_base } from "../../services/apis";
import "./dados.css";
import useContexts from "../../hooks/useContexts";

export default function DadosUsuario() {
  const { client } = useContexts();

  const currentDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    idCliente: client.idCliente,
    nome: null,
    bairro: null,
    email: null,
    genero: null,
    cpf: null,
    dataNascimento: null,
    celular: null,
    cep: null,
    uf: null,
    municipio: null,
    endereco: null,
    numero: null,
    complemento: null,
  });
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("@gdv-login-user"));

    async function getDados() {
      await axios
        .get(url_base + `clientes/${user.idCliente}`)
        .then((response) => {
          const dados = response.data;

          setFormData({
            ...formData,
            nome: dados.nome,
            email: dados.email,
            genero: dados.genero,
            dataNascimento: dados.dataNascimento,
            celular: dados.celular,
            cep: dados.cep,
            uf: dados.uf,
            cpf: dados.cpf,
            municipio: dados.municipio,
            endereco: dados.endereco,
            bairro: dados.bairro,
            numero: dados.numero,
            complemento: dados.complemento,
          });
        })
        .catch(() => {
          toast.error("Erro ao buscar dados.");
        });
    }
    getDados();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));

    setIsFormDirty(true);
  };
  const handleRadioChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setIsFormDirty(true);
  };

  function limparMascara(valor, campo) {
    if (campo === "cpf" || campo === "celular" || campo === "cep") {
      return valor ? valor.replace(/[^\d]+/g, "") : "";
    }
    return valor;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setIsFormDirty(false);

    const formDataLimpo = {};

    for (const key in formData) {
      if (Object.hasOwnProperty.call(formData, key)) {
        formDataLimpo[key] = limparMascara(formData[key], key);
      }
    }
    await axios
      .put(url_base + `clientes/${client.idCliente}`, formDataLimpo)
      .then(() => {
        toast.success("Atualizado com sucesso.");
      })
      .catch(() => {
        toast.error("Erro ao atualizar dados.");
      });
  }

  return (
    <div className="container">
      <div className="content-user">
        <form onSubmit={handleSubmit}>
          <h2 className="text-center">Minha conta</h2>
          <p className="text-center">
            Edite as configurações da sua conta e altere sua senha aqui.
          </p>
          <div className="col-md-12 mt-4">
            <span className="form-text fs-5 text">Dados da conta</span>
            <hr className="mt-2" />
          </div>
          <div className="mb-4 mt-4">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              id="email"
              value={formData.email}
              readOnly
            />
          </div>
          {/* <div className="mb-3">
            <label htmlFor="senha" className="form-label">
              Senha
            </label>
            <input
              type="password"
              className="form-control form-control-lg"
              id="senha"
              placeholder="Digite a senha atual"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control form-control-lg"
              id="confirmSenha"
              placeholder="Digite a nova senha"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control form-control-lg"
              id="confirmSenha"
              placeholder="Confirme a nova senha"
            />
          </div>
          <button type="button" className="btn btn-secondary mb-3">
            Alterar senha
          </button> */}
          <div className="mt-2">
            <span className="form-text fs-5 text">Dados pessoais</span>
            <hr className="mt-2" />
          </div>
          <div className="mb-4 mt-4">
            <label htmlFor="nome" className="form-label">
              Nome completo
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="nome"
              required
              autoComplete="off"
              value={formData.nome}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cpf" className="form-label">
              CPF
            </label>
            <ReactInputMask
              mask="999.999.999-99"
              maskChar={null}
              type="tel"
              className="form-control form-control-lg"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Gênero</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="genero"
                  id="feminino"
                  value="F"
                  checked={formData.genero === "F"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="feminino">
                  Feminino
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="genero"
                  id="masculino"
                  value="M"
                  checked={formData.genero === "M"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="masculino">
                  Masculino
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="genero"
                  id="naoInformar"
                  value="N"
                  checked={formData.genero === "N"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="naoInformar">
                  Não informar
                </label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="dataNascimento" className="form-label">
              Data de nascimento
            </label>
            <input
              type="date"
              className="form-control form-control-lg"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              max={currentDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="nome" className="form-label">
              Celular
            </label>
            <ReactInputMask
              mask="(99) 99999-9999"
              maskChar={null}
              type="tel"
              className="form-control form-control-lg"
              id="celular"
              name="celular"
              value={formData.celular}
              autoComplete="off"
              onChange={handleInputChange}
            />
          </div>

          <div className="mt-2">
            <span className="form-text fs-5 text">Endereço</span>
            <hr className="mt-2" />
          </div>
          <div className="my-4 d-flex justify-content-between">
            <div className="col-6">
              <label htmlFor="cep" className="form-label">
                CEP
              </label>
              <ReactInputMask
                mask="99999-999"
                maskChar={null}
                type="tel"
                className="form-control form-control-lg"
                id="cep"
                name="cep"
                value={formData.cep}
                autoComplete="off"
                onChange={handleInputChange}
              />
            </div>
            <div className="col-6 uf-minha-conta">
              <label htmlFor="uf" className="form-label">
                UF
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="uf-minha-conta"
                name="uf"
                value={formData.uf}
                autoComplete="off"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-4 d-flex justify-content-between">
            <div className="col-6">
              <label htmlFor="cep" className="form-label">
                Município
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="municipio"
                value={formData.municipio}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-6 uf-minha-conta">
              <label htmlFor="bairro" className="form-label">
                Bairro
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="bairro"
                name="bairro"
                value={formData.bairro}
                autoComplete="off"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="endereco" className="form-label">
              Logradouro
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4 ">
            <label htmlFor="numero" className="form-label">
              Número
            </label>
            <input
              type="tel"
              className="form-control form-control-lg"
              id="numero"
              name="numero"
              value={formData.numero}
              autoComplete="off"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="complemento" className="form-label">
              Complemento
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="complemento"
              value={formData.complemento}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isFormDirty}
          >
            Salvar alterações
          </button>
        </form>
      </div>
    </div>
  );
}
