import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";

/* eslint-disable react/prop-types */
export default function Etapa2({
  handleChange,
  formData,
  nextStep,
  previousStep,
}) {
  const isFormValid = () => {
    return (
      formData.cpf &&
      formData.celular &&
      formData.senha &&
      formData.passwordConfirmed
    );
  };

  const arePasswordsEqual = () => {
    return formData.senha === formData.passwordConfirmed;
  };


  const handleNextStep = () => {
    if (isFormValid() && arePasswordsEqual()) {
      nextStep();
    } else if (!arePasswordsEqual()) {
      toast.error("Senhas não coincidem.");
    } else {
      toast.error("Preencha todos os campos.");
    }
  };

  return (
    <div className="etapa2">
      <div className="form-floating mb-3">
      <ReactInputMask
          mask="999.999.999-99"
          maskChar={null}
          type="tel"
          className="form-control"
          id="cpf"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          placeholder="CPF"
          autoComplete="off"
          required
        />
        <label htmlFor="cpf">CPF</label>
      </div>
      <div className="form-floating mb-3">
      <ReactInputMask
          mask="(99) 99999-9999"
          maskChar={null}
          type="tel"
          className="form-control"
          id="celular"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          placeholder="Celular"
          autoComplete="off"
          required
        />
        <label htmlFor="celular">Celular</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control"
          id="senha"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          placeholder="Senha"
          autoComplete="off"
          required
        />
        <label htmlFor="senha">Senha</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control"
          id="passwordConfirmed"
          name="passwordConfirmed"
          value={formData.passwordConfirmed}
          onChange={handleChange}
          placeholder="passwordConfirmed"
          autoComplete="off"
          required
        />
        <label htmlFor="passwordConfirmed">Confirme a senha</label>
      </div>
      <div className="btns-wizard">
        <button className="btn btn-primary me-2 col-6" onClick={previousStep}>
          Anterior
        </button>
        <button className="btn btn-primary col-6" onClick={handleNextStep}>
          Próximo
        </button>
      </div>
    </div>
  );
}
