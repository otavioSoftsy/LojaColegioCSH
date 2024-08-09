import { Link } from "react-router-dom";
import Title from "../../../../components/admin/Title";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { MdDoDisturbAlt, MdOutlineCheck, MdOutlineEdit } from "react-icons/md";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { url_base } from "../../../../services/apis";
import { RiGraduationCapLine } from "react-icons/ri";
import { FiPlus, FiSearch } from "react-icons/fi";
import "./cursos.css";

export default function ListarCursos() {
  const [cursos, setCursos] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 7;
  const [busca, setBusca] = useState("");
  const [pageCount, setPageCount] = useState(0);

  async function getCursos() {
    setBusca("");
    await axios
      .get(
        url_base +
          `curso/listar?page=${itemOffset}&size=${itemsPerPage}&sort=nomeCurso,asc`
      )
      .then((response) => {
        const responseData = response.data;

        if (responseData && responseData.content) {
          const data = responseData.content.reverse()
          setCursos(data);
          const pageCount = Math.ceil(
            responseData.totalElements / itemsPerPage
          );
          setPageCount(pageCount);
        }
      })
      .catch((error) => {
        toast.error("Erro ao listar atividades.");
        console.log(error);
      });
  }

  useEffect(() => {
    getCursos();
  }, [itemOffset]);

  const handlePageClick = (event) => {
    const newOffset = event.selected;
    setItemOffset(newOffset);
  };

  function handleDeletar(idCurso) {
    const cursoAtualizado = cursos.map((curso) => {
      if (curso.idCurso === idCurso) {
        if (curso.ativo === "S") {
          axios
            .post(url_base + `curso/desativar?idCurso=${idCurso}`)
            .then(() => {
              toast.success("Desativado com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao deletar atividade:", error);
              toast.error("Erro ao deletar atividade.");
            });
          const novoStatus = "N";
          return { ...curso, ativo: novoStatus };
        } else {
          axios
            .post(url_base + `curso/ativar?idCurso=${idCurso}`)
            .then(() => {
              toast.success("Ativado com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao ativar atividade:", error);
              toast.error("Erro ao ativar atividade.");
            });
          const novoStatus = "S";
          return { ...curso, ativo: novoStatus };
        }
      }
      return curso;
    });

    setCursos(cursoAtualizado);
  }

  async function buscarCursos() {
    await axios
      .get(url_base + `curso/listarTodos?busca=${busca}`)
      .then((response) => {
        const responseData = response.data;

        if (responseData && responseData.content) {
          setCursos(responseData.content);
          const pageCount = Math.ceil(
            responseData.totalElements / itemsPerPage
          );
          setPageCount(pageCount);
        }
      })
      .catch((error) => {
        toast.error("Erro ao buscar atividades.");
        console.log(error);
      });
  }

  function handleToggleEsgotado(idCurso) {
    const cursoAtualizado = cursos.map((curso) => {
      if (curso.idCurso === idCurso) {
        if (curso.esgotado) {
          axios
            .post(url_base + `curso/${idCurso}/ofertar`)
            .then(() => {
              toast.success("Ofertado com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao ofertar atividade:", error);
              toast.error("Erro ao ofertar atividade.");
            });
          const novoStatus = false;
          return { ...curso, esgotado: novoStatus };
        } else {
          axios
            .post(url_base + `curso/${idCurso}/esgotar`)
            .then(() => {
              toast.success("Esgotado com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao esgotar atividade:", error);
              toast.error("Erro ao esgotar atividade.");
            });
          const novoStatus = true;
          return { ...curso, esgotado: novoStatus };
        }
      }
      return curso;
    });

    setCursos(cursoAtualizado);
  }

  return (
    <>
      <Title name="Atividades">
        <RiGraduationCapLine size={28} />
      </Title>
      <div className="card card-table px-5">
        {cursos.length === 0 ? (
          <div className="sem-fornecedor">
            <span>Nenhuma atividade encontrada...</span>
            <Link
              to="nova-atividade"
              id="btn-novo-fornecedor"
              className="btn btn-primary btn-lg px-3 py-1 mt-4"
            >
              <FiPlus size={24} />
              Nova atividade
            </Link>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between mb-2">
              <div className="col-6 d-flex gap-2">
                <div className="input-group mt-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pesquisar atividades..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={buscarCursos}
                  >
                    <FiSearch size={20} />
                  </button>
                </div>
                <button
                  onClick={getCursos}
                  className="btn btn-secondary btn-sm mt-4"
                >
                  Limpar
                </button>
              </div>
              <Link
                to="nova-atividade"
                className="btn btn-primary btn-lg px-3 py-1 mt-4 d-flex align-items-center gap-1"
              >
                <FiPlus size={24} />
                Nova atividade
              </Link>
            </div>
            <table className="table table-striped table-bordered mb-0 caption-top mx-auto">
              <caption>Atividades cadastradas</caption>
              <thead>
                <tr>
                  <th scope="col" width="10%">
                    Ativo
                  </th>
                  <th scope="col">Nome</th>
                  <th scope="col" width="12%">
                    Valor
                  </th>
                  <th scope="col" id="col-acoes">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {cursos.map((item) => {
                  const status = item.ativo;

                  return (
                    <tr key={item.idCurso}>
                      <td>
                        <button
                          type="button"
                          className={`btn btn-${
                            status === "S" ? "success" : "danger"
                          } btn-sm`}
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
                      <td>{item.nomeCurso}</td>
                      {item.valorVenda ? (
                        <td>
                          R$ {item.valorVenda.toFixed(2).replace(".", ",")}
                        </td>
                      ) : (
                        <td>Grátis</td>
                      )}
                      <td>
                        <Link
                          to={`editar-atividade/${item.idCurso}`}
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
                          onChange={() => handleDeletar(item.idCurso)}
                        />{" "}
                        <button
                          type="button"
                          className={`btn ${
                            item.esgotado ? "btn-success" : "btn-danger"
                          } btn-sm px-2`}
                          style={{
                            height: "31px",
                            width: "84px",
                          }}
                          onClick={() => handleToggleEsgotado(item.idCurso)}
                        >
                          {item.esgotado ? "Ofertar" : "Esgotado"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        <div className="d-flex justify-content-center">
          <ReactPaginate
            previousLabel={<FaChevronLeft />}
            nextLabel={<FaChevronRight />}
            pageCount={pageCount}
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
        </div>
      </div>
    </>
  );
}
