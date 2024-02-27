import PropTypes from "prop-types";
import "./cardpedido.css";
import { useEffect, useState } from "react";

CardPedido.propTypes = {
  idPedido: PropTypes.number.isRequired,
  itens: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  formaPagamento: PropTypes.string.isRequired,
  valorTotal: PropTypes.number.isRequired,
};

export default function CardPedido({
  idPedido,
  itens,
  status,
  valorTotal,
  formaPagamento,
}) {
  const [st, setSt] = useState(null);

  useEffect(() => {
    console.log(itens);
    if (status === "A") {
      setSt("AGUARDANDO PAGAMENTO");
    } else if (status === "P") {
      setSt("PAGAMENTO REALIZADO");
    } else if (status === "E") {
      setSt("PAGAMENTO ESTORNADO");
    }
  }, []);

  return (
    <div className="card-pedido">
      <div
        className="title-card-pedido"
        style={{
          backgroundColor:
            (status === "A" && "#FCEE47") ||
            (status === "P" && "#3FC7F1") ||
            (status === "E" && "#DC3545"),
          color: status !== "A" ? "#f8f8f8" : "#3b3b3b",
        }}
      >
        <h5>{st}</h5>
      </div>
      <div className="body-card-pedido">
        <h5 id="number-pedido">PEDIDO {idPedido}</h5>
        <div
          className="d-flex justify-content-between"
        >
          <p className="col-8">Itens</p>
          <p className="col-1">Qtd</p>
          <p className="col-3 text-end">Valor</p>
        </div>

        {itens.map((item) => {
          return (
            <div key={item.idCurso} className="d-flex justify-content-between">
              <p className="col-8">{item.nomeCurso}</p>
              <p className="col-1">{item.quantidade} x</p>
              <p className="col-3 text-end">
                R$ {item.total.toFixed(2).replace(".", ",")}
              </p>
            </div>
          );
        })}
        <h5 id="total-card-pedido">
          Total R$ {valorTotal.toFixed(2).replace(".", ",")} -{" "}
          {formaPagamento === "RECORRENCIA"
            ? "CARTÃO DE CRÉDITO"
            : formaPagamento}
        </h5>
      </div>
    </div>
  );
}
