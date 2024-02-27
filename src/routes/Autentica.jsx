import { Navigate } from "react-router-dom";
import useContexts from "../hooks/useContexts";
import PropTypes from "prop-types"

Autentica.propTypes = {
  children: PropTypes.node.isRequired,
}

export default function Autentica({children}) {
  const { fornecedorLogado } = useContexts();

  if (fornecedorLogado) {
    return <Navigate to="/admin"/>
  }
    return children;
}