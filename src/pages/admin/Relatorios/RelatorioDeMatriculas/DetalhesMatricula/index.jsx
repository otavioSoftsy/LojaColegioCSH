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
              <h5 className="m-0 fw-normal">Detalhes da matrícula</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={btnClose}
              ></button>
            </div>
            <div className="modal-body btns-termos table-responsive px-3 py-4 d-flex flex-column">
              <table className="table table-sm mt-1 table-bordered" style={{ whiteSpace: "nowrap" }}>
                <thead>
                  <tr>
                    <th scope="col">Id Venda</th>
                    <th scope="col">Data da Venda</th>
                    <th scope="col">Id Cliente</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Email</th>
                    <th scope="col">CPF</th>
                    <th scope="col">Código Aluno</th>
                    <th scope="col">Id Curso</th>
                    <th scope="col">Curso</th>
                    <th scope="col">Matrícula</th>
                    <th scope="col">RG</th>
                    <th scope="col">Aluno</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((item) => {
                    let cpfFormat = formatarCPF(item.cpf);

                    return (
                      <tr key={idVenda}>
                        <td>{item.idVenda}</td>
                        <td>{item.dtVenda}</td>
                        <td>{item.idCliente}</td>
                        <td>{item.nomeCliente}</td>
                        <td>{item.email}</td>
                        <td>{cpfFormat}</td>
                        <td className="text-center">{item.codigoEmWeb ? item.codigoEmWeb : "-"}</td>
                        <td>{item.idCurso}</td>
                        <td>{item.nomeCurso}</td>
                        <td className="text-center">{item.matricula ? item.matricula : "-"}</td>
                        <td className="text-center">{item.rg ? item.rg : "-"}</td>
                        <td>{item.nome}</td>
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
