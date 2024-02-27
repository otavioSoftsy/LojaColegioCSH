import { Link } from "react-router-dom";
import { MdDoDisturbAlt, MdOutlineCheck, MdOutlineEdit } from "react-icons/md";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import Title from "../../../../components/admin/Title";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { url_base } from "../../../../services/apis";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { RiSchoolLine } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";

export default function ListarInstituicoes() {
  const [instituicoes, setInstituicoes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    async function getInstituicoes() {
      await axios
        .get(url_base + "instituicoes")
        .then((response) => {
          const data = response.data.content;
          setInstituicoes(data);
        })
        .catch(() => {
          toast.error("Erro ao listar instituicoes.");
        });
    }

    getInstituicoes();
  }, []);

  const offset = currentPage * itemsPerPage;
  const currentItems = instituicoes.slice(offset, offset + itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  async function handleDeletar(idInstituicao) {
    const instituicaoAtualizado = await instituicoes.map((instituicao) => {
      if (instituicao.idInstituicao === idInstituicao) {
        if (instituicao.ativo === "S") {
          axios
            .put(url_base + `instituicoes/${idInstituicao}/desativar`, {
              ativo: "N",
            })
            .then(() => {
              toast.success("Desativado com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao desativar instituicao:", error);
              toast.error("Erro ao desativar instituicao.");
            });
          const novoStatus = "N";
          return { ...instituicao, ativo: novoStatus };
        } else {
          axios
            .put(url_base + `instituicoes/${idInstituicao}/ativar`, {
              ativo: "S",
            })
            .then(() => {
              toast.success("Ativado com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao ativar instituicao:", error);
              toast.error("Erro ao ativar instituicao.");
            });
          const novoStatus = "S";
          return { ...instituicao, ativo: novoStatus };
        }
      }
      return instituicao;
    });

    setInstituicoes(instituicaoAtualizado);
  }

  return (
    <>
      <Title name="Instituições">
        <RiSchoolLine size={28} />
      </Title>
      <div id="area-table" className="card card-table">
        {currentItems.length === 0 ? (
          <div className="sem-fornecedor">
            <span>Nenhuma instituição encontrada...</span>
            <Link
              to="nova-instituicao"
              id="btn-novo-fornecedor"
              className="btn btn-primary btn-lg px-2 py-1 mt-4"
            >
              <FiPlus size={24} />
              Nova instituição
            </Link>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-end">
              <Link
                to="nova-instituicao"
                id="btn-novo-instituicao"
                className="btn btn-primary btn-lg px-2 py-1 mt-4 d-flex align-items-center gap-1"
              >
                <FiPlus size={24} />
                Nova instituição
              </Link>
            </div>
            <table className="table table-striped table-bordered caption-top mx-auto ">
              <caption>Instituições cadastradas</caption>
              <thead>
                <tr>
                  <th scope="col" width="10%">
                    Ativo
                  </th>
                  <th scope="col">Nome Fantasia</th>
                  <th scope="col" width="20%">
                    CNPJ
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
                    <tr key={item.idInstituicao}>
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
                      <td>{item.nomeFantasia}</td>
                      <td>{item.cnpj}</td>
                      <td>
                        <Link
                          to={`editar-instituicao/${item.idInstituicao}`}
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
                          onChange={() => handleDeletar(item.idInstituicao)}
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
          {instituicoes.length > itemsPerPage && (
            <ReactPaginate
              previousLabel={<FaChevronLeft />}
              nextLabel={<FaChevronRight />}
              pageCount={Math.ceil(instituicoes.length / itemsPerPage)}
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
