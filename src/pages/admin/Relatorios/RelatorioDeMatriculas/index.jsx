import { useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import Title from "../../../../components/admin/Title";
import {  MdOutlineSearch } from "react-icons/md";
import ReactPaginate from "react-paginate";
import {
  LuArrowDownUp,
  LuArrowDownWideNarrow,
  LuArrowUpNarrowWide,
} from "react-icons/lu";
import { FaFileExport } from "react-icons/fa6";
import { FaRegChartBar } from "react-icons/fa";
import { toast } from "react-toastify";
import DetalhesMatricula from "./DetalhesMatricula";
import ExcelJS from "exceljs";
import "./relatorio.css";
import { api_financeiro } from "../../../../services/pagBank";

const RelatorioDeMatriculas = () => {
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [clickCount, setClickCount] = useState(0);
  const [clientPesquisa, setClientPesquisa] = useState("");
  const [cpfPesquisa, setCpfPesquisa] = useState("");
  const [cursoPesquisa, setCursoPesquisa] = useState("");
  const [alunoPesquisa, setAlunoPesquisa] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 8;
  const id = useId();

  const btnShowDetalhes = useRef(null);

  useEffect(() => {
    async function getMatriculas() {
      await axios.get(api_financeiro + `/venda/matriculas`).then((response) => {
        const data = response.data;
        if (data.sucesso) {
          console.log(data)
          setData(data.retorno);
          setTableData(data.retorno);
        } else {
          toast.error("Erro ao listar matrículas.");
          console.log(response)
        }
      });
    }
    getMatriculas();
  }, []);

  function showModalDetalhes(id) {
    if (btnShowDetalhes.current) {
      setIdCliente(id);
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
        const valueA = a[key].toString().toLowerCase();
        const valueB = b[key].toString().toLowerCase();

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
    setClientPesquisa("");
    setCpfPesquisa("");
    setCursoPesquisa("");
    setAlunoPesquisa("");
    const filteredData = data.filter((item) => {
      const columnValue = item[key].toString().toLowerCase();
      return columnValue.includes(value.toLowerCase());
    });
    setTableData(filteredData);
    setCurrentPage(0);
  };

  const resetFilters = () => {
    setClientPesquisa("");
    setCpfPesquisa("");
    setCursoPesquisa("");
    setAlunoPesquisa("");
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

  const formatarCPF = (cpf) => {
    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(
      6,
      9
    )}-${cpf.substring(9, 11)}`;
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Relatório de matrículas");

    const headers = [
      "ID Venda",
      "Data da Venda",
      "ID Cliente",
      "Nome do Cliente",
      "Email",
      "CPF",
      "Código em Web",
      "ID Curso",
      "Nome do Curso",
      "Matrícula",
      "RG",
      "Nome",
    ];
    worksheet.addRow(headers);

    worksheet.columns = [
      { header: headers[0], key: "idVenda", width: 10 },
      { header: headers[1], key: "dtVenda", width: 20 },
      { header: headers[2], key: "idCliente", width: 10 },
      { header: headers[3], key: "nomeCliente", width: 20 },
      { header: headers[4], key: "email", width: 20 },
      { header: headers[5], key: "cpf", width: 15 },
      { header: headers[6], key: "codigoEmWeb", width: 15 },
      { header: headers[7], key: "idCurso", width: 10 },
      { header: headers[8], key: "nomeCurso", width: 20 },
      { header: headers[9], key: "matricula", width: 15 },
      { header: headers[10], key: "rg", width: 15 },
      { header: headers[11], key: "nome", width: 20 },
    ];

    data.forEach((item) => {
      worksheet.addRow([
        item.idVenda,
        item.dtVenda,
        item.idCliente,
        item.nomeCliente,
        item.email,
        item.cpf,
        item.codigoEmWeb,
        item.idCurso,
        item.nomeCurso,
        item.matricula,
        item.rg,
        item.nome,
      ]);
    });

    const blob = await workbook.xlsx.writeBuffer();

    const excelBlob = new Blob([blob], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(excelBlob);
    link.download = "matriculas.xlsx";
    link.click();
  };

  return (
    <>
      <Title name="Relatório de Matrículas">
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
            <h4 className="fw-normal m-0">Matrículas Realizadas</h4>
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
              <th scope="col" width="28%" style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span
                    className="col"
                    onClick={() => handleSort("nomeCliente")}
                  >
                    Cliente
                  </span>
                  <div className="d-flex align-items-center">
                    {getSortIcon("nomeCliente")}
                    <div className="dropdown drop-search border-end pe-2">
                      <MdOutlineSearch
                        size={20}
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
                          type="text"
                          className="form-control mb-2"
                          id="input-search-cliente"
                          placeholder="Nome do cliente"
                          value={clientPesquisa}
                          onChange={(e) => setClientPesquisa(e.target.value)}
                        />
                        <button
                          className="btn btn-sm col-12 btn-success"
                          onClick={() =>
                            handleSearch("nomeCliente", clientPesquisa)
                          }
                        >
                          <MdOutlineSearch
                            size={20}
                            color="#fff"
                            className="me-1"
                          />{" "}
                          Buscar cliente
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th scope="col" style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="col" onClick={() => handleSort("cpf")}>
                    CPF
                  </span>
                  <div className="d-flex align-items-center">
                    {getSortIcon("cpf")}
                    <div className="dropdown border-end pe-2 drop-search">
                      <MdOutlineSearch
                        size={20}
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
                          id="input-search-cpf"
                          placeholder="Digite o CPF"
                          value={cpfPesquisa}
                          onChange={(e) => setCpfPesquisa(e.target.value)}
                        />
                        <button
                          className="btn btn-sm col-12 btn-success"
                          onClick={() => handleSearch("cpf", cpfPesquisa)}
                        >
                          <MdOutlineSearch
                            size={20}
                            color="#fff"
                            className="me-1"
                          />{" "}
                          Buscar CPF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th scope="col" width="28%" style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="col" onClick={() => handleSort("nome")}>
                    Aluno
                  </span>
                  <div className="d-flex align-items-center">
                    {getSortIcon("nome")}
                    <div className="dropdown drop-search border-end pe-2">
                      <MdOutlineSearch
                        size={20}
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
                          type="text"
                          className="form-control mb-2"
                          id="input-search-aluno"
                          placeholder="Nome do aluno"
                          value={alunoPesquisa}
                          onChange={(e) => setAlunoPesquisa(e.target.value)}
                        />
                        <button
                          className="btn btn-sm col-12 btn-success"
                          onClick={() => handleSearch("nome", alunoPesquisa)}
                        >
                          <MdOutlineSearch
                            size={20}
                            color="#fff"
                            className="me-1"
                          />{" "}
                          Buscar aluno
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th scope="col" width="28%" style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="col" onClick={() => handleSort("nomeCurso")}>
                    Curso
                  </span>
                  <div className="d-flex align-items-center">
                    {getSortIcon("nomeCurso")}
                    <div className="dropdown drop-search">
                      <MdOutlineSearch
                        size={20}
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
                          type="text"
                          className="form-control mb-2"
                          id="input-search-curso"
                          placeholder="Nome do curso"
                          value={cursoPesquisa}
                          onChange={(e) => setCursoPesquisa(e.target.value)}
                        />
                        <button
                          className="btn btn-sm col-12 btn-success"
                          onClick={() =>
                            handleSearch("nomeCurso", cursoPesquisa)
                          }
                        >
                          <MdOutlineSearch
                            size={20}
                            color="#fff"
                            className="me-1"
                          />{" "}
                          Buscar Curso
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => {
              const cpfFormat = formatarCPF(item.cpf);
              return (
                <tr
                  key={id}
                  style={{ cursor: "pointer" }}
                  onClick={() => showModalDetalhes(item.idCliente)}
                >
                  <td>{item.nomeCliente}</td>
                  <td>{cpfFormat}</td>
                  <td>{item.nome}</td>
                  <td>{item.nomeCurso}</td>
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
      <DetalhesMatricula id={idCliente} />
    </>
  );
};

export default RelatorioDeMatriculas;
