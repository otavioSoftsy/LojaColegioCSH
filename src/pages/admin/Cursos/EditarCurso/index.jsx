import axios from "axios";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Title from "../../../../components/admin/Title";
import { NumericFormat } from "react-number-format";
import { url_base } from "../../../../services/apis";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import EditableTable from "../../../../components/admin/EditableTable";
import TableCreatedParceiros from "../../../../components/admin/TableCreatedParceiros";

export default function EditarCurso() {
  const [tipoVenda, setTipoVenda] = useState("");
  const [numeroParcelas, setNumeroParcelas] = useState("");
  const [nomeCurso, setNomeCurso] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [isSincrona, setIsSincrona] = useState("");
  const [dataUnica, setDataUnica] = useState("");
  const [cargaHorariaCurso, setCargaHorariaCurso] = useState("");
  const [periodicidade, setPeriodicidade] = useState("");
  const [diaSemana, setDiaSemana] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [sexo, setSexo] = useState("");
  const [maxVagas, setMaxVagas] = useState("");
  const [minVagas, setMinVagas] = useState("");
  const [valorCurso, setValorCurso] = useState("");
  const [emParceria, setEmParceria] = useState("");
  const [descricaoCurso, setDescricaoCurso] = useState("");
  const [preRequisito, setPreRequisito] = useState("");
  const [cursoAberto, setCursoAberto] = useState("");
  const [areas, setAreas] = useState([]);
  const [areasSelecionadas, setAreasSelecionadas] = useState([]);
  const [parceiros, setParceiros] = useState([]);
  const [termosOferta, setTermosOferta] = useState(null);
  const [gratis, setGratis] = useState("");
  const [isDestaque, setIsDestaque] = useState("");
  const [usuarioCadastro, setUsuarioCadastro] = useState(null);
  const [tabelaData, setTabelaData] = useState([]);
  const [tabelaParceiros, setTabelaParceiros] = useState([]);
  const [dadosApiParceiros, setDadosApiParceiros] = useState([]);
  const [condicaoAtendida, setCondicaoAtendida] = useState(false);
  const [loading, setLoading] = useState(false);
  const [minIdade, setMinIdade] = useState("");
  const [maxIdade, setMaxIdade] = useState("");

  const optionsPeriodicidade = [
    { value: "U", label: "Única" },
    { value: "D", label: "Diária" },
    { value: "S", label: "Semanal" },
    { value: "M", label: "Mensal" },
  ];

  const parcelas = [];

  for (let i = 1; i <= 12; i++) {
    parcelas.push({ value: i, label: `Em até ${i}x` });
  }

  const navigate = useNavigate();
  const animatedComponents = makeAnimated();
  const { id } = useParams();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("@csh-login-admin"));
    setUsuarioCadastro(user.usuario);

    async function getAreas() {
      await axios
        .get(url_base + "categoria/listarAtivos")
        .then((response) => {
          const areasData = response.data;

          const areasObjetos = areasData.map((area) => ({
            value: area.id,
            label: area.descricao,
          }));

          setAreas(areasObjetos);
        })
        .catch(() => {
          toast.error("Erro ao buscar categorias.");
        });
    }
    getAreas();
    async function getParceiros() {
      await axios
        .get(url_base + "fornecedor/listarAtivos")
        .then((response) => {
          const parceirosData = response.data;

          const parceirosObjetos = parceirosData.map((parceiro) => ({
            value: parceiro.idFornecedor,
            label: parceiro.nomeResponsavel,
          }));

          setParceiros(parceirosObjetos);
        })
        .catch(() => {
          toast.error("Erro ao buscar parceiros.");
        });
    }
    getParceiros();

    async function getDadosApi() {
      await axios
        .get(url_base + "fornecedoresCurso/curso/" + id)
        .then((response) => {
          const parceirosData = response.data;
          setTabelaParceiros(parceirosData);
          setDadosApiParceiros(parceirosData);
        })
        .catch(() => {
          toast.error("Erro ao buscar parceiros.");
        });
    }
    getDadosApi();

    async function getCurso() {
      await axios
        .get(url_base + `curso/obter?idCurso=${id}`)
        .then((data) => {
          const dadosCurso = data.data;
          setCursoAberto(dadosCurso.abertoPublico);
          setCargaHorariaCurso(dadosCurso.cargaHoraria);
          setDataInicio(dadosCurso.dataInicioVenda);
          setDataFim(dadosCurso.dataFimVenda);
          setDescricaoCurso(dadosCurso.descricao);
          setMaxVagas(dadosCurso.maxVagas);
          setMinVagas(dadosCurso.minVagas);
          setModalidade(dadosCurso.modalidade);
          setNomeCurso(dadosCurso.nomeCurso);
          setPeriodicidade(dadosCurso.periodicidade);
          setIsSincrona(dadosCurso.sincrono);
          setValorCurso(dadosCurso.valorVenda);
          setSexo(dadosCurso.sexo);
          setPreRequisito(dadosCurso.preRequisito);
          setEmParceria(dadosCurso.emParceria);
          setDiaSemana(dadosCurso.diaSemana);
          setTermosOferta(dadosCurso.termosOferta);
          setIsDestaque(dadosCurso.emDestaque ? "S" : "N");
          setTabelaData(dadosCurso.cronogramas);
          setMinIdade(dadosCurso.minIdade);
          setMaxIdade(dadosCurso.maxIdade);
          setTipoVenda(dadosCurso.compraAvulsa);
          setNumeroParcelas(dadosCurso.numParcelas);

          if (dadosCurso.valorVenda !== null) {
            setGratis("N");
          } else {
            setGratis("S");
          }
          if (
            dadosCurso.dataFimVenda === null ||
            dadosCurso.dataFimVenda === ""
          ) {
            setDataUnica(dadosCurso.dataInicioVenda);
          }
          const dadosAreas = dadosCurso.categorias;
          const areasObjetos = dadosAreas.map((area) => ({
            id: area.id,
          }));
          setAreasSelecionadas(areasObjetos);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Falha ao buscar dados da atividade.");
        });
    }

    getCurso();
  }, []);

  const objeto = {
    idCurso: id,
    usuarioCadastro: usuarioCadastro,
    nomeCurso: nomeCurso,
    descricao: descricaoCurso,
    tipoOferta: "EmAndamento",
    codCursoAva: null,
    cargaHoraria: cargaHorariaCurso,
    dataInicioVenda: dataFim ? dataInicio : dataUnica,
    dataFimVenda: dataFim,
    modalidade: modalidade,
    sincrono: isSincrona,
    minVagas: minVagas,
    maxVagas: maxVagas,
    periodicidade: periodicidade,
    fornecedores: tabelaParceiros,
    valorVenda: valorCurso,
    abertoPublico: cursoAberto,
    sexo: sexo,
    preRequisito: preRequisito,
    diaSemana: diaSemana,
    emParceria: emParceria,
    emDestaque: isDestaque === "S" ? true : false,
    categorias: areasSelecionadas,
    termosOferta: termosOferta,
    imagem: null,
    horasAtc: 0,
    cronogramas: tabelaData,
    minIdade: Number(limparMascara(minIdade)),
    maxIdade: Number(limparMascara(maxIdade)),
    numParcelas: Number(numeroParcelas),
    compraAvulsa: tipoVenda,
  };

  const handleSelectChange = (selectedOptions) => {
    const areasSelecionadasAtualizadas = selectedOptions.map((option) => ({
      id: option.value,
    }));
    setAreasSelecionadas(() => areasSelecionadasAtualizadas);
  };

  function limparMascara(valor) {
    if (typeof valor !== "string") {
      return "";
    }
    return valor.replace(/\D/g, "");
  }

  function handleModalidade(valor) {
    setModalidade(valor);
    if (valor !== "online") {
      setIsSincrona(null);
    }
  }

  function handleTipoPagamento(valor) {
    setTipoVenda(valor);
    if (valor !== "Unico") {
      setNumeroParcelas(null);
    }
  }

  function handleCheckedGratis(valor) {
    setGratis(valor);
    if (valor === "S") {
      setValorCurso(null);
    }
  }

  function handlePeriodicidade(valor) {
    setTabelaData([
      { diaSemana: null, horaInicio: "", horaFim: "", diaMes: null },
    ]);
    if (valor.value === "U") {
      setDataInicio(null);
      setDataFim(null);
    } else {
      setDataUnica(null);
      setDataInicio(null);
      setDataFim(null);
    }
  }
  async function handleEmParceria(valor) {
    setEmParceria(valor);

    if (valor === "N") {
      const tabelaAtualizada = [];

      for (const item of dadosApiParceiros) {
        if (item.idFornecedorCurso) {
          try {
            await axios.delete(
              url_base + "fornecedoresCurso/" + item.idFornecedorCurso
            );

            tabelaAtualizada.push({
              split: "",
              parceiro: null,
            });
          } catch (error) {
            console.error(
              `Erro ao fazer a requisição DELETE para ${item.idFornecedorCurso}:`,
              error
            );
          }
        }
      }

      setTabelaParceiros(tabelaAtualizada);
    } else {
      setTabelaParceiros([
        {
          split: "",
          parceiro: null,
        },
      ]);
    }
  }

  const handleTabelaDataChange = (novaTabelaData) => {
    if (periodicidade === "U") {
      const novaTabelaDataAtualizada = novaTabelaData.map((item) => ({
        ...item,
        diaMes: dataUnica,
      }));
      setTabelaData(novaTabelaDataAtualizada);
    } else {
      setTabelaData(novaTabelaData);
    }
  };
  const handleTabelaDataChange2 = (novaTabelaData) => {
    setTabelaParceiros(novaTabelaData);
  };

  function validaDataIni(selectedDate) {
    const currentDate = new Date();
    const selectedDateObj = new Date(selectedDate);

    if (selectedDateObj < currentDate) {
      toast.error("Data de início não pode ser uma data passada.", {
        position: "top-center",
        icon: false,
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setDataInicio("");
      return;
    }
  }

  function validaDataFim(selectedDate) {
    const currentDate = new Date();
    const selectedDateObj = new Date(selectedDate);

    if (selectedDateObj < currentDate) {
      toast.error("Data de término não pode ser uma data passada.", {
        position: "top-center",
        icon: false,
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setDataFim("");
      return;
    }

    if (selectedDate < dataInicio) {
      toast.error("Data de término não pode ser menor que data de início.", {
        position: "top-center",
        icon: false,
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setDataFim("");
      return;
    }

    const date1 = new Date(dataFim);
    const date2 = new Date(dataInicio);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (periodicidade === "S" && diffDays < 7) {
      setCondicaoAtendida(true);
      toast.error(
        "A data fim deve conter pelo menos 7 dias para atividades semanais.",
        {
          position: "top-center",
          icon: false,
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: { width: "400px", height: "110px" },
        }
      );
      return;
    } else if (periodicidade === "M" && diffDays <= 30) {
      setCondicaoAtendida(true);
      toast.error(
        "A data fim deve conter pelo menos 30 dias para atividades mensais",
        {
          position: "top-center",
          icon: false,
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: { width: "400px", height: "110px" },
        }
      );
      return;
    }

    // if (periodicidade === "Q" && diffDays < 29) {
    //   setCondicaoAtendida(true);
    //   toast.error(
    //     "A data fim deve conter pelo menos 29 dias para atividades quinzenais.",
    //     {
    //       position: "top-center",
    //       icon: false,
    //       autoClose: false,
    //       hideProgressBar: true,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "colored",
    //       style: { width: "400px", height: "110px" },
    //     }
    //   );
    //   return;
    // } else

    setCondicaoAtendida(false);
  }
  function getIdFornecedorCurso(originalArray, modifiedArray) {
    return modifiedArray.map((modifiedItem) => {
      const matchingItem = originalArray.find(
        (originalItem) => originalItem.fornecedorId === modifiedItem.parceiro
      );

      return matchingItem ? matchingItem.idFornecedorCurso : null;
    });
  }

  function getNewFornecedores(originalArray, modifiedArray) {
    return modifiedArray.filter((modifiedItem) => {
      return !originalArray.some(
        (originalItem) => originalItem.fornecedorId === modifiedItem.parceiro
      );
    });
  }

  async function editarCurso(e) {
    e.preventDefault();

    if (dataUnica === null || dataUnica === "") {
      validaDataIni();
      validaDataFim();
    }

    if (!condicaoAtendida) {
      setLoading(true);

      const idFornecedorCursoList = getIdFornecedorCurso(
        dadosApiParceiros,
        tabelaParceiros
      );

      for (let i = 0; i < idFornecedorCursoList.length; i++) {
        const idFornecedorCurso = idFornecedorCursoList[i];

        if (idFornecedorCurso) {
          const modifiedItem = tabelaParceiros[i];

          try {
            await axios.put(
              url_base + `fornecedoresCurso/${idFornecedorCurso}`,
              {
                fornecedorId: modifiedItem.parceiro,
                cursoId: id,
                percentualSplit: modifiedItem.split,
              }
            );
          } catch (error) {
            console.error(
              `Erro ao editar item com idFornecedorCurso ${idFornecedorCurso}:`,
              error
            );
          }
        }
      }

      await axios
        .post(url_base + "curso/alterar", objeto)
        .then(async () => {
          const newFornecedores = getNewFornecedores(
            dadosApiParceiros,
            tabelaParceiros
          );

          for (const newFornecedor of newFornecedores) {
            try {
              await axios.post(url_base + "fornecedoresCurso", {
                fornecedorId: newFornecedor.parceiro,
                cursoId: id,
                percentualSplit: newFornecedor.split,
              });
            } catch (error) {
              console.error("Erro ao adicionar novo fornecedor:", error);
            }
          }
          toast.success("Atualizado com sucesso!");
          setLoading(false);
          navigate("/admin/atividades");
        })
        .catch((error) => {
          setLoading(false);
          toast.error("Erro ao editar atividade.");
          console.log(error);
        });
    }
  }

  const currentDate = new Date().toISOString().split("T")[0];

  const indexPeriodicidade = optionsPeriodicidade.findIndex(
    (opcao) => opcao.value === periodicidade
  );
  const indexParcela = parcelas.findIndex(
    (opcao) => opcao.value === numeroParcelas
  );
  const areasFiltradas = areas.filter((area) =>
    areasSelecionadas.some((selected) => selected.id === area.value)
  );

  return (
    <>
      <Title name="Editar atividade">
        <FiEdit size={28} />
      </Title>
      <form
        id="formAtv"
        onSubmit={editarCurso}
        className="card p-4 col-8 mx-auto"
      >
        <h1 className="mx-auto mb-5">Dados da atividade</h1>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="nomeResponsavel" className="form-label">
              Nome da atividade
            </label>
            <input
              type="text"
              id="nomeResponsavel"
              required
              name="nomeResponsavel"
              className="form-control inputForm"
              value={nomeCurso}
              onChange={(e) => setNomeCurso(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="modalidade" className="form-label">
              Modalidade da atividade
            </label>
            <div
              className="btn-group area-radio mb-4"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                className="btn-check"
                name="radioModalidade"
                id="radioModalidadeO"
                autoComplete="off"
                value="Online"
                checked={modalidade === "Online"}
                onChange={(e) => setModalidade(e.target.value)}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="radioModalidadeO"
              >
                Online
              </label>

              <input
                type="radio"
                className="btn-check"
                name="radioModalidade"
                id="radioModalidadeP"
                autoComplete="off"
                value="Presencial"
                checked={modalidade === "Presencial"}
                onChange={(e) => handleModalidade(e.target.value)}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="radioModalidadeP"
              >
                Presencial
              </label>
            </div>
          </div>
          {modalidade === "Online" && (
            <div className="col-md-6">
              <label htmlFor="isSincrona" className="form-label">
                Modalidade é Síncrona ?
              </label>
              <div
                className="btn-group area-radio mb-4"
                role="group"
                aria-label="Basic radio toggle button group"
              >
                <input
                  type="radio"
                  className="btn-check"
                  name="isSincrona"
                  id="isSincronaS"
                  autoComplete="off"
                  value="S"
                  checked={isSincrona === "S"}
                  onChange={(e) => setIsSincrona(e.target.value)}
                />
                <label
                  className="btn btn-outline-primary"
                  htmlFor="isSincronaS"
                >
                  Sim
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="isSincrona"
                  id="isSincronaN"
                  autoComplete="off"
                  value="N"
                  checked={isSincrona === "N"}
                  onChange={(e) => setIsSincrona(e.target.value)}
                />
                <label
                  className="btn btn-outline-primary"
                  htmlFor="isSincronaN"
                >
                  Não
                </label>
              </div>
            </div>
          )}
          <div className="col-md-6">
            <label htmlFor="areaCurso" className="form-label">
              Categorias da atividade
            </label>
            <Select
              required
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  borderColor: "#dee2e6",
                  "&:hover": {
                    borderColor: "#dee2e6",
                  },
                }),
              }}
              value={areasFiltradas}
              name="areaCurso"
              options={areas}
              className="basic-multi-select mt-1"
              classNamePrefix="select"
              onChange={handleSelectChange}
              placeholder="Selecione..."
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="periodicidade" className="form-label">
              Periodicidade
            </label>
            <Select
              required
              components={animatedComponents}
              isClearable={true}
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  borderColor: "#dee2e6",
                  "&:hover": {
                    borderColor: "#dee2e6",
                  },
                }),
              }}
              value={
                periodicidade !== null
                  ? optionsPeriodicidade[indexPeriodicidade]
                  : ""
              }
              name="periodicidade"
              options={optionsPeriodicidade}
              className="basic-singl mt-1 mb-4"
              classNamePrefix="select"
              onChange={(valor) => {
                setPeriodicidade(valor ? valor.value : null);
                handlePeriodicidade(valor);
              }}
              placeholder="Selecione..."
            />
          </div>
          {periodicidade === "U" && (
            <>
              <div className="col-md-6">
                <label htmlFor="dataUnica" className="form-label">
                  Data da atividade:
                </label>
                <input
                  type="date"
                  name="dataUnica"
                  id="dataUnica"
                  className="form-control inputForm"
                  required
                  value={dataUnica}
                  min={currentDate}
                  onChange={(e) => setDataUnica(e.target.value)}
                />
              </div>
              <EditableTable
                onRowDataChange={handleTabelaDataChange}
                periodicidade={periodicidade}
                dados={tabelaData}
              />
            </>
          )}
          {(periodicidade === "D" ||
            periodicidade === "M" ||
            periodicidade === "S") && (
            <>
              <div className="col-md-6">
                <label htmlFor="dataInicio" className="form-label">
                  Data de Início
                </label>
                <input
                  type="date"
                  name="dataInicio"
                  id="dataInicio"
                  className="form-control inputForm"
                  required
                  min={currentDate}
                  value={dataInicio}
                  onBlur={(e) => validaDataIni(e.target.value)}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="dataFim" className="form-label">
                  Data de término
                </label>
                <input
                  type="date"
                  name="dataFim"
                  id="dataFim"
                  className="form-control inputForm"
                  min={currentDate}
                  value={dataFim}
                  onBlur={(e) => validaDataFim(e.target.value)}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
              <EditableTable
                onRowDataChange={handleTabelaDataChange}
                periodicidade={periodicidade}
                dados={tabelaData}
              />
            </>
          )}
          <div className="col-md-6">
            <label htmlFor="cargaHorariaCurso" className="form-label">
              Carga horária na atividade
            </label>
            <NumericFormat
              allowNegative={false}
              decimalScale={0}
              id="cargaHorariaCurso"
              required
              name="cargaHorariaCurso"
              className="form-control inputForm"
              value={cargaHorariaCurso}
              onChange={(e) => setCargaHorariaCurso(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="minVagas" className="form-label">
              Mínimo de Vagas
            </label>
            <NumericFormat
              allowNegative={false}
              decimalScale={0}
              id="minVagas"
              required
              name="minVagas"
              className="form-control inputForm"
              value={minVagas}
              onChange={(e) => setMinVagas(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="maxVagas" className="form-label">
              Máximo de Vagas
            </label>
            <NumericFormat
              allowNegative={false}
              decimalScale={0}
              id="maxVagas"
              required
              name="maxVagas"
              className="form-control inputForm"
              value={maxVagas}
              onChange={(e) => setMaxVagas(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="sexo" className="form-label">
              Gênero
            </label>
            <div
              className="btn-group area-radio mb-4"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                className="btn-check"
                name="radioSexo"
                id="sexoF"
                autoComplete="off"
                value="F"
                checked={sexo === "F"}
                onChange={(e) => setSexo(e.target.value)}
              />
              <label className="btn btn-outline-primary" htmlFor="sexoF">
                Feminino
              </label>
              <input
                type="radio"
                className="btn-check"
                name="radioSexo"
                id="sexoM"
                autoComplete="off"
                value="M"
                checked={sexo === "M"}
                onChange={(e) => setSexo(e.target.value)}
              />
              <label className="btn btn-outline-primary" htmlFor="sexoM">
                Masculino
              </label>
              <input
                type="radio"
                className="btn-check"
                name="radioSexo"
                id="sexoA"
                autoComplete="off"
                value="A"
                checked={sexo === "A"}
                onChange={(e) => setSexo(e.target.value)}
              />
              <label className="btn btn-outline-primary" htmlFor="sexoA">
                Ambos
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <label htmlFor="minIdade" className="form-label">
              Faixa etária de:
            </label>
            <NumericFormat
              allowNegative={false}
              decimalScale={0}
              id="minIdade"
              suffix=" anos"
              name="minIdade"
              autoComplete="off"
              className="form-control inputForm"
              value={minIdade}
              onChange={(e) => {
                if (Number(limparMascara(e.target.value)) > 100) {
                  toast.warning("Idade não pode ser maior que 100.");
                  setMinIdade("");
                } else if (Number(limparMascara(e.target.value)) === 0) {
                  toast.warning("Idade não pode ser igual a 0.");
                  setMinIdade("");
                } else {
                  setMinIdade(e.target.value);
                }
              }}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="maxIdade" className="form-label">
              Até:
            </label>
            <NumericFormat
              allowNegative={false}
              decimalScale={0}
              id="maxIdade"
              name="maxIdade"
              suffix=" anos"
              autoComplete="off"
              className="form-control inputForm"
              value={maxIdade}
              onChange={(e) => {
                if (Number(limparMascara(e.target.value)) > 100) {
                  toast.warning("Idade não pode ser maior que 100.");
                  setMaxIdade("");
                } else if (Number(limparMascara(e.target.value)) === 0) {
                  toast.warning("Idade não pode ser igual a 0.");
                  setMaxIdade("");
                } else {
                  setMaxIdade(e.target.value);
                }
              }}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="destaque" className="form-label">
              Atividade em destaque?
            </label>
            <div
              className="btn-group area-radio mb-4"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                required
                className="btn-check"
                name="destaque"
                id="destaqueS"
                autoComplete="off"
                value="S"
                checked={isDestaque == "S"}
                onChange={(e) => {
                  setIsDestaque(e.target.value);
                }}
              />
              <label className="btn btn-outline-primary" htmlFor="destaqueS">
                Sim
              </label>

              <input
                type="radio"
                required
                className="btn-check"
                name="destaque"
                id="destaqueNao"
                autoComplete="off"
                value="N"
                checked={isDestaque == "N"}
                onChange={(e) => {
                  setIsDestaque(e.target.value);
                }}
              />
              <label className="btn btn-outline-primary" htmlFor="destaqueNao">
                Não
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <label htmlFor="cursoAberto" className="form-label">
              A atividade é aberta para o público?
            </label>
            <div
              className="btn-group area-radio mb-4"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                className="btn-check"
                name="radioCursoAberto"
                id="radioCursoAbertoS"
                autoComplete="off"
                value="S"
                checked={cursoAberto === "S"}
                onChange={(e) => setCursoAberto(e.target.value)}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="radioCursoAbertoS"
              >
                Sim
              </label>

              <input
                type="radio"
                className="btn-check"
                name="radioCursoAberto"
                id="radioCursoAbertoN"
                autoComplete="off"
                value="N"
                checked={cursoAberto === "N"}
                onChange={(e) => setCursoAberto(e.target.value)}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="radioCursoAbertoN"
              >
                Não
              </label>
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="radioIsGratis" className="form-label">
              A atividade é gratuita?
            </label>
            <div
              className="btn-group area-radio"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                required
                className="btn-check"
                name="radioIsGratis"
                id="radioIsGratisS"
                autoComplete="off"
                value="S"
                checked={gratis === "S"}
                onChange={(e) => handleCheckedGratis(e.target.value)}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="radioIsGratisS"
              >
                Sim
              </label>

              <input
                type="radio"
                required
                className="btn-check"
                name="radioIsGratis"
                id="radioIsGratisN"
                autoComplete="off"
                value="N"
                checked={gratis === "N"}
                onChange={(e) => handleCheckedGratis(e.target.value)}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="radioIsGratisN"
              >
                Não
              </label>
            </div>
          </div>
          {gratis === "N" && (
            <>
              <div className="col-md-6">
                <label htmlFor="valorCurso" className="form-label">
                  Valor da atividade
                </label>
                <NumericFormat
                  required
                  prefix={"R$ "}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  fixedDecimalScale
                  autoComplete="off"
                  decimalScale={2}
                  placeholder="Insira o valor total"
                  id="valorCurso"
                  name="valorCurso"
                  className="form-control inputForm"
                  value={valorCurso}
                  onValueChange={(values) => setValorCurso(values.value)}
                />
              </div>
            </>
          )}

          <div className="col-md-6">
            <label htmlFor="tipoVenda" className="form-label">
              Tipo da venda
            </label>
            <div
              className="btn-group area-radio mb-4"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                required
                className="btn-check"
                name="tipoVenda"
                id="tipoVendaR"
                autoComplete="off"
                value="N"
                checked={tipoVenda === "N"}
                onChange={(e) => handleTipoPagamento(e.target.value)}
              />
              <label className="btn btn-outline-primary" htmlFor="tipoVendaR">
                Conjunto
              </label>

              <input
                type="radio"
                required
                className="btn-check"
                name="tipoVenda"
                id="tipoVendaU"
                autoComplete="off"
                value="S"
                checked={tipoVenda === "S"}
                onChange={(e) => handleTipoPagamento(e.target.value)}
              />
              <label className="btn btn-outline-primary" htmlFor="tipoVendaU">
                Única
              </label>
            </div>
          </div>
          {tipoVenda === "S" && (
            <div className="col-md-6">
              <label htmlFor="numeroParcelas" className="form-label">
                Número máximo de parcelas
              </label>
              <Select
                required
                components={animatedComponents}
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    borderColor: "#dee2e6",
                    "&:hover": {
                      borderColor: "#dee2e6",
                    },
                  }),
                }}
                value={numeroParcelas !== null ? parcelas[indexParcela] : ""}
                name="numeroParcelas"
                options={parcelas}
                className="basic-singl mt-1 mb-4"
                classNamePrefix="select"
                onChange={(valor) => {
                  setNumeroParcelas(valor ? valor.value : null);
                }}
                placeholder="Selecione..."
              />
            </div>
          )}

          <div className="col-md-6">
            <label htmlFor="emParceria" className="form-label">
              A atividade é oferecida em parceria?
            </label>
            <div
              className="btn-group area-radio mb-4"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                className="btn-check"
                name="radioEmParceria"
                id="radioEmParceriaS"
                autoComplete="off"
                value="S"
                checked={emParceria === "S"}
                onChange={(e) => handleEmParceria(e.target.value)}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="radioEmParceriaS"
              >
                Sim
              </label>

              <input
                type="radio"
                className="btn-check"
                name="radioEmParceria"
                id="radioEmParceriaN"
                autoComplete="off"
                value="N"
                checked={emParceria === "N"}
                onChange={(e) => handleEmParceria(e.target.value)}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="radioEmParceriaN"
              >
                Não
              </label>
            </div>
          </div>
          {emParceria === "S" && (
            <div className="col-md-12">
              <TableCreatedParceiros
                onRowDataChange2={handleTabelaDataChange2}
                parceiros={parceiros}
                parceirosCurso={tabelaParceiros}
                dadosApi={dadosApiParceiros}
                setDadosApi={setDadosApiParceiros}
              />
            </div>
          )}
        </div>

        <div className="form-floating mt-3 mb-4">
          <textarea
            required
            className="form-control inputForm"
            placeholder="Leave a comment here"
            id="floatingTextarea2"
            style={{ height: "100px" }}
            value={descricaoCurso}
            onChange={(e) => setDescricaoCurso(e.target.value)}
          ></textarea>
          <label htmlFor="floatingTextarea2">Descrição da atividade</label>
        </div>
        <div className="form-floating">
          <textarea
            required
            value={preRequisito}
            onChange={(e) => setPreRequisito(e.target.value)}
            className="form-control inputForm"
            placeholder="Leave a comment here"
            id="floatingTextarea2"
            style={{ height: "100px" }}
          ></textarea>
          <label htmlFor="floatingTextarea2">Pré-Requisito</label>
        </div>

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
          <button type="submit" className="btn btn-primary btn-register">
            Salvar
          </button>
        )}
      </form>
    </>
  );
}
