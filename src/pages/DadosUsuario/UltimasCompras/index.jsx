import { useEffect, useState } from "react";
import CardPedido from "../../../components/CardPedido";
import "./UltimasCompras.css";
import axios from "axios";
import useContexts from "../../../hooks/useContexts";
import { api_financeiro } from "../../../services/pagBank";

export default function UltimasCompras() {
  const { client } = useContexts();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getPedidos() {
      setLoading(true)
      await axios
        .get(
          api_financeiro + `/pedido/cliente/listar?idCliente=${client.idCliente}`
        )
        .then((response) => {
          const dados = response.data;

          if (dados.sucesso) {
            setPedidos(dados.retorno);
            setLoading(false)
          } else {
            console.log("Erro ao carregar dados");
            setLoading(false)
          }
        });
    }
    getPedidos();
  }, []);
  return (
    <div className="container-historico">
      <section className="container-cli content-historico">
        <div className="head-historico">
          <h2>Histórico de compras</h2>
          {/* <div className="container-buttons">
            <button className="btn btn-primary">Ultimos 90 dias</button>
            <button className="btn btn-primary">Ultimos 6 meses</button>
            <button className="btn btn-primary">Selecionar Periodo</button>
          </div> */}
        </div>
        <div className="cards-pedidos">
          {pedidos.slice().reverse().map((item) => {
            return (
              <CardPedido
                key={item.idVenda}
                idPedido={item.idVenda}
                status={item.status}
                itens={item.itens}
                valorTotal={item.valorTotal}
                parcelas={item.numParcelas}
                formaPagamento={item.formaPagamento}
              />
            );
          })}
          {loading && (
            <>
              <div
                className="card placeholder-wave"
                aria-hidden="true"
              >
                <span
                  className="placeholder bg-secondary"
                  style={{ height: "100%" }}
                ></span>
              </div>
              <div
                className="card placeholder-wave"
                aria-hidden="true"
              >
                <span
                  className="placeholder bg-secondary"
                  style={{ height: "100%" }}
                ></span>
              </div>
              <div
                className="card placeholder-wave"
                aria-hidden="true"
              >
                <span
                  className="placeholder bg-secondary"
                  style={{ height: "100%" }}
                ></span>
              </div>
              <div
                className="card placeholder-wave"
                aria-hidden="true"
              >
                <span
                  className="placeholder bg-secondary"
                  style={{ height: "100%" }}
                ></span>
              </div>
              <div
                className="card placeholder-wave"
                aria-hidden="true"
              >
                <span
                  className="placeholder bg-secondary"
                  style={{ height: "100%" }}
                ></span>
              </div>
              <div
                className="card placeholder-wave"
                aria-hidden="true"
              >
                <span
                  className="placeholder bg-secondary"
                  style={{ height: "100%" }}
                ></span>
              </div>
              <div
                className="card placeholder-wave"
                aria-hidden="true"
              >
                <span
                  className="placeholder bg-secondary"
                  style={{ height: "100%" }}
                ></span>
              </div>
            </>
          )}
        </div>
       
      </section>
    </div>
  );
}
