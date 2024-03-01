import Title from "../../../components/admin/Title";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import {
  MdDoDisturbAlt,
  MdOutlineCheck,
  MdOutlineEdit,
  MdOutlineListAlt,
} from "react-icons/md";
import { url_base } from "../../../services/apis";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import IconModal from "../../../components/IconModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Areas() {
  const [areas, setAreas] = useState([]);
  const [nomeArea, setNomeArea] = useState("");
  const [cor, setCor] = useState("#098765");
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [dataCadastro, setDataCadastro] = useState("");
  const [usuarioCadastro, setUsuarioCadastro] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 8;

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("@gdv-login-admin"));
    setUsuarioCadastro(user.usuario);
    getAreas();
  }, []);

  const closeModal = () => setModalOpen(false);

  const handleIconSelect = (iconName) => {
    setSelectedIcon(iconName);
    closeModal();
  };

  const openModal = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  async function getAreas() {
    await axios
      .get(url_base + "categoria/listar")
      .then((data) => {
        setAreas(data.data);
      })
      .catch(() => {
        toast.error("Erro ao listar categorias.");
      });
  }

  const offset = currentPage * itemsPerPage;
  const currentItems = areas.slice(offset, offset + itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  async function desativarArea(id) {
    const areaAtualizada = await areas.map((area) => {
      if (area.id === id) {
        if (area.ativo === "S") {
          axios
            .post(url_base + `categoria/desativar?idCategoria=${id}`)
            .then(() => {
              toast.success("Desativado com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao desativar categoria:", error);
              toast.error("Erro ao desativar categoria.");
            });
          const novoStatus = "N";
          return { ...area, ativo: novoStatus };
        } else {
          axios
            .post(url_base + `categoria/ativar?idCategoria=${id}`)
            .then(() => {
              toast.success("Ativado com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao ativar categoria:", error);
              toast.error("Erro ao ativar categoria.");
            });
          const novoStatus = "S";
          return { ...area, ativo: novoStatus };
        }
      }
      return area;
    });

    setAreas(areaAtualizada);
  }

  async function criarArea() {
    const dadosArea = {
      usuarioCadastro: usuarioCadastro,
      ativo: "S",
      descricao: nomeArea,
      icone: selectedIcon,
      cor: cor,
    };

    setLoading(true);

    await axios
      .post(url_base + "categoria/incluir", dadosArea)
      .then(() => {
        getAreas();
        setLoading(false);
        toast.success("Cadastrado com sucesso!");
        document.querySelector(".btn-close").click();
        limpaInputs()
      })
      .catch((e) => {
        const erro = e.response.data.error
        console.log(erro);
        setLoading(false);
        toast.error(erro);
        document.querySelector(".btn-close").click();
        limpaInputs()
      });
  }

  async function buscarArea(nome, id, data, userCadastro, ativo, icon, cor) {
    setNomeArea("");
    setDataCadastro("");
    setId("");
    setUsuarioCadastro("");
    setStatus("");
    setSelectedIcon("");
    setCor("");
    await axios
      .get(url_base + `categoria/obter?idCategoria=${id}`)
      .then(() => {
        setNomeArea(nome);
        setDataCadastro(data);
        setId(id);
        setUsuarioCadastro(userCadastro);
        setStatus(ativo);
        setSelectedIcon(icon);
        setCor(cor);
      })
      .catch((e) => {
        const erro = e.response.data.error
        console.log(erro);
        toast.error("Erro ao buscar categoria.");
      });
  }

  async function editarArea() {
    setLoading(true);
    const dadosArea = {
      id: id,
      dataCadastro: dataCadastro,
      usuarioCadastro: usuarioCadastro,
      ativo: status,
      descricao: nomeArea,
      icone: selectedIcon,
      cor: cor,
    };
    await axios
      .post(url_base + "categoria/alterar", dadosArea)
      .then(() => {
        const areaAtualizada = areas.map((area) =>
          area.id === id ? { ...area, descricao: nomeArea } : area
        );
        setLoading(false);

        setAreas(areaAtualizada);

        toast.success("Editado com sucesso!");
        document.querySelector(".close2").click();
        limpaInputs()
      })
      .catch((e) => {
        const erro = e.response.data.error
        console.log(erro);
        setLoading(false);
        toast.error(erro);
        document.querySelector(".close2").click();
        limpaInputs()
      });
  }

  function limpaInputs() {
    setNomeArea("");
    setSelectedIcon(null);
    setCor("#098765");
  }

  return (
    <>
      <Title name="Categorias">
        <MdOutlineListAlt size={28} />
      </Title>
      <div className="card card-table px-5 py-3">
        {currentItems.length === 0 ? (
          <div className="sem-fornecedor">
            <span>Nenhuma categoria encontrada...</span>
            <button
              type="button"
              className="btn btn-primary btn-lg px-4 py-1 mt-4"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={limpaInputs}
            >
              <FiPlus size={24} />
              Nova categoria
            </button>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-primary btn-lg px-3 py-1 mt-4 d-flex align-items-center gap-1"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={limpaInputs}
              >
                <FiPlus size={24} />
                Nova categoria
              </button>
            </div>
            <table className="table table-striped table-bordered mb-0 caption-top mx-auto">
              <caption>Categorias cadastradas</caption>
              <thead>
                <tr>
                  <th scope="col" width="20%">
                    Ativo
                  </th>
                  <th scope="col">Categoria</th>
                  <th scope="col" width="30%">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentItems.map((item) => {
                  const status = item.ativo;

                  return (
                    <tr key={item.id}>
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
                      <td>{item.descricao}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-warning btn-sm"
                          style={{
                            width: "63px",
                            height: "31px",
                            padding: "2px",
                          }}
                          data-bs-toggle="modal"
                          data-bs-target="#modalEditarArea"
                          onClick={() =>
                            buscarArea(
                              item.descricao,
                              item.id,
                              item.dataCadastro,
                              item.usuarioCadastro,
                              item.ativo,
                              item.icone,
                              item.cor
                            )
                          }
                        >
                          <MdOutlineEdit size={25} color="#121212" />
                        </button>{" "}
                        <BootstrapSwitchButton
                          checked={status === "S"}
                          offstyle="danger"
                          size="sm"
                          width={63}
                          onChange={() => desativarArea(item.id)}
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
          {areas.length > itemsPerPage && (
            <ReactPaginate
              previousLabel={<FaChevronLeft />}
              nextLabel={<FaChevronRight />}
              pageCount={Math.ceil(areas.length / itemsPerPage)}
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
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Nova categoria
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-name"
                    autoComplete="off"
                    value={nomeArea}
                    onChange={(e) => setNomeArea(e.target.value)}
                  />
                </div>
                <div className="mb-3 d-flex flex-column">
                  <label htmlFor="icone" className="col-form-label">
                    Ícone{" "}
                    <span className="form-text text-danger">
                      - Selecione um ícone abaixo
                    </span>
                  </label>
                  <label htmlFor="icone" className="col-form-label d-flex">
                    {selectedIcon && (
                      <div className="col-2 ms-3 d-flex align-items-center">
                        <FontAwesomeIcon icon={selectedIcon} className="icon" />
                      </div>
                    )}
                    <button className="btn btn-primary" onClick={openModal}>
                      {selectedIcon ? "Mudar ícone " : "Exibir ícones"}
                    </button>
                  </label>
                  <div>
                    {isModalOpen && (
                      <IconModal
                        onSelect={handleIconSelect}
                        onClose={closeModal}
                      />
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Cor do card{" "}
                    <span className="form-text text-danger">
                      - Selecione uma cor abaixo
                    </span>
                  </label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    id="cor"
                    value={cor}
                    onChange={(e) => setCor(e.target.value)}
                    title="Selecione uma cor."
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={limpaInputs}
              >
                Cancelar
              </button>
              {loading ? (
                <button
                  className="btn btn-primary btn-register"
                  type="button"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden" role="status">
                    Loading...
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={criarArea}
                >
                  Salvar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="modalEditarArea"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Editar categoria
              </h1>
              <button
                type="button"
                className="btn-close close2"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-name"
                    value={nomeArea}
                    autoComplete="off"
                    onChange={(e) => setNomeArea(e.target.value)}
                  />
                </div>
                <div className="mb-3 d-flex flex-column">
                  <label htmlFor="icone" className="col-form-label">
                    Ícone{" "}
                    <span className="form-text text-danger">
                      - Selecione um ícone abaixo
                    </span>
                  </label>
                  <label htmlFor="icone" className="col-form-label d-flex">
                    {selectedIcon && (
                      <div className="col-2 ms-3 d-flex align-items-center">
                        <FontAwesomeIcon icon={selectedIcon} className="icon" />
                      </div>
                    )}
                    <button className="btn btn-primary" onClick={openModal}>
                      {selectedIcon ? "Mudar ícone " : "Exibir ícones"}
                    </button>
                  </label>
                  <div>
                    {isModalOpen && (
                      <IconModal
                        onSelect={handleIconSelect}
                        onClose={closeModal}
                      />
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Cor do card{" "}
                    <span className="form-text text-danger">
                      - Selecione uma cor abaixo
                    </span>
                  </label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    id="cor"
                    value={cor}
                    onChange={(e) => setCor(e.target.value)}
                    title="Selecione uma cor."
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={limpaInputs}
              >
                Cancelar
              </button>
              {loading ? (
                <button
                  className="btn btn-primary btn-register"
                  type="button"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden" role="status">
                    Loading...
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={editarArea}
                >
                  Salvar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
