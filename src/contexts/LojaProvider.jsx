import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const LojaContext = createContext({});

LojaProvider.propTypes = {
  children: PropTypes.node,
};

export default function LojaProvider({ children }) {
  const [colaborador, setColaborador] = useState(null);
  const [fornecedor, setFornecedor] = useState(null);
  const [instituicao, setInstituicao] = useState(null);
  const [client, setClient] = useState(
    JSON.parse(localStorage.getItem("@csh-login-user"))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadingAdmin() {
      const storageUser = localStorage.getItem("@csh-login-admin");
      if (storageUser && JSON.parse(storageUser).perfil === "COLABORADOR") {
        setColaborador(JSON.parse(storageUser));
        setLoading(false);
      } else if (
        storageUser &&
        JSON.parse(storageUser).perfil === "FORNECEDOR"
      ) {
        setFornecedor(JSON.parse(storageUser));
        setLoading(false);
      } else if (
        storageUser &&
        JSON.parse(storageUser).perfil === "INSTITUICAO"
      ) {
        setInstituicao(JSON.parse(storageUser));
        setLoading(false);
      }

      setLoading(false);
    }

    loadingAdmin();
  }, []);

  const setCurso = (id) => {
    localStorage.setItem("@csh-idAtividade", id);
  };

  function storageUser(data) {
    localStorage.setItem("@csh-login-admin", JSON.stringify(data));
  }
  function dadosPagamentoCartao(data) {
    localStorage.setItem("@csh-dados-pagamento", JSON.stringify(data));
  }
  function storageClient(data) {
    localStorage.setItem("@csh-login-user", JSON.stringify(data));
  }

  function logoutAdmin() {
    localStorage.removeItem("@csh-login-admin");
    setColaborador(null);
    setFornecedor(null);
    setInstituicao(null);
  }
  function logoutAccount() {
    localStorage.removeItem("@csh-login-user");
    setClient(null);
  }

  const dados = {
    setCurso,
    colaboradorLogado: !!colaborador,
    fornecedorLogado: !!fornecedor,
    instituicaoLogado: !!instituicao,
    clientLogado: !!client,
    setClient,
    client,
    storageClient,
    dadosPagamentoCartao,
    setColaborador,
    setFornecedor,
    setInstituicao,
    storageUser,
    logoutAccount,
    loading,
    logoutAdmin,
  };

  return <LojaContext.Provider value={dados}>{children}</LojaContext.Provider>;
}
