/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useId, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api_financeiro } from "../../../../../services/pagBank";

export default function DetalhesMatricula({ id }) {
  const [details, setDetails] = useState([]);
  const btnClose = useRef(null);
  const idVenda = useId();

  useEffect(() => {
    const fetchDetalhes = async () => {
      try {
        if (id) {
          const response = await axios.get(
            api_financeiro + `/venda/matriculas/cliente?idCliente=${id}`
          );
          const data = response.data;

          if (data.sucesso) {
            console.log(data);
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

  const formatarCPF = (cpf) => {
    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(
      6,
      9
    )}-${cpf.substring(9, 11)}`;
  };

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
              <h5 className="m-0 fw-normal">Detalhes da matrícula:</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={btnClose}
              ></button>
            </div>
            <div className="modal-body btns-termos px-3 py-4 d-flex flex-column">
              <table className="table mt-1 table-details-vertical">
                <thead>
                  <tr className="text-center">
                    <th scope="col">Id Venda:</th>
                    <th scope="col">Data da Venda:</th>
                    <th scope="col">Id Cliente:</th>
                    <th scope="col">Cliente:</th>
                    <th scope="col">Email:</th>
                    <th scope="col">CPF:</th>
                    <th scope="col">Código Aluno:</th>
                    <th scope="col">Id Curso:</th>
                    <th scope="col">Curso:</th>
                    <th scope="col">Matrícula:</th>
                    <th scope="col">RG:</th>
                    <th scope="col">Aluno:</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((item) => {
                    let cpfFormat = formatarCPF(item.cpf);

                    return (
                      <tr className="text-center" key={idVenda}>
                        <td data-label="Id Venda:">{item.idVenda}</td>
                        <td data-label="Data da Venda:">{item.dtVenda}</td>
                        <td data-label="Id Cliente:">{item.idCliente}</td>
                        <td data-label="Cliente:">{item.nomeCliente}</td>
                        <td data-label="Email:">{item.email}</td>
                        <td data-label="CPF:">{cpfFormat}</td>
                        <td data-label="Código Aluno:">
                          {item.codigoEmWeb ? item.codigoEmWeb : "-"}
                        </td>
                        <td data-label="Id Curso:">{item.idCurso}</td>
                        <td data-label="Curso:">{item.nomeCurso}</td>
                        <td data-label="Matrícula:">
                          {item.matricula ? item.matricula : "-"}
                        </td>
                        <td data-label="RG:">{item.rg ? item.rg : "-"}</td>
                        <td data-label="Aluno(a):">{item.nome}</td>
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
