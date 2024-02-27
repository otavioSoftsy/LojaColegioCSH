import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";

/* eslint-disable react/prop-types */
export default function Etapa3({
  handleChange,
  formData,
  onSubmit,
  previousStep,
  loading,
  setFormData,
}) {
  const isFormValid = () => {
    return (
      formData.cep &&
      formData.endereco &&
      formData.municipio &&
      formData.uf &&
      formData.numero &&
      formData.bairro
    );
  };

  const handleOnSubmit = () => {
    if (isFormValid()) {
      onSubmit();
    } else {
      toast.error("Preencha todos os campos.");
    }
  };

  function getCep() {
    const { cep } = formData;
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => response.json())
      .then((data) => {
        setFormData({
          ...formData,
          municipio: data.localidade,
          endereco: data.logradouro,
          uf: data.uf,
          complemento: data.complemento,
          bairro: data.bairro,
        });
      })
      .catch((error) => {
        console.log("Erro ao buscar CEP:", error);
      });
  }

  return (
    <div className="etapa3">
      <div className="d-flex justify-content-between">
        <div className="form-floating cep mb-3 col-6">
          <ReactInputMask
            mask="99999-999"
            maskChar={null}
            type="tel"
            className="form-control"
            id="cep"
            name="cep"
            value={formData.cep}
            onChange={(e) => handleChange(e)}
            placeholder="CEP"
            autoComplete="off"
            onBlur={getCep}
            required
          />
          <label htmlFor="cep">CEP</label>
        </div>
        <div className="form-floating uf mb-3 col-6">
          <input
            type="text"
            className="form-control"
            id="uf"
            name="uf"
            value={formData.uf}
            onChange={handleChange}
            placeholder="UF"
            autoComplete="off"
            required
          />
          <label htmlFor="uf">UF</label>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div className="form-floating mb-3 col-6 municipio">
          <input
            type="text"
            className="form-control"
            id="municipio"
            name="municipio"
            value={formData.municipio}
            onChange={handleChange}
            placeholder="Município"
            autoComplete="off"
            required
          />
          <label htmlFor="municipio">Município</label>
        </div>
        <div className="form-floating bairro mb-3 col-6">
          <input
            type="text"
            className="form-control"
            id="bairro"
            name="bairro"
            value={formData.bairro}
            onChange={handleChange}
            placeholder="Bairro"
            autoComplete="off"
            required
          />
          <label htmlFor="bairro">Bairro</label>
        </div>
      </div>

      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="logradouro"
          name="endereco"
          value={formData.endereco}
          onChange={handleChange}
          placeholder="Logradouro"
          autoComplete="off"
          required
        />
        <label htmlFor="logradouro">Logradouro</label>
      </div>
      <div className="d-flex justify-content-between">
        <div className="form-floating num mb-3">
          <input
            type="tel"
            className="form-control"
            id="numero"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            placeholder="Número"
            autoComplete="off"
            required
          />
          <label htmlFor="numero">Número</label>
        </div>
        <div className="form-floating mb-3 col-8">
          <input
            type="text"
            className="form-control"
            id="complemento"
            name="complemento"
            value={formData.complemento}
            onChange={handleChange}
            placeholder="Complemento"
            autoComplete="off"
            required
          />
          <label htmlFor="complemento">Complemento (Opcional)</label>
        </div>
      </div>

      <div className="btns-wizard">
        <button className="btn btn-primary me-3 col-6" onClick={previousStep}>
          Anterior
        </button>
        {loading ? (
          <button className="btn btn-primary" type="button" disabled>
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden" role="status">
              Loading...
            </span>
          </button>
        ) : (
          <button className="btn btn-primary col-6" onClick={handleOnSubmit}>
            Enviar
          </button>
        )}
      </div>
    </div>
  );
}
