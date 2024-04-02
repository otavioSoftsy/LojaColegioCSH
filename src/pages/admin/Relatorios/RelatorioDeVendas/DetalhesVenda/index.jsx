/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api_financeiro } from "../../../../../services/pagBank";
import { format } from "date-fns";

export default function DetalhesVenda({ id }) {
  const [details, setDetails] = useState([]);
  const btnClose = useRef(null);
  const idVenda = useId();

  useEffect(() => {
    const fetchDetalhes = async () => {
      try {
        if (id) {
          const response = await axios.get(
            api_financeiro + `/venda/obter/detalhada?idPedido=${id}`
          );
          const data = response.data;
          console.log(data);

          if (data.sucesso) {
            setDetails(data.retorno);
          } else {
            toast.error("Erro ao buscar dados.");
          }
        }
      } catch (error) {
        console.error("Erro ao obter detalhes:", error);
        toast.error("Erro ao buscar detalhes.");
      }
    };

    fetchDetalhes();
  }, [id]);

  return (
    <>
      <div
        className="modal fade"
        id="modalDetalhes"
        tabIndex="-1"
        aria-labelledby="modalDetalhes"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="m-0 fw-normal">Detalhes da Venda</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={btnClose}
              ></button>
            </div>
            <div className="modal-body btns-termos px-3 py-3 d-flex flex-column">
              <table className="table mt-1 table-details-vertical">
                <thead>
                  <tr className="text-center">
                    <th scope="col">Id Venda:</th>
                    <th scope="col">Id Aluno:</th>
                    <th scope="col">Id Cliente:</th>
                    <th scope="col">Id Curso:</th>
                    <th scope="col">Id Fornecedor:</th>
                    <th scope="col">Id Item Venda:</th>
                    <th scope="col">Data da Venda:</th>
                    <th scope="col">Fornecedor:</th>
                    <th scope="col">Forma de Pagamento:</th>
                    <th scope="col">Nº de Parcelas:</th>
                    <th scope="col">% Split:</th>
                    <th scope="col">Valor Total:</th>
                    <th scope="col">Valor Venda:</th>
                    <th scope="col">Status:</th>
                    <th scope="col">Cliente:</th>
                    <th scope="col">Aluno:</th>
                    <th scope="col">RG:</th>
                    <th scope="col">Matrícula:</th>
                    <th scope="col">Curso:</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((item) => {
                    const data = new Date(item.dtVenda);
                    const dataFormatada = format(data, "dd/MM/yyyy - hh:mm:ss");
                    let st = "";
                    let classeSt = "";
                    if (item.status === "A") {
                      st = "Aguardando";
                      classeSt = "text-bg-warning";
                    } else if (item.status === "P") {
                      st = "Pago";
                      classeSt = "text-bg-success";
                    } else if (item.status === "E") {
                      st = "Estornado";
                      classeSt = "text-bg-secondary";
                    } else if (item.status === "N") {
                      st = "Negado";
                      classeSt = "text-bg-danger";
                    } else if (item.status === "C") {
                      st = "Cancelado";
                      classeSt = "text-bg-danger";
                    }

                    return (
                      <tr className="text-center" key={idVenda}>
                        <td data-label="Id Venda:">{item.idVenda}</td>
                        <td data-label="Id Aluno:">{item.idAluno}</td>
                        <td data-label="Id Cliente:">{item.idCliente}</td>
                        <td data-label="Id Curso:">{item.idCurso}</td>
                        <td data-label="Id Fornecedor:">{item.idFornecedor}</td>
                        <td data-label="Id Item Venda:">{item.idItemVenda}</td>
                        <td data-label="Data da Venda:">{dataFormatada}</td>
                        <td data-label="Fornecedor:">
                          {item.nomeFornecedor ? item.nomeFornecedor : "-"}
                        </td>
                        <td data-label="Forma de Pagamento:">
                          {item.formaPgto === "CARTAO_CREDITO"
                            ? "CARTÃO DE CRÉDITO"
                            : item.formaPgto}
                        </td>
                        <td data-label="Nº de Parcelas:">{item.numParcelas}</td>
                        <td data-label="% Split:">{item.valorSplit}%</td>
                        <td data-label="Valor Total:">
                          R${item.valorTotal.toFixed(2).replace(".", ",")}
                        </td>
                        <td data-label="Valor Venda:">
                          R${item.valorVenda.toFixed(2).replace(".", ",")}
                        </td>
                        <td data-label="Status:"><span className={`badge ${classeSt}`}>{st}</span></td>
                        <td data-label="Cliente:">{item.nomeCliente}</td>
                        <td data-label="Aluno:">
                          {item.nomeAluno ? item.nomeAluno : "-"}
                        </td>
                        <td data-label="RG:">{item.rg ? item.rg : "-"}</td>
                        <td data-label="Matrícula:">{item.matricula}</td>
                        <td data-label="Curso:">{item.nomeCurso}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
