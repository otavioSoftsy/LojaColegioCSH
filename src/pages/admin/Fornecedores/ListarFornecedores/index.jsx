import { Link } from "react-router-dom";
import {
  MdDoDisturbAlt,
  MdOutlineCheck,
  MdOutlineEdit,
  MdOutlineHandshake,
} from "react-icons/md";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import Title from "../../../../components/admin/Title";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import "./fornecedores.css";
import { url_base } from "../../../../services/apis";
import { FiPlus } from "react-icons/fi";

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  useEffect(() => {
    async function getFornecedores() {
      await axios
        .get(url_base + "fornecedor/listar")
        .then((data) => {
          setFornecedores(data.data);
          console.log(data.data);
        })
        .catch(() => {
          toast.error("Erro ao listar fornecedores.");
        });
    }

    getFornecedores();
  }, []);

  const offset = currentPage * itemsPerPage;
  const currentItems = fornecedores.slice(offset, offset + itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  async function handleDeletar(idFornecedor) {
    const fornecedorAtualizado = await fornecedores.map((fornecedor) => {
      if (fornecedor.idFornecedor === idFornecedor) {
        if (fornecedor.ativo === "S") {
          axios
            .post(
              url_base + `fornecedor/desativar?idFornecedor=${idFornecedor}`
            )
            .then(() => {
              toast.success("Desativado com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao desativar parceiro:", error);
              toast.error("Erro ao desativar parceiro.");
            });
          const novoStatus = "N";
          return { ...fornecedor, ativo: novoStatus };
        } else {
          axios
            .post(url_base + `fornecedor/ativar?idFornecedor=${idFornecedor}`)
            .then(() => {
              toast.success("Ativado com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao ativar parceiro.", error);
              toast.error("Erro ao ativar parceiro.");
            });
          const novoStatus = "S";
          return { ...fornecedor, ativo: novoStatus };
        }
      }
      return fornecedor;
    });

    setFornecedores(fornecedorAtualizado);
  }

  const formatarCPF = (cpf) => {
    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(
      6,
      9
    )}-${cpf.substring(9, 11)}`;
  };

  const formatarCNPJ = (cnpj) => {
    return `${cnpj.substring(0, 2)}.${cnpj.substring(2, 5)}.${cnpj.substring(
      5,
      8
    )}/${cnpj.substring(8, 12)}-${cnpj.substring(12, 14)}`;
  };

  return (
    <>
      <div>
        <Title name="Lista de Parceiros">
          <MdOutlineHandshake size={28} />
        </Title>
        <div id="area-table" className="card card-table">
          {currentItems.length === 0 ? (
            <div className="sem-fornecedor">
              <span>Nenhum parceiro encontrado...</span>
              <Link
                to="cadastro"
                id="btn-novo-fornecedor"
                className="btn btn-primary btn-lg px-3 py-1 mt-4"
              >
                <FiPlus size={24} />
                Novo parceiro
              </Link>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-end">
                <Link
                  to="cadastro"
                  id="btn-novo-fornecedor"
                  className="btn btn-primary btn-lg px-3 py-1 mt-4"
                >
                  <FiPlus size={24} />
                  Novo parceiro
                </Link>
              </div>
              <table className="table table-striped table-bordered caption-top mx-auto ">
                <caption>Parceiros cadastrados</caption>
                <thead>
                  <tr>
                    <th scope="col" width="10%">
                      Ativo
                    </th>
                    <th scope="col">Nome</th>
                    <th scope="col" width="20%">
                      CNPJ / CPF
                    </th>
                    <th scope="col" width="20%">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {currentItems.map((item) => {
                    const status = item.ativo;
                    const cnpjCpf = item.cnpj
                      ? formatarCNPJ(item.cnpj)
                      : formatarCPF(item.cpfResponsavel);

                    return (
                      <tr key={item.idFornecedor}>
                        <td>
                          <button
                            type="button"
                            className={`btn btn-${
                              status === "S" ? "success" : "danger"
                            } btn-sm btn-status`}
                            style={{
                              width: "63px",
                              height: "31px",
                              padding: "2px",
                            }}
                            disabled
                          >
                            {status === "S" ? (
                              <MdOutlineCheck size={25} color="#fff" />
                            ) : (
                              <MdDoDisturbAlt size={25} color="#121212" />
                            )}
                          </button>
                        </td>
                        <td>{item.nomeResponsavel}</td>
                        <td>{cnpjCpf}</td>
                        <td>
                          <Link
                            to={`editar/${item.idFornecedor}`}
                            className="btn btn-warning btn-sm"
                            style={{
                              width: "63px",
                              height: "31px",
                              padding: "2px",
                            }}
                          >
                            <MdOutlineEdit size={25} color="#121212" />
                          </Link>{" "}
                          <BootstrapSwitchButton
                            checked={status === "S"}
                            offstyle="danger"
                            size="sm"
                            width={63}
                            onChange={() => handleDeletar(item.idFornecedor)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}

          {fornecedores.length > itemsPerPage && (
            <ReactPaginate
              previousLabel={<span aria-hidden="true">&laquo;</span>}
              nextLabel={<span aria-hidden="true">&raquo;</span>}
              pageCount={Math.ceil(fornecedores.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={0}
              onPageChange={handlePageClick}
              containerClassName={
                "pagination pagination-sm justify-content-end"
              }
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              renderOnZeroPageCount={null}
            />
          )}
        </div>
      </div>
    </>
  );
}
