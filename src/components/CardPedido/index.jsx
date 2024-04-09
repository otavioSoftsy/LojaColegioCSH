/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "./cardpedido.css";

CardPedido.propTypes = {
  idPedido: PropTypes.number.isRequired,
  itens: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  formaPagamento: PropTypes.string.isRequired,
  valorTotal: PropTypes.number.isRequired,
  parcelas: PropTypes.number.isRequired,
};

export default function CardPedido({
  idPedido,
  itens,
  status,
  valorTotal,
  formaPagamento,
  parcelas
}) {
  const [st, setSt] = useState(null);
  const [classeSt, setClasseSt] = useState(null);

  useEffect(() => {
    if (status === "A") {
      setSt("AGUARDANDO PAGAMENTO");
      setClasseSt('#FCEE47')
    } else if (status === "P") {
      setSt("PAGAMENTO REALIZADO");
      setClasseSt("#198754")
    } else if (status === "E") {
      setSt("PAGAMENTO ESTORNADO");
      setClasseSt("#6C757D")
    } else if (status === "N") {
      setSt("PAGAMENTO NEGADO");
      setClasseSt("#DC3545");
    } else if (status === "C") {
      setSt("PAGAMENTO CANCELADO");
      setClasseSt("#DC3545");
    }
  }, []);



  return (
    <div className="card-pedido">
      <div
        className="title-card-pedido"
        style={{
          backgroundColor:
            classeSt,
          color: status !== "A" ? "#f8f8f8" : "#3b3b3b",
        }}
      >
        <h5>{st}</h5>
      </div>
      <div className="body-card-pedido">
        
          <h5 id="number-pedido">PEDIDO Nº {idPedido}</h5>
        
        <div className="d-flex justify-content-between">
          <p className="col-8">Item</p>
          <p className="col-1">Qtd</p>
          <p className="col-3 text-end">Valor</p>
        </div>

        {itens.map((item) => {
          return (
            <div key={item.idCurso} className="d-flex justify-content-between">
              <p className="col-8">{item.nomeCurso}</p>
              <p className="col-1">{item.quantidade} x</p>
              <p className="col-3 text-end">
                R${item.total.toFixed(2).replace(".", ",")}
              </p>
            </div>
          );
        })}

       
          <h5 id="total-card-pedido">
            Total R$ {valorTotal.toFixed(2).replace(".", ",")} -{" "}
            {formaPagamento === 'CARTAO_CREDITO' ? `CARTÃO DE CRÉDITO EM ${parcelas}X` : formaPagamento}
          </h5>

      </div>
      
    </div>
  );
}
