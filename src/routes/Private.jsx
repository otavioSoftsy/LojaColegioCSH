import { Navigate } from "react-router-dom";
import useContexts from "../hooks/useContexts";
import PropTypes from "prop-types"

Private.propTypes = {
  children: PropTypes.node.isRequired,
}

export default function Private({children}) {
  const { colaboradorLogado, fornecedorLogado, instituicaoLogado, loading } = useContexts();

  if (loading) {
    return(
      <div>
        
      </div>
    )
  }

  if (!colaboradorLogado & !fornecedorLogado & !instituicaoLogado) {
    return <Navigate to="/admin"/>
  }
    return children;
}