/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useRef } from "react";
import { format } from "date-fns";

export default function DetalhesCliente({
  cliente,
  formatarCelular,
  formatarCPF,
  formatarData
}) {
  const btnClose = useRef(null);



  function formatarCEP(cep) {
    if (!cep) return "";
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  function formatarGenero(genero) {
    if (genero === "M") return "Masculino";
    if (genero === "F") return "Feminino";
    if (genero === "N") return "Não informado";
    return genero;
  }

  return (
    <>
      <div
        className="modal fade"
        id="modalDetalhes"
        tabIndex="-1"
        aria-labelledby="modalDetalhes"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-dialog-centered modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="m-0 fw-normal">Detalhes do cliente</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={btnClose}
              ></button>
            </div>
            <div className="modal-body btns-termos table-responsive px-3 py-3 d-flex flex-column">
              <table
                className="table table-sm mt-1 table-bordered"
                style={{ whiteSpace: "nowrap" }}
              >
                <thead>
                  <tr>
                    <th scope="col">Id cliente</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Email</th>
                    <th scope="col">Data de nascimento</th>
                    <th scope="col">Gênero</th>
                    <th scope="col">CPF</th>
                    <th scope="col">Celular</th>
                    <th scope="col">CEP</th>
                    <th scope="col">Uf</th>
                    <th scope="col">Município</th>
                    <th scope="col">Bairro</th>
                    <th scope="col">Endereço</th>
                    <th scope="col">Número</th>
                    <th scope="col">Complemento</th>
                    <th scope="col">Ativo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={cliente.idCliente} className="text-center">
                    <td>{cliente.idCliente}</td>
                    <td>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                    <td>{formatarData(cliente.dataNascimento)}</td>
                    <td>{formatarGenero(cliente.genero)}</td>
                    <td>{formatarCPF(cliente.cpf)}</td>
                    <td>{formatarCelular(cliente.celular)}</td>
                    <td>{formatarCEP(cliente.cep)}</td>
                    <td>{cliente.uf}</td>
                    <td>{cliente.municipio}</td>
                    <td>{cliente.bairro}</td>
                    <td>{cliente.endereco}</td>
                    <td>{cliente.numero}</td>
                    <td>{cliente.complemento}</td>
                    <td>{cliente.ativo}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
