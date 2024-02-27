import { useEffect, useState } from "react";
import axios from "axios";
import { url_base } from "../../../../services/apis";
import Title from "../../../../components/admin/Title";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { MdDoDisturbAlt, MdOutlineCheck, MdOutlineEdit } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { FiPlus, FiUsers } from "react-icons/fi";

export default function ListarColaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    async function getColaboradores() {
      await axios
        .get(url_base + "colaboradores")
        .then((response) => {
          const data = response.data.content;
          setColaboradores(data);
        })
        .catch(() => {
          toast.error("Erro ao listar colaboradores.");
        });
    }

    getColaboradores();
  }, []);

  const offset = currentPage * itemsPerPage;
  const currentItems = colaboradores.slice(offset, offset + itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  async function handleDeletar(idColaborador) {
    const colaboradorAtualizado = await colaboradores.map((colaborador) => {
      if (colaborador.idColaborador === idColaborador) {
        if (colaborador.ativo === "S") {
          axios
            .put(url_base + `colaboradores/${idColaborador}/desativar`, {
              ativo: "N",
            })
            .then(() => {
              toast.success("Desativado com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao desativar colaborador:", error);
              toast.error("Erro ao desativar colaborador.");
            });
          const novoStatus = "N";
          return { ...colaborador, ativo: novoStatus };
        } else {
          axios
            .put(url_base + `colaboradores/${idColaborador}/ativar`, {
              ativo: "S",
            })
            .then(() => {
              toast.success("Ativado com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao ativar colaborador:", error);
              toast.error("Erro ao ativar colaborador.");
            });
          const novoStatus = "S";
          return { ...colaborador, ativo: novoStatus };
        }
      }
      return colaborador;
    });

    setColaboradores(colaboradorAtualizado);
  }

  return (
    <>
      <Title name="Colaboradores">
        <FiUsers size={28} />
      </Title>
      <div id="area-table" className="card card-table">
        {currentItems.length === 0 ? (
          <div className="sem-fornecedor">
            <span>Nenhum colaborador encontrado...</span>
            <Link
              to="novo-colaborador"
              id="btn-novo-fornecedor"
              className="btn btn-primary btn-lg px-2 py-1 mt-4"
            >
              <FiPlus size={24} />
              Novo colaborador
            </Link>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-end">
              <Link
                to="novo-colaborador"
                id="btn-novo-colaborador"
                className="btn btn-primary btn-lg px-2 py-1 mt-4 d-flex align-items-center gap-1"
              >
                <FiPlus size={24} />
                Novo colaborador
              </Link>
            </div>
            <table className="table table-striped table-bordered caption-top mx-auto ">
              <caption>Colaboradores cadastrados</caption>
              <thead>
                <tr>
                  <th scope="col" width="10%">
                    Ativo
                  </th>
                  <th scope="col">Nome</th>
                  <th scope="col" width="20%">
                    CPF
                  </th>
                  <th scope="col" width="20%">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentItems.map((item) => {
                  const status = item.ativo;

                  return (
                    <tr key={item.idColaborador}>
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
                      <td>{item.nome}</td>
                      <td>{item.cpf}</td>
                      <td>
                        <Link
                          to={`editar-colaborador/${item.idColaborador}`}
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
                          onChange={() => handleDeletar(item.idColaborador)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        <div className="d-flex justify-content-center">
          {colaboradores.length > itemsPerPage && (
            <ReactPaginate
              previousLabel={<FaChevronLeft />}
              nextLabel={<FaChevronRight />}
              pageCount={Math.ceil(colaboradores.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={0}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
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
