import { useEffect, useState } from "react";
import axios from "axios";
import { url_base } from "../../../services/apis";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import EditableTable from "../EditableTable";
import { toast } from "react-toastify";
import TableCreatedParceiros from "../TableCreatedParceiros";
import "./formcurso.css";

export default function FormCurso() {
  const [nomeCurso, setNomeCurso] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [isSincrona, setIsSincrona] = useState("");
  const [cargaHorariaCurso, setCargaHorariaCurso] = useState("");
  const [periodicidade, setPeriodicidade] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [dataUnica, setDataUnica] = useState(null);
  const [sexo, setSexo] = useState("");
  const [nVagas, setNVagas] = useState("");
  const [valorCurso, setValorCurso] = useState(null);
  const [isGratis, setGratis] = useState("");
  const [emParceria, setEmParceria] = useState("");
  const [descricaoCurso, setDescricaoCurso] = useState("");
  const [preRequisito, setPreRequisito] = useState("");
  const [cursoAberto, setCursoAberto] = useState("");
  const [minIdade, setMinIdade] = useState("");
  const [maxIdade, setMaxIdade] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [parceirosSelecionados, setParceirosSelecionados] = useState([]);
  const [areas, setAreas] = useState([]);
  const [areasSelecionadas, setAreasSelecionadas] = useState([]);
  const [usuarioCadastro, setUsuarioCadastro] = useState("");

  const [tabelaData, setTabelaData] = useState([]);
  const [tabelaParceiros, setTabelaParceiros] = useState([]);

  const [condicaoAtendida, setCondicaoAtendida] = useState(false);
  const [isDestaque, setIsDestaque] = useState(false);
  const [loading, setLoading] = useState(false);

  const optionsPeriodicidade = [
    { value: "U", label: "Única" },
    { value: "D", label: "Diária" },
    { value: "S", label: "Semanal" },
    { value: "M", label: "Mensal" },
  ];

  const navigate = useNavigate();
  const animatedComponents = makeAnimated();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("@gdv-login-admin"));
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

    async function getFornecedores() {
      await axios
        .get(url_base + "fornecedor/listarAtivos")
        .then((response) => {
          const parceirosData = response.data;

          const parceirosObjetos = parceirosData.map((parceiro) => ({
            value: parceiro.idFornecedor,
            label: parceiro.nomeResponsavel,
          }));

          setFornecedores(parceirosObjetos);
        })
        .catch(() => {
          toast.error("Erro ao buscar parceiros.");
        });
    }
    getFornecedores();
  }, []);

  const objeto = {
    usuarioCadastro: usuarioCadastro,
    nomeCurso: nomeCurso,
    sexo: sexo,
    emParceria: emParceria,
    emDestaque: isDestaque,
    preRequisito: preRequisito,
    descricao: descricaoCurso,
    tipoOferta: "NovaOferta",
    codCursoAva: null,
    cargaHoraria: Number(cargaHorariaCurso),
    horasAtc: 0,
    dataInicioVenda: periodicidade !== "U" ? dataInicio : dataUnica,
    dataFimVenda: dataFim,
    modalidade: modalidade,
    sincrono: isSincrona,
    maxVagas: nVagas,
    minVagas: 0,
    periodicidade: periodicidade,
    fornecedores: parceirosSelecionados,
    valorVenda: valorCurso,
    abertoPublico: cursoAberto,
    termosOferta: null,
    imagem: "null",
    categorias: areasSelecionadas,
    cronogramas: tabelaData,
    minIdade: Number(limparMascara(minIdade)),
    maxIdade: Number(limparMascara(maxIdade)),
  };

  const handleTabelaDataChange = (novaTabelaData) => {
    if (periodicidade === "U") {
      const novaTabelaDataAtualizada = novaTabelaData.map((item) => ({
        ...item,
        diaMes: dataUnica
      }));
      setTabelaData(novaTabelaDataAtualizada);
    } else {
      setTabelaData(novaTabelaData);
    }
  };
  const handleTabelaDataChange2 = (novaTabelaData) => {
    console.log(novaTabelaData);
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

  function limparMascara(valor) {
    if (typeof valor !== "string") {
      return "";
    }
    return valor.replace(/\D/g, "");
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
    // else if (periodicidade === "Q" && diffDays < 29) {
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
    // }

    setCondicaoAtendida(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (dataUnica === null) {
      validaDataIni();
      validaDataFim();
    }
  
    if (!condicaoAtendida) {
      setLoading(true);
  
      try {
        const responseCurso = await axios.post(url_base + "curso/incluir", objeto);
        const idCurso = responseCurso.data.idCurso;
  
        const promises = tabelaParceiros.map(async (item) => {
          console.log(item)
          try {
            const dataFornecedor = {
              fornecedorId: Number(item.parceiro),
              cursoId: idCurso,
              percentualSplit: parseFloat(item.split),
            };
  
            await axios.post(url_base + "fornecedoresCurso", dataFornecedor);
          } catch (error) {
            console.error(`Erro ao cadastrar fornecedor para ${item.parceiro}: ${error.message}`);
            throw error;
          }
        });
  
        await Promise.all(promises);
  
        toast.success("Cadastrado com sucesso!");
        navigate("/admin/atividades");
      } catch (error) {
        setLoading(false);
        toast.error("Erro ao cadastrar curso.");
        console.log(error);
        console.log(objeto)
      } finally {
        setLoading(false);
      }
    }
  }
  

  function handleModalidade(valor) {
    setModalidade(valor);
    if (valor !== "Online") {
      setIsSincrona(null);
    }
  }

  function handlePeriodicidade(valor) {
    setTabelaData([{ diaSemana: null, horaInicio: "", horaFim: "", diaMes: null }])
    if (valor.value === "U") {
      setDataInicio('');
      setDataFim('');
    } else {
      setDataUnica('');
      setDataInicio('');
      setDataFim('');
    }
  }
  function handleCheckedGratis(valor) {
    setGratis(valor);
      setValorCurso(null);
  }
  function handleEmParceria(valor) {
    setEmParceria(valor);
    if (valor === "N") {
      setParceirosSelecionados(null);
    }
  }

  const handleSelectChange = (selectedOptions) => {
    const areasSelecionadasAtualizadas = selectedOptions.map((option) => ({
      id: option.value,
    }));

    setAreasSelecionadas(() => areasSelecionadasAtualizadas);
  };

  const indexPeriodicidade = optionsPeriodicidade.findIndex(
    (opcao) => opcao.value === periodicidade
  );

  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <form
      id="formAtv"
      onSubmit={handleSubmit}
      className="card p-4 col-8 mx-auto"
    >
      <h1 className="mx-auto mb-5">Nova atividade</h1>

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
            autoComplete="off"
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
              required
              className="btn-check"
              name="radioModalidade"
              id="radioModalidadeO"
              autoComplete="off"
              value="Online"
              checked={modalidade === "Online"}
              onChange={(e) => handleModalidade(e.target.value)}
            />
            <label
              className="btn btn-outline-primary"
              htmlFor="radioModalidadeO"
            >
              Online
            </label>

            <input
              type="radio"
              required
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
                required
                className="btn-check"
                name="isSincrona"
                id="isSincronaS"
                autoComplete="off"
                value="S"
                checked={isSincrona === "S"}
                onChange={(e) => setIsSincrona(e.target.value)}
              />
              <label className="btn btn-outline-primary" htmlFor="isSincronaS">
                Sim
              </label>

              <input
                type="radio"
                required
                className="btn-check"
                name="isSincrona"
                id="isSincronaN"
                autoComplete="off"
                value="N"
                checked={isSincrona === "N"}
                onChange={(e) => setIsSincrona(e.target.value)}
              />
              <label className="btn btn-outline-primary" htmlFor="isSincronaN">
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
            name="areaCurso"
            options={areas}
            className="basic-multi-select mt-1 mb-2"
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
            autoComplete="off"
            className="form-control inputForm"
            value={cargaHorariaCurso}
            onChange={(e) => setCargaHorariaCurso(e.target.value)}
          />
        </div>
        {/* <div className="col-md-6">
          <label htmlFor="cargaHorariaHomologada" className="form-label">
            Carga horária homologada
          </label>
          <NumericFormat
            allowNegative={false}
            decimalScale={0}
            id="cargaHorariaHomologada"
            autoComplete="off"
            required
            name="cargaHorariaHomologada"
            className="form-control inputForm"
            value={cargaHorariaHomologada}
            onChange={(e) => setCargaHorariaHomologada(e.target.value)}
          />
        </div> */}
         <div className="col-md-6">
          <label htmlFor="nVagas" className="form-label">
            N° de vagas
          </label>
          <NumericFormat
            allowNegative={false}
            decimalScale={0}
            id="nVagas"
            required
            name="nVagas"
            autoComplete="off"
            className="form-control inputForm"
            value={nVagas}
            onChange={(e) => setNVagas(e.target.value)}
          />
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
            placeholder="Opcional"
            onChange={(e) => {
              if (e.target.value > 100) {
                toast.warning("Idade não pode ser maior que 100.");
                setMinIdade("");
              } else if (e.target.value === 0) {
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
            placeholder="Opcional"
            onChange={(e) => {
              if (e.target.value > 100) {
                toast.warning("Idade não pode ser maior que 100.");
                setMaxIdade("");
              } else if (e.target.value === 0) {
                toast.warning("Idade não pode ser igual a 0.");
                setMaxIdade("");
              } else {
                setMaxIdade(e.target.value);
              }
            }}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="radioSexo" className="form-label">
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
              value={true}
              onChange={(e) => setIsDestaque(e.target.value)}
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
              value={false}
              onChange={(e) => setIsDestaque(e.target.value)}
            />
            <label className="btn btn-outline-primary" htmlFor="destaqueNao">
              Não
            </label>
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="radioCursoAberto" className="form-label">
            A atividade é aberta para o público?
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
              required
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
              checked={isGratis === "S"}
              onChange={(e) => handleCheckedGratis(e.target.value)}
            />
            <label className="btn btn-outline-primary" htmlFor="radioIsGratisS">
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
              checked={isGratis === "N"}
              onChange={(e) => handleCheckedGratis(e.target.value)}
            />
            <label className="btn btn-outline-primary" htmlFor="radioIsGratisN">
              Não
            </label>
          </div>
        </div>
        {isGratis === "N" && (
          <div className="col-md-6">
            <label htmlFor="valorCurso" className="form-label">
              Valor total
            </label>
            <NumericFormat
              required
              prefix={"R$ "}
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              fixedDecimalScale
              decimalScale={2}
              autoComplete="off"
              placeholder="Insira o valor total"
              id="valorCurso"
              name="valorCurso"
              className="form-control inputForm"
              value={valorCurso}
              onValueChange={(values) => setValorCurso(values.value)}
            />
          </div>
        )}
        <div className="col-md-6">
          <label htmlFor="radioEmParceria" className="form-label">
            A atividade é oferecida em parceria?
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
              required
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
              parceiros={fornecedores}
            />
          </div>
        )}

        {/* fim */}
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
        <button className="btn btn-primary btn-register" type="button" disabled>
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
          Cadastrar
        </button>
      )}
    </form>
  );
}
