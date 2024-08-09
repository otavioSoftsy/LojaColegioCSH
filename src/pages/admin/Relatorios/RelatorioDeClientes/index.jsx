import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Title from "../../../../components/admin/Title";
import ReactPaginate from "react-paginate";
import { FaFileExport } from "react-icons/fa6";
import { toast } from "react-toastify";
import ExcelJS from "exceljs";
import { FaRegChartBar } from "react-icons/fa";
import { url_base } from "../../../../services/apis";
import "./relatorioclientes.css";
import DetalhesCliente from "./DetalhesCliente";

const RelatorioDeClientes = () => {
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  // const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  // const [clickCount, setClickCount] = useState(0);
  // const [nomePesquisa, setNome] = useState("");
  // const [email, setEmail] = useState("");
  // const [cpf, setCpf] = useState("");
  // const [celular, setCelular] = useState("");
  const [cliente, setCliente] = useState("");
  const [itemOffset, setItemOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 8;

  const btnShowDetalhes = useRef(null);

  useEffect(() => {
    async function getClientes() {
      await axios
        .get(url_base + `clientes?page=${itemOffset}&size=${itemsPerPage}`)
        .then((response) => {
          const responseData = response.data;

          if (responseData && responseData.content) {
            const data = responseData.content.reverse();
            setData(data);
            setTableData(data);
            const pageCount = Math.ceil(
              responseData.totalElements / itemsPerPage
            );
            setPageCount(pageCount);
          }
        })
        .catch((error) => {
          toast.error("Erro ao obter lista de clientes.");
          console.log(error);
        });
    }
    getClientes();
  }, [itemOffset]);

  function showModalDetalhes(item) {
    if (btnShowDetalhes.current) {
      setCliente(item);
      btnShowDetalhes.current.click();
    }
  }
  // const handleSort = (key) => {
  //   let direction = "asc";
  //   if (sortConfig.key === key) {
  //     direction = sortConfig.direction === "asc" ? "desc" : "";
  //   }
  //   setSortConfig({ key, direction });

  //   setClickCount((prevCount) => prevCount + 1);

  //   if (clickCount === 2) {
  //     setSortConfig({ key: "", direction: "" });
  //     setClickCount(0);
  //     setTableData(data);
  //   } else {
  //     const sortedData = [...data].sort((a, b) => {
  //       let valueA = a[key];
  //       let valueB = b[key];
  //       if (key === "cpf" || key === "celular") {
  //         valueA = typeof valueA === "string" ? parseFloat(valueA) : valueA;
  //         valueB = typeof valueB === "string" ? parseFloat(valueB) : valueB;
  //       } else {
  //         valueA = valueA.toString().toLowerCase();
  //         valueB = valueB.toString().toLowerCase();
  //       }
  //       if (key === "cpf" || key === "celular") {
  //         return (valueA - valueB) * (direction === "asc" ? 1 : -1);
  //       }
  //       return (
  //         valueA.localeCompare(valueB, undefined, { sensitivity: "base" }) *
  //         (direction === "asc" ? 1 : -1)
  //       );
  //     });
  //     setTableData(sortedData);
  //   }
  // };

  // const getSortIcon = (columnName) => {
  //   if (sortConfig.key === columnName) {
  //     return sortConfig.direction === "asc" ? (
  //       <LuArrowUpNarrowWide
  //         size={18}
  //         className="me-3"
  //         color="#818181"
  //         onClick={() => handleSort(columnName)}
  //       />
  //     ) : (
  //       <LuArrowDownWideNarrow
  //         size={18}
  //         className="me-3"
  //         color="#818181"
  //         onClick={() => handleSort(columnName)}
  //       />
  //     );
  //   }
  //   return (
  //     <LuArrowDownUp
  //       size={18}
  //       className="me-3"
  //       color="#818181"
  //       onClick={() => handleSort(columnName)}
  //     />
  //   );
  // };

  // const handleSearch = (key, value) => {
  //   setCpf("");
  //   setNome("");
  //   setEmail("");
  //   setCelular("");
  //   const filteredData = data.filter((item) => {
  //     const columnValue = item[key].toString().toLowerCase();
  //     return columnValue.includes(value.toLowerCase());
  //   });
  //   setTableData(filteredData);
  //   setPageCount(0);
  // };

  // const resetFilters = () => {
  //   setNome("");
  //   setCpf("");
  //   setEmail("");
  //   setCelular("");
  //   setSortConfig({ key: "", direction: "" });
  //   setClickCount(0);
  //   setTableData(data);
  //   setPageCount(0);
  // };

  const handlePageClick = (event) => {
    const newOffset = event.selected;
    setItemOffset(newOffset);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Relatório de clientes");

    const headers = [
      "Id Cliente",
      "Nome",
      "Email",
      "Data de nascimento",
      "Gênero",
      "CPF",
      "Celular",
      "CEP",
      "UF",
      "Município",
      "Bairro",
      "Endereço",
      "Número",
      "Complemento",
      "Ativo",
    ];

    worksheet.addRow(headers);

    worksheet.columns = [
      { header: headers[0], key: "idCliente", width: 10 },
      { header: headers[1], key: "nome", width: 40 },
      { header: headers[2], key: "email", width: 18 },
      { header: headers[3], key: "dataNascimento", width: 10 },
      { header: headers[4], key: "genero", width: 18 },
      { header: headers[5], key: "cpf", width: 30 },
      { header: headers[6], key: "celular", width: 15 },
      { header: headers[7], key: "cep", width: 13 },
      { header: headers[8], key: "uf", width: 6 },
      { header: headers[9], key: "municipio", width: 18 },
      { header: headers[10], key: "bairro", width: 20 },
      { header: headers[11], key: "endereco", width: 30 },
      { header: headers[12], key: "numero", width: 10 },
      { header: headers[13], key: "complemento", width: 20 },
      { header: headers[14], key: "ativo", width: 6 },
    ];

    data.forEach((item) => {
      worksheet.addRow(item);
    });

    const blob = await workbook.xlsx.writeBuffer();

    const excelBlob = new Blob([blob], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(excelBlob);
    link.download = "relatorio_clientes.xlsx";
    link.click();
  };

  function formatarCPF(cpf) {
    if (!cpf) return "";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  function formatarCelular(celular) {
    if (!celular) return "";
    return celular.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  function formatarData(data) {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <>
      <Title name="Relatório de Clientes">
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
            <h4 className="fw-normal m-0">Clientes cadastrados</h4>
          </div>
          <div className="d-flex align-items-center gap-2">
            {/* <button className="btn btn-sm btn-danger" onClick={resetFilters}>
              Limpar Filtros
            </button> */}
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
              <th scope="col" width="30%" style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span
                    className="col"
                    // onClick={() => handleSort("nome")}
                  >
                    Cliente
                  </span>
                  {/* <div className="d-flex align-items-center">
                    {getSortIcon("nome")}
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
                          id="input-search-nome"
                          placeholder="Nome do cliente"
                          value={nomePesquisa}
                          onChange={(e) => setNome(e.target.value)}
                        />
                        <button
                          className="btn btn-sm col-12 btn-success"
                          onClick={() => handleSearch("nome", nomePesquisa)}
                        >
                          <MdOutlineSearch
                            size={22}
                            color="#fff"
                            className="me-1"
                          />{" "}
                          Buscar cliente
                        </button>
                      </div>
                    </div>
                  </div> */}
                </div>
              </th>

              <th scope="col" style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span
                    className="col"
                    // onClick={() => handleSort("email")}
                  >
                    Email
                  </span>
                  {/* <div className="d-flex align-items-center">
                    {getSortIcon("email")}
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
                          id="input-search-email"
                          placeholder="Email do cliente"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                          className="btn btn-sm col-12 btn-success"
                          onClick={() => handleSearch("email", email)}
                        >
                          <MdOutlineSearch
                            size={22}
                            color="#fff"
                            className="me-1"
                          />{" "}
                          Buscar email
                        </button>
                      </div>
                    </div>
                  </div> */}
                </div>
              </th>
              <th scope="col" style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span
                    className="col"
                    // onClick={() => handleSort("dataNascimento")}
                  >
                    Data nascimento
                  </span>
                  {/* <div className="d-flex align-items-center">
                    {getSortIcon("dataNascimento")}
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
                          id="input-search-dataNascimento"
                          placeholder="Email do cliente"
                          value={dataNasc}
                          onChange={(e) => setDataNasc(e.target.value)}
                        />
                        <button
                          className="btn btn-sm col-12 btn-success"
                          onClick={() => handleSearch("dataNascimento", dataNasc)}
                        >
                          <MdOutlineSearch
                            size={22}
                            color="#fff"
                            className="me-1"
                          />{" "}
                          Buscar data
                        </button>
                      </div>
                    </div>
                  </div> */}
                </div>
              </th>
              <th scope="col" style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span
                    className="col"
                    // onClick={() => handleSort("cpf")}
                  >
                    CPF
                  </span>
                  {/* <div className="d-flex align-items-center border-end pe-1">
                    {getSortIcon("cpf")}
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
                          type="tel"
                          className="form-control mb-2"
                          id="input-search-cpf"
                          placeholder="Digite o CPF"
                          value={cpf}
                          onChange={(e) => setCpf(e.target.value)}
                        />
                        <button
                          className="btn btn-sm col-12 btn-success"
                          onClick={() => handleSearch("cpf", cpf)}
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
                  </div> */}
                </div>
              </th>
              <th scope="col" style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span
                    className="col"
                    // onClick={() => handleSort("celular")}
                  >
                    Celular
                  </span>
                  {/* <div className="d-flex align-items-center border-end pe-1">
                    {getSortIcon("celular")}
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
                          type="tel"
                          className="form-control mb-2"
                          id="input-search-celular"
                          placeholder="Digite o celular"
                          value={celular}
                          onChange={(e) => setCelular(e.target.value)}
                        />
                        <button
                          className="btn btn-sm col-12 btn-success"
                          onClick={() => handleSearch("celular", celular)}
                        >
                          <MdOutlineSearch
                            size={20}
                            color="#fff"
                            className="me-1"
                          />{" "}
                          Buscar celular
                        </button>
                      </div>
                    </div>
                  </div> */}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item) => {
              return (
                <tr
                  key={item.idCliente}
                  style={{ cursor: "pointer" }}
                  onClick={() => showModalDetalhes(item)}
                >
                  <td>{item.nome}</td>
                  <td>{item.email}</td>
                  <td>{formatarData(item.dataNascimento)}</td>
                  <td>{formatarCPF(item.cpf)}</td>
                  <td>{formatarCelular(item.celular)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={<span aria-hidden="true">&laquo;</span>}
          nextLabel={<span aria-hidden="true">&raquo;</span>}
          pageCount={pageCount}
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
      <DetalhesCliente
        cliente={cliente}
        formatarCPF={formatarCPF}
        formatarCelular={formatarCelular}
        formatarData={formatarData}
      />
    </>
  );
};

export default RelatorioDeClientes;
