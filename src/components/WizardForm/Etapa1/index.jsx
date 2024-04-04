import { toast } from "react-toastify";

/* eslint-disable react/prop-types */
export default function Etapa1({ handleChange, formData, nextStep }) {
  const isFormValid = () => {
    return (
      formData.nome &&
      formData.nome.length >= 10 &&
      formData.genero &&
      formData.dataNascimento
    );
  };

  const verificarIdade = () => {
    const dataNascimento = new Date(formData.dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
      idade--;
    }

    if (idade < 18) {
      toast.error("Você deve ter pelo menos 18 anos para prosseguir.", {
        autoClose: 6000,
        theme: "colored",
      });
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (!isFormValid()) {
      if (!formData.nome || formData.nome.length < 10) {
        toast.warn("Informe o seu nome completo.", {
          autoClose: 6000,
          theme: "colored",
        });
      } else {
        toast.error("Preencha todos os campos.", {
          autoClose: 6000,
          theme: "colored",
        });
      }
      return;
    }

    if (!verificarIdade()) {
      return;
    }

    nextStep();
  };

  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="nome"
          name="nome" 
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome completo"
          required
          autoComplete="off"
        />
        <label htmlFor="nome">Nome completo</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          autoComplete="off"
          required
        />
        <label htmlFor="email">Email</label>
      </div>

      <div className="form-floating mb-3">
        <select
          className="form-select"
          aria-label="Floating label select example"
          id="genero"
          autoComplete="off"
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          placeholder="Gênero"
          required
        >
          <option disabled={true} value="">
            Selecione uma opção
          </option>
          <option value="F">Feminino</option>
          <option value="M">Masculino</option>
          <option value="N">Prefiro não informar</option>
        </select>
        <label htmlFor="genero">Gênero</label>
      </div>

      <div className="form-floating mb-3">
        <input
          type="date"
          className="form-control"
          id="dataNascimento"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          max={currentDate}
          placeholder="Data de Nascimento"
          autoComplete="off"
          required
        />
        <label htmlFor="dataNascimento">Data de Nascimento</label>
      </div>

      <button className="btn btn-primary col-12" onClick={handleNextStep}>
        Próximo
      </button>
    </div>
  );
}