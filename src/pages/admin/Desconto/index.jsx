import Title from "../../../components/admin/Title";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { MdDoDisturbAlt, MdOutlineCheck, MdOutlineEdit } from "react-icons/md";
import { FiPercent } from "react-icons/fi";
import { url_base } from "../../../services/apis";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { NumericFormat } from "react-number-format";

export default function Desconto() {
  const [descontos, setDescontos] = useState([]);
  const [tipo, setTipo] = useState("V");
  const [quant, setQuant] = useState(null);
  const [valor, setValor] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [id, setId] = useState("");
  const [usuarioCadastro, setUsuarioCadastro] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [loading, setLoading] = useState(false);
  const [possuiLimite, setPossuiLimite] = useState(null);
  const [possuiValidade, setPossuiValidade] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  async function getDescontos() {
    await axios
      .get(url_base + "voucher")
      .then((data) => {
        setDescontos(data.data);
      })
      .catch(() => {
        toast.error("Erro ao listar cupons.");
      });
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("@gdv-login-admin"));
    setUsuarioCadastro(user.usuario);
    getDescontos();
  }, []);

  const offset = currentPage * itemsPerPage;
  const currentItems = descontos.slice(offset, offset + itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  async function ativaDesativa(id) {
    const descontoAtualizada = await descontos.map((desconto) => {
      if (desconto.id === id) {
        if (desconto.ativo) {
          axios
            .post(url_base + `voucher/${id}/desativar`)
            .then(() => {
              toast.success("Desativado com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao desativar cupom:", error);
              toast.error("Erro ao desativar cupom.");
            });
          const novoStatus = false;
          return { ...desconto, ativo: novoStatus };
        } else {
          axios
            .post(url_base + `voucher/${id}/ativar`)
            .then(() => {
              toast.success("Ativado com sucesso!");
            })
            .catch((error) => {
              console.error("Erro ao ativar cupom:", error);
              toast.error("Erro ao ativar cupom.");
            });
          const novoStatus = true;
          return { ...desconto, ativo: novoStatus };
        }
      }
      return desconto;
    });

    setDescontos(descontoAtualizada);
  }

  function formatarNumero(str) {
    let valorNumerico = str.replace(/[^\d,]/g, "");

    valorNumerico = valorNumerico.replace(",", ".");

    return valorNumerico;
  }

  async function newDesconto(e) {
    e.preventDefault();
    setLoading(true);

    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);
    const dataInicioSelecionada = dataInicio
      ? new Date(dataInicio)
      : new Date();

    dataInicioSelecionada.setHours(0, 0, 0, 0);

    if (dataInicioSelecionada < dataAtual) {
      toast.error("A data de ativação não pode ser menor que a data atual.");
      setLoading(false);
    }

    const dataFimSelecionada = dataFim ? new Date(dataFim) : new Date();
    dataFimSelecionada.setHours(0, 0, 0, 0);

    if (dataFimSelecionada < dataInicioSelecionada) {
      toast.error("A data de expiração deve ser maior que a data de ativação.");
      setLoading(false);
      return;
    }

    const objeto = {
      codigo,
      tipo,
      valor: parseFloat(formatarNumero(valor)),
      possuiPeriodoValidade: possuiValidade === "S" ? true : false,
      possuiLimiteUsos: possuiLimite === "S" ? true : false,
      validadeInicial: dataInicio,
      validadeFinal: dataFim,
      quantidade: quant,
    };

    console.log(objeto);

    await axios
      .post(url_base + "voucher", objeto)
      .then(() => {
        getDescontos();
        setLoading(false);
        toast.success("Cadastrado com sucesso!");
        document.querySelector(".btn-close").click();
        setCodigo("");
        setQuant("");
        setValor("");
        setDataInicio("");
        setDataFim("");
        setPossuiLimite("");
        setPossuiValidade("");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error(error.response.data.message);
        document.querySelector(".btn-close").click();
        setCodigo("");
        setQuant("");
        setValor("");
        setDataInicio("");
        setDataFim("");
        setPossuiLimite("");
        setPossuiValidade("");
      });
  }

  async function buscarItem(id) {
    setCodigo("");
    setId("");
    setUsuarioCadastro("");
    setQuant("");
    setValor("");
    setDataInicio("");
    setDataFim("");
    setPossuiLimite("");
    setPossuiValidade("");
    await axios
      .get(url_base + `voucher/${id}`)
      .then((response) => {
        const data = response.data;
        setCodigo(data.codigo);
        setId(data.id);
        setQuant(data.quantidade);
        setValor(data.valor);
        setTipo(data.tipo);
        setDataInicio(data.validadeInicial);
        setDataFim(data.validadeFinal);
        setPossuiLimite(data.possuiLimiteUsos ? "S" : "N");
        setPossuiValidade(data.possuiPeriodoValidade ? "S" : "N");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erro ao buscar dados.");
      });
  }

  async function editar(e) {
    e.preventDefault();
    setLoading(true);

    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);

    const dataInicioSelecionada = dataInicio
      ? new Date(dataInicio)
      : new Date();

      dataInicioSelecionada.setHours(0, 0, 0, 0);
    if (dataInicioSelecionada < dataAtual) {
      toast.error("A data de ativação não pode ser menor que a data atual.");
      setLoading(false);
      return;
    }

    const dataFimSelecionada = dataFim ? new Date(dataFim) : new Date();
    dataFimSelecionada.setHours(0, 0, 0, 0);

    if (dataFimSelecionada < dataInicioSelecionada) {
      toast.error("A data de expiração deve ser maior que a data de ativação.");
      setLoading(false);
      return;
    }

    const objeto = {
      codigo,
      tipo,
      valor: valor,
      possuiPeriodoValidade: possuiValidade === "S" ? true : false,
      possuiLimiteUsos: possuiLimite === "S" ? true : false,
      validadeInicial: dataInicio,
      validadeFinal: dataFim,
      quantidade: quant,
    };

    await axios
      .put(url_base + `voucher/${id}`, objeto)
      .then(() => {
        getDescontos();
        setLoading(false);
        document.querySelector(".close2").click();
        toast.success("Editado com sucesso!");
        limpaInput();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error("Erro ao editar.");
        document.querySelector(".close2").click();
        limpaInput();
      });
  }

  function limpaInput() {
    setCodigo("");
    setQuant("");
    setValor("");
    setDataInicio("");
    setDataFim("");
    setPossuiLimite("");
    setPossuiValidade("");
  }

  function handleLimite() {
    setQuant("");
  }
  function handleValidade() {
    setDataInicio("");
    setDataFim("");
  }
  function handleTipo() {
    setValor("");
  }

  return (
    <>
      <Title name="Lista de Descontos">
        <FiPercent size={28} />
      </Title>
      <div className="card card-table px-5 py-3">
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-primary btn-lg px-4 py-1 mt-4"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={limpaInput}
          >
            Novo cupom
          </button>
        </div>
        <table className="table table-striped table-bordered mb-0 caption-top mx-auto">
          <caption>Cupons de desconto cadastrados</caption>
          <thead>
            <tr>
              <th scope="col" width="10%">
                Ativo
              </th>
              <th scope="col" width="25%">
                Código
              </th>
              <th scope="col" width="25%">
                Tipo de desconto
              </th>
              <th scope="col">Valor</th>
              <th scope="col" width="25%">
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
                        status === true ? "success" : "danger"
                      } btn-sm`}
                      style={{
                        width: "63px",
                        height: "31px",
                        padding: "2px",
                      }}
                      disabled
                    >
                      {status === true ? (
                        <MdOutlineCheck size={25} color="#fff" />
                      ) : (
                        <MdDoDisturbAlt size={25} color="#121212" />
                      )}
                    </button>
                  </td>
                  <td>{item.codigo}</td>
                  <td>{item.tipo === "P" ? "Percentual" : "Valor"}</td>
                  <td>
                    {item.tipo === "P"
                      ? `${item.valor} %`
                      : `R$ ${item.valor.toFixed(2).replace(".", ",")}`}{" "}
                  </td>
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
                      onClick={() => buscarItem(item.id)}
                    >
                      <MdOutlineEdit size={25} color="#121212" />
                    </button>{" "}
                    <BootstrapSwitchButton
                      checked={status === true}
                      offstyle="danger"
                      size="sm"
                      width={63}
                      onChange={() => ativaDesativa(item.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="d-flex justify-content-center">
          {descontos.length > itemsPerPage && (
            <ReactPaginate
              previousLabel={<FaChevronLeft />}
              nextLabel={<FaChevronRight />}
              pageCount={Math.ceil(descontos.length / itemsPerPage)}
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
                Novo cupom
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body px-4">
              <form onSubmit={newDesconto} className="pb-3">
                <div className="mb-5">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Código do cupom
                    </label>
                    <input
                      type="text"
                      className="form-control inputForm"
                      id="recipient-name"
                      value={codigo}
                      autoComplete="off"
                      required
                      onChange={(e) => setCodigo(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="radioTipoDesconto"
                      className="col-form-label"
                    >
                      Tipo de desconto
                    </label>
                    <div
                      className="btn-group area-radio mb-3"
                      role="group"
                      aria-label="Basic radio toggle button group"
                    >
                      <input
                        type="radio"
                        required
                        className="btn-check"
                        name="radioTipoDesconto"
                        id="radioValor"
                        autoComplete="off"
                        value="V"
                        checked={tipo === "V"}
                        onChange={(e) => {
                          setTipo(e.target.value);
                          handleTipo();
                        }}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="radioValor"
                      >
                        Valor
                      </label>

                      <input
                        type="radio"
                        required
                        className="btn-check"
                        name="radioTipoDesconto"
                        id="radioPercentual"
                        autoComplete="off"
                        value="P"
                        checked={tipo === "P"}
                        onChange={(e) => setTipo(e.target.value)}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="radioPercentual"
                      >
                        Percentual
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="valor" className="col-form-label">
                      {tipo === "V" ? "Valor" : "Percentual"}
                    </label>
                    {tipo === "V" ? (
                      <NumericFormat
                        prefix={"R$ "}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                        fixedDecimalScale
                        decimalScale={2}
                        required
                        className="form-control inputForm"
                        id="valor"
                        autoComplete="off"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                      />
                    ) : (
                      <NumericFormat
                        decimalSeparator="."
                        allowNegative={false}
                        decimalScale={2}
                        required
                        id="split"
                        name="split"
                        className="form-control inputForm"
                        value={valor}
                        autoComplete="off"
                        onValueChange={(values) => {
                          if (values.value > 100) {
                            toast.warning(
                              "O desconto não pode ser maior que 100%",
                              {
                                position: "top-center",
                                style: { width: "400px" },
                              }
                            );
                            setValor("");
                          } else {
                            setValor(values.value);
                          }
                        }}
                        suffix=" %"
                      />
                    )}
                  </div>
                  <div>
                    <label htmlFor="areaValidade" className="col-form-label">
                      Tem período de validade?
                    </label>
                    <div
                      className="btn-group area-radio mb-3"
                      role="group"
                      aria-label="Basic radio toggle button group"
                    >
                      <input
                        type="radio"
                        required
                        className="btn-check"
                        name="possuiValidade"
                        id="possuiValidadeS"
                        autoComplete="off"
                        value="S"
                        checked={possuiValidade === "S"}
                        onChange={(e) => {
                          setPossuiValidade(e.target.value);
                          handleValidade();
                        }}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="possuiValidadeS"
                      >
                        Sim
                      </label>

                      <input
                        type="radio"
                        required
                        className="btn-check"
                        name="possuiValidade"
                        id="possuiValidadeN"
                        autoComplete="off"
                        value="N"
                        checked={possuiValidade === "N"}
                        onChange={(e) => {
                          setPossuiValidade(e.target.value);
                          handleValidade();
                        }}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="possuiValidadeN"
                      >
                        Não
                      </label>
                    </div>
                  </div>

                  {possuiValidade === "S" && (
                    <div className="row mb-3">
                      <div className="col-6">
                        <label htmlFor="dataInicio" className="col-form-label">
                          Data de Ativação
                        </label>
                        <input
                          type="datetime-local"
                          id="dataInicio"
                          name="dataInicio"
                          className="form-control inputForm"
                          value={dataInicio}
                          min={new Date()}
                          onChange={(e) => setDataInicio(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="dataFim" className="col-form-label">
                          Data de Expiração
                        </label>
                        <input
                          type="datetime-local"
                          id="dataFim"
                          name="dataFim"
                          className="form-control inputForm"
                          value={dataFim}
                          min={dataInicio}
                          onChange={(e) => setDataFim(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label htmlFor="possuiLimite" className="col-form-label">
                      Possui limite de usos?
                    </label>
                    <div
                      className="btn-group area-radio mb-3"
                      role="group"
                      aria-label="Basic radio toggle button group"
                    >
                      <input
                        type="radio"
                        required
                        className="btn-check"
                        name="possuiLimite"
                        id="possuiLimiteS"
                        autoComplete="off"
                        value="S"
                        checked={possuiLimite === "S"}
                        onChange={(e) => {
                          setPossuiLimite(e.target.value);
                          handleLimite();
                        }}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="possuiLimiteS"
                      >
                        Sim
                      </label>

                      <input
                        type="radio"
                        required
                        className="btn-check"
                        name="possuiLimite"
                        id="possuiLimiteN"
                        autoComplete="off"
                        value="N"
                        checked={possuiLimite === "N"}
                        onChange={(e) => {
                          setPossuiLimite(e.target.value);
                          handleLimite();
                        }}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="possuiLimiteN"
                      >
                        Não
                      </label>
                    </div>
                  </div>
                  {possuiLimite === "S" && (
                    <div className="col-6">
                      <label htmlFor="quantidade" className="col-form-label">
                        Quantidade
                      </label>
                      <NumericFormat
                        allowNegative={false}
                        decimalScale={0}
                        required
                        id="quantidade"
                        name="quantidade"
                        className="form-control inputForm"
                        autoComplete="off"
                        value={quant}
                        onValueChange={(values) => setQuant(values.value)}
                      />
                    </div>
                  )}
                </div>
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={limpaInput}
                    style={{ width: "30%" }}
                  >
                    Cancelar
                  </button>
                  {loading ? (
                    <button
                      className="btn btn-primary"
                      type="button"
                      style={{ width: "30%" }}
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
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: "30%" }}
                    >
                      Salvar
                    </button>
                  )}
                </div>
              </form>
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
                Editar cupom
              </h1>
              <button
                type="button"
                className="btn-close close2"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body px-4">
              <form onSubmit={editar} className="pb-3">
                <div className="mb-5">
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Código do cupom
                    </label>
                    <input
                      type="text"
                      className="form-control inputForm"
                      id="recipient-name"
                      value={codigo}
                      autoComplete="off"
                      readOnly
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="radioTipoDesconto"
                      className="col-form-label"
                    >
                      Tipo do desconto
                    </label>
                    <div
                      className="btn-group area-radio mb-3"
                      role="group"
                      aria-label="Basic radio toggle button group"
                    >
                      <input
                        type="radio"
                        required
                        className="btn-check"
                        name="radioTipoDesconto"
                        id="radioValor"
                        disabled
                        autoComplete="off"
                        value="V"
                        checked={tipo === "V"}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="radioValor"
                      >
                        Valor
                      </label>

                      <input
                        type="radio"
                        required
                        disabled
                        className="btn-check"
                        name="radioTipoDesconto"
                        id="radioPercentual"
                        autoComplete="off"
                        value="P"
                        checked={tipo === "P"}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="radioPercentual"
                      >
                        Percentual
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="valor" className="col-form-label">
                      {tipo === "V" ? "Valor" : "Percentual"}
                    </label>
                    {tipo === "V" ? (
                      <NumericFormat
                        prefix={"R$ "}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                        fixedDecimalScale
                        decimalScale={2}
                        required
                        readOnly
                        className="form-control inputForm"
                        id="valor"
                        autoComplete="off"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                      />
                    ) : (
                      <NumericFormat
                        decimalSeparator="."
                        allowNegative={false}
                        decimalScale={2}
                        required
                        readOnly
                        id="split"
                        name="split"
                        className="form-control inputForm"
                        value={valor}
                        autoComplete="off"
                        onValueChange={(values) => {
                          if (values.value > 100) {
                            toast.warning(
                              "O desconto não pode ser maior que 100%",
                              {
                                position: "top-center",
                                style: { width: "400px" },
                              }
                            );
                            setValor("");
                          } else {
                            setValor(values.value);
                          }
                        }}
                        suffix=" %"
                      />
                    )}
                  </div>
                  <div>
                    <label htmlFor="areaValidade" className="col-form-label">
                      Tem período de validade?
                    </label>
                    <div
                      className="btn-group area-radio mb-3"
                      role="group"
                      aria-label="Basic radio toggle button group"
                    >
                      <input
                        type="radio"
                        required
                        className="btn-check"
                        name="possuiValidade"
                        id="possuiValidadeS"
                        autoComplete="off"
                        value="S"
                        checked={possuiValidade === "S"}
                        onChange={(e) => setPossuiValidade(e.target.value)}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="possuiValidadeS"
                      >
                        Sim
                      </label>

                      <input
                        type="radio"
                        required
                        className="btn-check"
                        name="possuiValidade"
                        id="possuiValidadeN"
                        autoComplete="off"
                        value="N"
                        checked={possuiValidade === "N"}
                        onChange={(e) => setPossuiValidade(e.target.value)}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="possuiValidadeN"
                      >
                        Não
                      </label>
                    </div>
                  </div>

                  {possuiValidade === "S" && (
                    <div className="row mb-3">
                      <div className="col-6">
                        <label htmlFor="dataInicio" className="col-form-label">
                          Data de Ativação
                        </label>
                        <input
                          type="datetime-local"
                          id="dataInicio"
                          name="dataInicio"
                          className="form-control inputForm"
                          value={dataInicio}
                          min={new Date()}
                          onChange={(e) => setDataInicio(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="dataFim" className="col-form-label">
                          Data de Expiração
                        </label>
                        <input
                          type="datetime-local"
                          id="dataFim"
                          name="dataFim"
                          className="form-control inputForm"
                          value={dataFim}
                          min={dataInicio}
                          onChange={(e) => setDataFim(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label htmlFor="possuiLimite" className="col-form-label">
                      Possui limite de usos?
                    </label>
                    <div
                      className="btn-group area-radio mb-3"
                      role="group"
                      aria-label="Basic radio toggle button group"
                    >
                      <input
                        type="radio"
                        required
                        className="btn-check"
                        name="possuiLimite"
                        id="possuiLimiteS"
                        autoComplete="off"
                        value="S"
                        checked={possuiLimite === "S"}
                        onChange={(e) => setPossuiLimite(e.target.value)}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="possuiLimiteS"
                      >
                        Sim
                      </label>

                      <input
                        type="radio"
                        required
                        className="btn-check"
                        name="possuiLimite"
                        id="possuiLimiteN"
                        autoComplete="off"
                        value="N"
                        checked={possuiLimite === "N"}
                        onChange={(e) => setPossuiLimite(e.target.value)}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="possuiLimiteN"
                      >
                        Não
                      </label>
                    </div>
                  </div>
                  {possuiLimite === "S" && (
                    <div className="col-6">
                      <label htmlFor="quantidade" className="col-form-label">
                        Quantidade
                      </label>
                      <NumericFormat
                        allowNegative={false}
                        decimalScale={0}
                        required
                        id="quantidade"
                        name="quantidade"
                        className="form-control inputForm"
                        autoComplete="off"
                        value={quant}
                        onValueChange={(values) => setQuant(values.value)}
                      />
                    </div>
                  )}
                </div>
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={limpaInput}
                    style={{ width: "30%" }}
                  >
                    Cancelar
                  </button>
                  {loading ? (
                    <button
                      className="btn btn-primary"
                      type="button"
                      style={{ width: "30%" }}
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
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: "30%" }}
                    >
                      Salvar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
