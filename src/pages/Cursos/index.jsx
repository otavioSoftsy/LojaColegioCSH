import { url_base } from "../../services/apis";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import { FiFilter } from "react-icons/fi";
import { LuArrowDownUp } from "react-icons/lu";
import CardCurso from "../../components/CardCurso";
import { useLocation } from "react-router-dom";
import "./cursos.css";

export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [totalCursos, setTotalCursos] = useState("");
  const [cursosBuscados, setCursosBuscados] = useState([]);
  const [areas, setAreas] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [periodicidade, setPeriodicidade] = useState(null);
  const [selectPerio, setSelectPerio] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [idCategoria, setIdCategoria] = useState(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [busca, setBusca] = useState(params.get("busca"));
  const [area, setArea] = useState(params.get("categoria"));

  const loadMoreItems = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // const handleCategoriaChange = (selectedOption) => {
  //   setCategoria(selectedOption ? selectedOption.value : null);
  // };
  const handleAreaChange = (selectedOption) => {
    setSelectedArea(selectedOption);
    setIdCategoria(selectedOption.value)
    setSelectPerio(selectedOption);
    setBusca(null);
    setPeriodicidade(null);
    setPage(0);
  };

  const handlePeriodicidadeChange = (selectedOption) => {
    setSelectPerio(selectedOption);
    setBusca(null);
    setPeriodicidade(selectedOption ? selectedOption.value : null);
    setSelectedArea(null)
    setPage(0);
  };

  async function fetchCursos(page, busca, periodicidade, categoria) {
    setLoading(true);

    if (page == 0) {
      setCursos([]);
      setCursosBuscados([]);
    }

    await axios
      .get(
        url_base +
          `curso/listarAtivos?page=${page}&size=30&sort=nomeCurso&busca=${
            busca || ""
          }&periodicidade=${periodicidade || ""}&idCategoria=${categoria}`
      )
      .then((response) => {
        const responseData = response.data;
        setTotalCursos(responseData.totalElements);

        if (responseData && responseData.content) {
          setCursos((prevCursos) => [...prevCursos, ...responseData.content]);
          setCursosBuscados((prevCursos) => [
            ...prevCursos,
            ...responseData.content,
          ]);
          setHasMore(responseData.content.length > 0);
        }

        setLoading(false);
      })
      .catch((error) => {
        toast.error("Erro ao buscar atividades.");
        console.error(error);
      });
  }

  useEffect(() => {
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

          const areaParam = area || "";

          const areaEncontrada = areasData.find(
            (area) => area.descricao === areaParam
          );

          if (areaEncontrada) {
            fetchCursos(page, busca, periodicidade, areaEncontrada.id);
          } else if(idCategoria) {
            console.log(idCategoria)
            fetchCursos(page, busca, periodicidade, idCategoria);
            console.error(`Categoria "${idCategoria}" não encontrada`);
          } else {
            fetchCursos(page, busca, periodicidade, '');
          }
        })
        .catch(() => {
          toast.error("Erro ao buscar categorias.");
        });
    }
    getAreas();
    
  }, [page, periodicidade, location.search, idCategoria]);

  // const cursosFiltradosMemo = useMemo(() => {
  //   if (area) {
  //     return cursosBuscados.filter((curso) =>
  //       curso.categorias.some((categoria) => categoria.descricao === area)
  //     );

  //   } else {
  //     return cursosBuscados;
  //   }
  // }, [area, cursosBuscados]);

  // useEffect(() => {
  //   setCursosBuscados(cursosFiltradosMemo);
  // }, [cursosFiltradosMemo]);

  useEffect(() => {
    setSelectPerio(null);
    setPeriodicidade(null);
    setPage(0);
    setBusca(params.get("busca"));
    setArea(params.get("categoria"));
    setIdCategoria(null)
  }, [location.search]);

  const customComponents = {
    DropdownIndicator: (props) => {
      return (
        <components.DropdownIndicator {...props}>
          <FiFilter className="icon-select" size={22} color="#F5B45D" />
        </components.DropdownIndicator>
      );
    },
  };
  const customComponents2 = {
    DropdownIndicator: (props) => {
      return (
        <components.DropdownIndicator {...props}>
          <LuArrowDownUp className="icon-select" size={22} color="#F5B45D" />
        </components.DropdownIndicator>
      );
    },
  };

  const orderByLowestValue = () => {
    console.log(cursosBuscados)
    const sortedCursos = [...cursosBuscados].sort((cursoA, cursoB) => {
      return cursoA.valorVenda - cursoB.valorVenda;
    });
    setCursosBuscados(sortedCursos);
  };

  const orderByHighestValue = () => {
    console.log(cursosBuscados)
    const sortedCursos = [...cursosBuscados].sort((cursoA, cursoB) => {
      return cursoB.valorVenda - cursoA.valorVenda;
    });
    setCursosBuscados(sortedCursos);
  };
  const optionsWithSorting = [
    { value: "menorValor", label: "Menor valor" },
    { value: "maiorValor", label: "Maior valor" },
  ];
  

  return (
    <section className="container-cli container-cursos">
      <div className="title-cursos">
        <div className="d-flex row-selects justify-content-between">
          <h2 className="mb-0" style={{color: '#F5B45D'}}>
            Atividades disponíveis
          </h2>
          <div className="selects-cursos d-flex gap-3">
            <Select
              isClearable={false}
              isSearchable={false}
              components={customComponents2}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderWidth: "1px",
                  borderColor: state.isFocused ? "#F5B45D" : "#F5B45D",
                  "&:hover": {
                    borderColor: "#F5B45D",
                  },
                }),
              }}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#F5B45D",
                },
              })}
              options={optionsWithSorting}
              onChange={(selectedOption) => {
                if (selectedOption.value === "menorValor") {
                  orderByLowestValue();
                } else if (selectedOption.value === "maiorValor") {
                  orderByHighestValue();
                }
              }}
              className="basic-singl select-cursos"
              classNamePrefix="select"
              placeholder="Ordenar"
            />
            
            <Select
              isClearable={true}
              isSearchable={false}
              components={customComponents}
              value={selectedArea || selectPerio}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderWidth: "1px",
                  borderColor: state.isFocused ? "#F5B45D" : "#F5B45D",
                  "&:hover": {
                    borderColor: "#F5B45D",
                  },
                }),
              }}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#F5B45D",
                },
              })}
              name="selectAreas"
              onChange={(selectedOption) => {
                if (selectedOption) {
                  if (selectedOption.value !== "U" && selectedOption.value !== "D" && selectedOption.value !== "S" && selectedOption.value !== "M") {
                    handleAreaChange(selectedOption);
                    setSelectPerio(null);
                    setPeriodicidade(null);
                  } else {
                    handlePeriodicidadeChange(selectedOption);
                    setSelectedArea(null);
                    setIdCategoria(null);
                  }
                } else {
                  setSelectedArea(null);
                  setSelectPerio(null);
                  setIdCategoria(null);
                  setPeriodicidade(null);
                }
              }}
              options={[
                { label: 'categorias', options: areas, section: "categorias" },
                {
                  label: 'Periodicidades',
                  options: [
                    { value: "U", label: "Únicas", section: "Periodicidade" },
                    { value: "D", label: "Diárias", section: "Periodicidade" },
                    { value: "S", label: "Semanais", section: "Periodicidade" },
                    { value: "M", label: "Mensais", section: "Periodicidade" },
                  ],
                },
              ]}
              className="basic-singl select-cursos"
              classNamePrefix="select"
              
              placeholder="Filtrar"
            />
          </div>
        </div>

        <hr id="hr-cursos" />
      </div>
      <div className="area-cursos">
        <InfiniteScroll
          className="cursos py-3"
          dataLength={cursos.length}
          next={loadMoreItems}
          hasMore={hasMore}
          // loader={<h4>Carregando...</h4>}
        >
          {cursosBuscados.map((curso) => {
            return (
              <CardCurso
                key={curso.idCurso}
                idCurso={curso.idCurso}
                nomeCurso={curso.nomeCurso}
                duracao={curso.cargaHoraria}
                valor={curso.valorVenda}
                categorias={curso.categorias}
                descricao={curso.descricao}
                cronogramas={curso.cronogramas}
                periodicidade={curso.periodicidade}
              />
            );
          })}
          {loading && (
            <>
              <div
                className="card rounded-5 mt-4 placeholder-wave"
                aria-hidden="true"
              >
                <span
                  className="placeholder bg-secondary"
                  style={{ height: "100%" }}
                ></span>
              </div>
              <div
                className="card rounded-5 mt-4 placeholder-wave"
                aria-hidden="true"
              >
                <span
                  className="placeholder bg-secondary"
                  style={{ height: "100%" }}
                ></span>
              </div>
              <div
                className="card rounded-5 mt-4 placeholder-wave"
                aria-hidden="true"
              >
                <span
                  className="placeholder bg-secondary"
                  style={{ height: "100%" }}
                ></span>
              </div>
              <div
                className="card rounded-5 mt-4 placeholder-wave"
                aria-hidden="true"
              >
                <span
                  className="placeholder bg-secondary"
                  style={{ height: "100%" }}
                ></span>
              </div>
              <div
                className="card rounded-5 mt-4 placeholder-wave"
                aria-hidden="true"
              >
                <span
                  className="placeholder bg-secondary"
                  style={{ height: "100%" }}
                ></span>
              </div>
              <div
                className="card rounded-5 mt-4 placeholder-wave"
                aria-hidden="true"
              >
                <span
                  className="placeholder bg-secondary"
                  style={{ height: "100%" }}
                ></span>
              </div>
              <div
                className="card rounded-5 mt-4 placeholder-wave"
                aria-hidden="true"
              >
                <span
                  className="placeholder bg-secondary"
                  style={{ height: "100%" }}
                ></span>
              </div>
            </>
          )}
        </InfiniteScroll>
      </div>
    </section>
  );
}
