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
              <h5 className="m-0 fw-normal">Detalhes da venda</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={btnClose}
              ></button>
            </div>
            <div className="modal-body table-responsive btns-termos px-3 py-3 d-flex flex-column">
            <table
                className="table table-sm mt-1 table-bordered"
                style={{ whiteSpace: "nowrap" }}
              >
                <thead>
                  <tr>
                    <th scope="col">Data da venda</th>                    
                    <th scope="col">Cliente</th>
                    <th scope="col">RG</th>
                    <th scope="col">Curso</th>
                    <th scope="col">Aluno</th>
                    <th scope="col">Matrícula</th>
                    <th scope="col">Fornecedor</th>
                    <th scope="col">Forma de pagamento</th>
                    <th scope="col">Nº de parcelas</th>
                    <th scope="col">% Split</th>
                    <th scope="col">Valor total</th>
                    <th scope="col">Valor venda</th>
                    <th scope="col">Status</th>
                    <th scope="col">Id venda</th>
                    <th scope="col">Id aluno</th>
                    <th scope="col">Id cliente</th>
                    <th scope="col">Id curso</th>
                    <th scope="col">Id fornecedor</th>
                    <th scope="col">Id item venda</th>
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
                      <tr key={idVenda}>
                        
                        <td>{dataFormatada}</td>
                        <td >{item.nomeCliente}</td>
                        <td className="text-center">{item.rg ? item.rg : "-"}</td>
                        <td >{item.nomeCurso}</td>
                        <td className="text-center">
                          {item.nomeAluno ? item.nomeAluno : "-"}
                        </td>
                        <td >{item.matricula}</td>
                        <td className="text-center">
                          {item.nomeFornecedor ? item.nomeFornecedor : "-"}
                        </td>
                        <td >
                          {item.formaPgto === "CARTAO_CREDITO"
                            ? "CARTÃO DE CRÉDITO"
                            : item.formaPgto}
                        </td>
                        <td >{item.numParcelas}</td>
                        <td >{item.valorSplit}%</td>
                        <td >
                          R${item.valorTotal.toFixed(2).replace(".", ",")}
                        </td>
                        <td >
                          R${item.valorVenda.toFixed(2).replace(".", ",")}
                        </td>
                        <td ><span className={`badge ${classeSt}`}>{st}</span></td>
                        <td >{item.idVenda}</td>
                        <td >{item.idAluno}</td>
                        <td >{item.idCliente}</td>
                        <td >{item.idCurso}</td>
                        <td >{item.idFornecedor}</td>
                        <td >{item.idItemVenda}</td>
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
