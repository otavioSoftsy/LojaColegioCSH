/* eslint-disable react/prop-types */
import { useState } from "react";
import StepWizard from "react-step-wizard";
import Etapa1 from "./Etapa1";
import Etapa2 from "./Etapa2";
import Etapa3 from "./Etapa3";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useContexts from "../../hooks/useContexts";
import { url_base } from "../../services/apis";
import "./wizard.css";

function WizardForm() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    genero: "",
    dataNascimento: "",
    email: "",
    celular: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    municipio: "",
    uf: "",
    senha: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { storageClient, setClient } = useContexts();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function limparMascara(valor, campo) {
    if (campo === "cpf" || campo === "celular" || campo === "cep") {
      return valor ? valor.replace(/[^\d]+/g, "") : "";
    }
    return valor;
  }

  async function handleSubmit() {
    setLoading(true);
    const formDataLimpo = {};
    for (const key in formData) {
      if (Object.hasOwnProperty.call(formData, key)) {
        formDataLimpo[key] = limparMascara(formData[key], key);
      }
    }

    try {
      const response = await axios.post(url_base + "clientes", formDataLimpo);

      const user = response.data;
      storageClient(user);
      setClient(user);

      let mensagemTimeout = true;

      while (mensagemTimeout) {
        const responsavelUpdate = await axios.get(
          "https://api-academico.sumare.edu.br/api-gdv-emweb/responsavel/cache/atualizar",
          {
            timeout: 8000,
          }
        );

        if (responsavelUpdate.data.sucesso) {
          await axios.get(
            "https://api-academico.sumare.edu.br/api-gdv-emweb/aluno/cache/atualizar"
          );
          setLoading(false);
          toast.success(`Cadastro realizado com sucesso!`);
          navigate("/");
          mensagemTimeout = false;
        } else {
          console.log(responsavelUpdate.data);
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  return (
    <StepWizard>
      <Etapa1 handleChange={handleChange} formData={formData} />
      <Etapa2 handleChange={handleChange} formData={formData} />
      <Etapa3
        handleChange={handleChange}
        formData={formData}
        onSubmit={handleSubmit}
        loading={loading}
        setFormData={setFormData}
      />
    </StepWizard>
  );
}

export default WizardForm;
