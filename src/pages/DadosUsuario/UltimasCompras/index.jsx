import { useEffect, useState } from "react";
import CardPedido from "../../../components/CardPedido";
import "./UltimasCompras.css";
import axios from "axios";
import useContexts from "../../../hooks/useContexts";

export default function UltimasCompras() {
  const { client } = useContexts();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getPedidos() {
      setLoading(true)
      await axios
        .get(
          `https://api-financeiro.sumare.edu.br/api-gdv-pagbank/pedido/cliente/listar?idCliente=${client.idCliente}`
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
        {/* 
        <div className="col-md-4">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              <FiSearch size={17} />
            </span>
            <input
              id="pesquisa"
              type="text"
              className="form-control"
              placeholder="Pesquise suas compras"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>

        <div className="area-tabela col-md-12">
          <table className="table table-light mt-2 text-center">
            <thead>
              <tr>
                <th scope="col" className="fw-semibold bg-dark-subtle">
                  Itens
                </th>
                <th scope="col" className="fw-semibold bg-dark-subtle">
                  Data de compra
                </th>
                <th scope="col" className="fw-semibold bg-dark-subtle">
                  Tipo de pagamento
                </th>
                <th scope="col" className="fw-semibold bg-dark-subtle">
                  Valor das mensalidades
                </th>
                <th scope="col" className="fw-semibold bg-dark-subtle">
                  Status da compra
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2 atividades</td>
                <td>12/02/2024</td>
                <td>Boleto</td>
                <td>R$ 169,00</td>
                <td>
                  <span className="badge text-bg-warning">Aguardando</span>
                </td>
              </tr>
              <tr>
                <td>2 atividades</td>
                <td>12/02/2024</td>
                <td>Cartão de crédito</td>
                <td>R$ 169,00</td>
                <td>
                  <span className="badge text-bg-success">Aprovado</span>
                </td>
              </tr>
              <tr>
                <td>2 atividades</td>
                <td>12/02/2024</td>
                <td>Cartão de crédito</td>
                <td>R$ 169,00</td>
                <td>
                  <span className="badge text-bg-success">Aprovado</span>
                </td>
              </tr>
              <tr>
                <td>2 atividades</td>
                <td>12/02/2024</td>
                <td>Cartão de crédito</td>
                <td>R$ 169,00</td>
                <td>
                  <span className="badge text-bg-success">Aprovado</span>
                </td>
              </tr>
              <tr>
                <td>2 atividades</td>
                <td>12/02/2024</td>
                <td>Pix</td>
                <td>R$ 169,00</td>
                <td>
                  <span className="badge text-bg-danger">Negado</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div> */}
      </section>
    </div>
  );
}
