import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Title from "../../../../components/admin/Title";
import {  MdOutlineSearch } from "react-icons/md";
import ReactPaginate from "react-paginate";
import {
  LuArrowDownUp,
  LuArrowDownWideNarrow,
  LuArrowUpNarrowWide,
  LuFilter,
} from "react-icons/lu";
import { FaFileExport } from "react-icons/fa6";
import { toast } from "react-toastify";
import ExcelJS from "exceljs";
import { api_financeiro } from "../../../../services/pagBank";
import { format } from "date-fns";
import DetalhesVenda from "./DetalhesVenda";
import "./relatoriovendas.css";
import { FaRegChartBar } from "react-icons/fa";

const RelatorioDeVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [clickCount, setClickCount] = useState(0);
  const [dataPesquisa, setDataPesquisa] = useState("");
  const [nomePesquisa, setNome] = useState("");
  const [idVenda, setIdVenda] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 8;

  const btnShowDetalhes = useRef(null);

  useEffect(() => {
    async function getVendas() {
      await axios.get(api_financeiro + `/venda/relatorio`).then((response) => {
        const data = response.data;
        if (data.sucesso) {
          setData(data.retorno);
          setTableData(data.retorno);
        } else {
          toast.error("Erro ao listar vendas.");
        }
      });
    }
    getVendas();
    function getVendasDetalhadas() {
      axios
        .get(api_financeiro + `/venda/relatorio/detalhada`)
        .then((response) => {
          const data = response.data;
          if (data.sucesso) {
            setVendas(data.retorno);
          } else {
            console.log("Erro ao listar vendas detalhadas.");
          }
        });
    }
    getVendasDetalhadas();
  }, []);

  function showModalDetalhes(id) {
    if (btnShowDetalhes.current) {
      setIdVenda(id);
      btnShowDetalhes.current.click();
    }
  }
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "";
    }
    setSortConfig({ key, direction });

    setClickCount((prevCount) => prevCount + 1);

    if (clickCount === 2) {
      setSortConfig({ key: "", direction: "" });
      setClickCount(0);
      setTableData(data);
    } else {
      const sortedData = [...data].sort((a, b) => {
        const valueA =
          key === "valorTotal" ? a[key] : a[key].toString().toLowerCase();
        const valueB =
          key === "valorTotal" ? b[key] : b[key].toString().toLowerCase();
        if (key === "valorTotal") {
          return (valueA - valueB) * (direction === "asc" ? 1 : -1);
        }
        return (
          valueA.localeCompare(valueB, undefined, { sensitivity: "base" }) *
          (direction === "asc" ? 1 : -1)
        );
      });
      setTableData(sortedData);
    }
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === "asc" ? (
        <LuArrowUpNarrowWide
          size={18}
          className="me-3"
          color="#818181"
          onClick={() => handleSort(columnName)}
        />
      ) : (
        <LuArrowDownWideNarrow
          size={18}
          className="me-3"
          color="#818181"
          onClick={() => handleSort(columnName)}
        />
      );
    }
    return (
      <LuArrowDownUp
        size={18}
        className="me-3"
        color="#818181"
        onClick={() => handleSort(columnName)}
      />
    );
  };

  const handleSearch = (key, value) => {
    setDataPesquisa("");
    setNome("");
    const filteredData = data.filter((item) => {
      const columnValue = item[key].toString().toLowerCase();
      return columnValue.startsWith(value.toLowerCase());
    });
    setTableData(filteredData);
    setCurrentPage(0);
  };

  const handleSearchData = (key, value) => {
    setDataPesquisa("");
    setNome("");

    const [year, month, day] = value.split("-");
    const dataAjustada = new Date(year, month - 1, day);
    const dataFormatada = format(dataAjustada, "dd/MM/yyyy");

    const filteredData = data.filter((item) => {
      const data = new Date(item[key]);
      const dataFormatada2 = format(data, "dd/MM/yyyy");
      return dataFormatada2 === dataFormatada;
    });

    setTableData(filteredData);
    setCurrentPage(0);
  };

  const resetFilters = () => {
    setDataPesquisa("");
    setNome("");
    setSortConfig({ key: "", direction: "" });
    setClickCount(0);
    setTableData(data);
    setCurrentPage(0);
  };

  const offset = currentPage * pageSize;
  const currentItems = tableData.slice(offset, offset + pageSize);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Relatório de vendas");

    const headers = [
      "ID Venda",
      "ID Item Venda",
      "ID Curso",
      "Forma de Pagamento",
      "Valor Total",
      "Nº Parcelas",
      "Valor Split",
      "ID Fornecedor",
      "Nome do Fornecedor",
      "Data da Venda",
      "ID Cliente",
      "Nome do Cliente",
      "ID Aluno",
      "Matrícula",
      "RG",
      "Nome do Aluno",
      "Nome do Curso",
      "Valor da Venda",
      "Status",
    ];

    worksheet.addRow(headers);

    worksheet.columns = [
      { header: headers[0], key: "idVenda", width: 10 },
      { header: headers[1], key: "idItemVenda", width: 15 },
      { header: headers[2], key: "idCurso", width: 10 },
      { header: headers[3], key: "formaPgto", width: 20 },
      { header: headers[4], key: "valorTotal", width: 13 },
      { header: headers[5], key: "numParcelas", width: 13 },
      { header: headers[6], key: "valorSplit", width: 13 },
      { header: headers[7], key: "idFornecedor", width: 15 },
      { header: headers[8], key: "nomeFornecedor", width: 40 },
      { header: headers[9], key: "dtVenda", width: 23 },
      { header: headers[10], key: "idCliente", width: 10 },
      { header: headers[11], key: "nomeCliente", width: 40 },
      { header: headers[12], key: "idAluno", width: 10 },
      { header: headers[13], key: "matricula", width: 15 },
      { header: headers[14], key: "rg", width: 18 },
      { header: headers[15], key: "nomeAluno", width: 30 },
      { header: headers[16], key: "nomeCurso", width: 25 },
      { header: headers[17], key: "valorVenda", width: 15 },
      { header: headers[18], key: "status", width: 10 },
    ];

    vendas.forEach((item) => {
      worksheet.addRow(item);
    });

    const blob = await workbook.xlsx.writeBuffer();

    const excelBlob = new Blob([blob], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(excelBlob);
    link.download = "relatorio_vendas.xlsx";
    link.click();
  };

  return (
    <>
      <Title name="Relatório de Vendas">
        <FaRegChartBar size={28} />
      </Title>
      <button
        type="button"
        className="btn btn-primary"
        ref={btnShowDetalhes}
        data-bs-toggle="modal"
        data-bs-target="#modalDetalhes"
        hidden={true}
      ></button>

      <div className="card card-table px-3 py-4">
        <div className="d-flex justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <h4 className="fw-normal m-0">Vendas Realizadas</h4>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-sm btn-danger" onClick={resetFilters}>
              Limpar Filtros
            </button>
            <button
              className="btn btn-sm btn-success d-flex gap-2"
              onClick={exportToExcel}
            >
              <FaFileExport size={20} />
              Exportar Excel
            </button>
          </div>
        </div>
        <table className="table table-hover table-matriculas">
          <thead className="table-light">
            <tr>
              <th scope="col" style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="col" onClick={() => handleSort("dtVenda")}>
                    Data da Venda
                  </span>
                  <div className="d-flex align-items-center">
                    {getSortIcon("dtVenda")}
                    <div className="dropdown drop-search border-end pe-2">
                      <LuFilter
                        size={19}
                        color="#818181"
                        className="me-2 dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-bs-auto-close="true"
                      />
                      <div
                        className="dropdown-menu dropdown-menu-end mt-1 p-2 "
                        style={{
                          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                          border: "none",
                        }}
                      >
                        <input
                          type="date"
                          className="form-control mb-2"
                          name="input-search-dtVenda"
                          id="input-search-dtVenda"
                          value={dataPesquisa}
                          onChange={(e) => {
                            console.log(e.target.value);
                            setDataPesquisa(e.target.value);
                          }}
                        />
                        <button
                          className="btn btn-sm col-12 btn-success"
                          onClick={() =>
                            handleSearchData("dtVenda", dataPesquisa)
                          }
                        >
                          <LuFilter size={19} color="#fff" className="me-1" />{" "}
                          Filtrar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th scope="col"  width='26%' style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span
                    className="col"
                    onClick={() => handleSort("nomeCliente")}
                  >
                    Nome do Cliente
                  </span>
                  <div className="d-flex align-items-center">
                    {getSortIcon("nomeCliente")}
                    <div className="dropdown border-end pe-2 drop-search">
                      <MdOutlineSearch
                        size={22}
                        color="#818181"
                        className="me-2 dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-bs-auto-close="true"
                      />
                      <div
                        className="dropdown-menu dropdown-menu-end mt-1 p-2"
                        style={{
                          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                          border: "none",
                        }}
                      >
                        <input
                          type="tel"
                          className="form-control mb-2"
                          id="input-search-nomeCliente"
                          placeholder="Nome do cliente"
                          value={nomePesquisa}
                          onChange={(e) => setNome(e.target.value)}
                        />
                        <button
                          className="btn btn-sm col-12 btn-success"
                          onClick={() =>
                            handleSearch("nomeCliente", nomePesquisa)
                          }
                        >
                          <MdOutlineSearch
                            size={22}
                            color="#fff"
                            className="me-1"
                          />{" "}
                          Buscar Cliente
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th scope="col" width='23%' style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="col" onClick={() => handleSort("formaPgto")}>
                    Forma de Pagamento
                  </span>
                  <div className="d-flex align-items-center border-end pe-1">
                    {getSortIcon("formaPgto")}
                  </div>
                </div>
              </th>
              <th scope="col" width='15%' style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span
                    className="col"
                    onClick={() => handleSort("valorTotal")}
                  >
                    Valor Total
                  </span>
                  <div className="d-flex align-items-center border-end pe-1">
                    {getSortIcon("valorTotal")}
                  </div>
                </div>
              </th>
              <th scope="col" width='15%' style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="col" onClick={() => handleSort("status")}>
                    Status
                  </span>
                  <div className="d-flex align-items-center">
                    {getSortIcon("status")}
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => {
              const data = new Date(item.dtVenda);
              const dataFormatada = format(data, "dd/MM/yyyy");
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
                <tr
                  key={item.idVenda}
                  style={{ cursor: "pointer" }}
                  onClick={() => showModalDetalhes(item.idVenda)}
                >
                  <td>{dataFormatada}</td>
                  <td>{item.nomeCliente}</td>
                  <td>
                    {item.formaPgto === "CARTAO_CREDITO"
                      ? "CARTÃO DE CRÉDITO"
                      : item.formaPgto}
                  </td>
                  <td>R${item.valorTotal.toFixed(2).replace(".", ",")}</td>
                  <td>
                    <span className={`badge ${classeSt}`}>{st}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={<span aria-hidden="true">&laquo;</span>}
          nextLabel={<span aria-hidden="true">&raquo;</span>}
          pageCount={Math.ceil(data.length / pageSize)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={0}
          onPageChange={handlePageClick}
          containerClassName={"pagination pagination-sm justify-content-end"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={`page-item`}
          previousLinkClassName={"page-link"}
          nextClassName={`page-item`}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          renderOnZeroPageCount={null}
        />
      </div>
      <DetalhesVenda id={idVenda} />
    </>
  );
};

export default RelatorioDeVendas;
