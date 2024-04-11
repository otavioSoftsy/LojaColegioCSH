import axios from "axios";
import { useEffect, useRef } from "react";
import { url_base } from "../../../services/apis";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import CardCurso from "../../../components/CardCurso";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiShoppingCart } from "react-icons/fi";
import { TbWorldWww } from "react-icons/tb";
import {
  MdCrisisAlert,
  MdOutlineAccessTime,
  MdOutlineCalendarMonth,
  MdOutlineLocationOn,
  MdOutlinePersonPin,
} from "react-icons/md";
import "./detalhes.css";

export default function DetalhesCurso() {
  const [dataCurso, setDataCurso] = useState({});
  const [cursoObj, setCursoObj] = useState({});
  const [sexo, setSexo] = useState(null);
  const [perio, setPerio] = useState(null);
  const [cronogramas, setCronogramas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [icone, setIcone] = useState("");
  const [cor, setCor] = useState("");
  const [avulso, setAvulso] = useState("");
  const [info, setInfo] = useState("");
  const windowWidth = window.innerWidth;
  const [expandido, setExpandido] = useState(false);
  const [altura, setAltura] = useState("280px");
  const btnShowModal = useRef(null);
  const btnClose = useRef(null);
  const navigate = useNavigate();

  const idCurso = localStorage.getItem("@csh-idAtividade");

  useEffect(() => {
    async function getCurso() {
      await axios
        .get(url_base + `curso/obter?idCurso=${idCurso}`)
        .then((response) => {
          const data = response.data;

          setDataCurso(data);

          let list = [];

          data.cronogramas?.map((item) => {
            let dia = "";

            if (item.diaSemana === "SEG") {
              dia = "Segunda-Feira";
            } else if (item.diaSemana === "TER") {
              dia = "Terça-Feira";
            } else if (item.diaSemana === "QUA") {
              dia = "Quarta-Feira";
            } else if (item.diaSemana === "QUI") {
              dia = "Quinta-Feira";
            } else if (item.diaSemana === "SEX") {
              dia = "Sexta-Feira";
            } else if (item.diaSemana === "SAB") {
              dia = "Sábado";
            } else if (item.diaSemana === "DOM") {
              dia = "Domingo";
            }

            const formatarHora = (horaCompleta) => {
              const horaEminuto = horaCompleta.substring(0, 5);
              return horaEminuto;
            };

            list.push({
              diaSemana: dia,
              diaMes: item.diaMes,
              id: item.idCronograma,
              horaIni: formatarHora(item.horaInicio),
              horaFim: formatarHora(item.horaFim),
            });
          });

          setCronogramas(list);

          if (data.sexo === "F") {
            setSexo("Feminino");
          } else if (data.sexo === "M") {
            setSexo("Masculino");
          } else {
            setSexo("Ambos");
          }

          if (data.periodicidade === "U") {
            setPerio("Única");
          } else if (data.periodicidade === "S") {
            setPerio("Semanal");
          } else if (data.periodicidade === "D") {
            setPerio("Diária");
          } else if (data.periodicidade === "M") {
            setPerio("Mensal");
          }
          setIcone(data.categorias[0].icone);
          setCor(data.categorias[0].cor);

          const idCategoria = data.categorias[0].id;

          setAvulso(data.compraAvulsa);

          async function getCursos() {
            await axios
              .get(
                url_base +
                  `curso/listarAtivos?page=0&idCategoria=${idCategoria}`
              )
              .then((response) => {
                const responseData = response.data.content;
                const nomeCursoBuscado = data.nomeCurso;

                const cursosFiltrados = responseData.filter(
                  (curso) => curso.nomeCurso !== nomeCursoBuscado
                );

                setCursos(cursosFiltrados);
              })
              .catch((error) => {
                toast.error("Erro ao buscar atividades.");
                console.error(error);
              });
          }

          getCursos();

          setCursoObj({
            id: data.idCurso,
            nome: data.nomeCurso,
            areas: data.categorias,
            modalidade: data.modalidade,
            periodicidade: data.periodicidade,
            horas: data.cargaHoraria,
            cronogramas: data.cronogramas,
            valor: data.valorVenda,
            icone: data.categorias[0].icone,
            cor: data.categorias[0].cor,
            quantidade: 1,
            parcelas: data.numParcelas,
            avulso: data.compraAvulsa,
            alunos: [],
          });
        })
        .catch(() => {
          toast.error("Erro na requisição.");
        });
    }
    getCurso();
    window.scrollTo(0, 0);
  }, [idCurso]);

  const toggleExibicao = () => {
    setExpandido(!expandido);
    setAltura(expandido ? altura : "none");
  };

  const getSlidesPerView = (windowWidth) => {
    if (windowWidth > 1439) {
      return 4;
    } else if (windowWidth <= 1439 && windowWidth > 767) {
      return 3;
    } else {
      return 1;
    }
  };

  const slidesPerView = getSlidesPerView(windowWidth);

  function salvarCursoCarrinho() {
    const meuCarrinho = localStorage.getItem("@csh-itens-carrinho");

    let cursosCarrinho = JSON.parse(meuCarrinho) || [];

    const hasCurso = cursosCarrinho.some(
      (cursosNoCarrinho) => cursosNoCarrinho.id === cursoObj.id
    );

    const cursoUnico = cursosCarrinho.some(
      (cursosNoCarrinho) => cursosNoCarrinho.avulso === 'S'
    );

    if (hasCurso) {
      toast.warning("Essa atividade já está no carrinho.");
      return;
    }

    if (cursoUnico && avulso == 'S') {
      setInfo('Para realizar a compra desta atividade, seu carrinho não deve conter outras atividades.')
    } else if (cursoUnico) {
      setInfo('Seu carrinho contém uma atividade que não deve estar com outras atividades na realização da compra.')
    } else if (!cursoUnico) {
     setInfo('Para realizar a compra desta atividade, seu carrinho não deve conter outras atividades.')
    }

    if (cursoUnico && avulso == 'S') {    
      btnShowModal.current.click();
    } else if (!cursoUnico && avulso != 'S') {
      cursosCarrinho.push(cursoObj);
      localStorage.setItem(
        "@csh-itens-carrinho",
        JSON.stringify(cursosCarrinho)
      );
      toast.success("Adicionado com sucesso!");
      navigate("/carrinho");
    } else {
      btnShowModal.current.click();
    }
  }
  function salvarCursoCarrinho2() {
    localStorage.removeItem("@csh-itens-carrinho");

    let cursosCarrinho = []
    
    cursosCarrinho.push(cursoObj);
    localStorage.setItem("@csh-itens-carrinho", JSON.stringify(cursosCarrinho));
    btnShowModal.current.click();
    toast.success("Adicionado com sucesso!");
    navigate("/carrinho");
  }

  const categoriasArray = dataCurso.categorias || [];

  const categorias = categoriasArray.map((categoria) => categoria.descricao);

  const nomesSeparadosPorVirgula = categorias.join(", ");

  const dataAmericana = dataCurso.dataInicioVenda || "";

  const [ano, mes, dia] = dataAmericana.split("-");

  const dataFormatada = `${dia}/${mes}/${ano}`;

  return (
    <section className="container-custom">
      <section className="container-cli">
        <div className="mb-5">
          <section className="d-flex gap50">
            <section className="col-md-7 area-descricao">
              <div className="card col-12 card-curso rounded-5 shadow ps-4 pe-3 pt-5 pb-3 bg-light-subtle">
                <div className="area-detalhes">
                  <div
                    className="area-icon"
                    style={{ backgroundColor: `${cor}` }}
                  >
                    <FontAwesomeIcon icon={icone} />
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="card-subtitle mb-2 fw-normal text-secondary">
                    <FontAwesomeIcon
                      icon={icone}
                      style={{ fontSize: "24px" }}
                    />
                    <i className="ms-3">{nomesSeparadosPorVirgula}</i>
                  </h3>
                  <h3
                    className="nome-curso pb-2 mb-4 fw-semibold"
                    style={{ color: `${cor}`, position: "relative" }}
                  >
                    {dataCurso.nomeCurso}
                    <span
                      className="custom-border2"
                      style={{
                        backgroundColor: cor,
                        display: "block",
                        content: "",
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                      }}
                    ></span>
                  </h3>
                  <p className="fs55 p-descricao text-secondary">
                    {dataCurso.descricao &&
                      (expandido
                        ? dataCurso.descricao
                        : `${dataCurso.descricao.slice(0, 600)}...`)}
                    <span
                      style={{ color: cor, cursor: "pointer" }}
                      onClick={toggleExibicao}
                      className="ms-2"
                    >
                      {expandido ? "Exibir Menos" : "Exibir Mais"}
                    </span>
                  </p>
                </div>
              </div>
            </section>
            <section className="area-descricao2 col-md-5">
              <div className="text-end2">
                {dataCurso.esgotado ? (
                  <div>
                    <p className="text-danger p-esgotado fw-semibold my-0">
                      ATIVIDADE ESGOTADA!
                    </p>
                    <p className="my-0 p-info-esgotado text-secondary fw-light">
                      (Número de vagas atingido.)
                    </p>
                  </div>
                ) : (
                  <>
                    {cursoObj.valor !== null ? (
                      <div className="d-flex flex-column">
                        <p
                          className="text-secondary p1 fw-semibold"
                          style={{
                            margin: "0 0 -0.5em 0",
                          }}
                        >
                          {cursoObj.valor > 100 ? 'VALOR ANUAL' : ''}
                        </p>
                        <p
                          className="p2 fw-light"
                          style={{ color: `${cor}` }}
                        >
                          DE{" "}
                          <span className="p3 fw-semibold">
                            R$ {cursoObj.valor?.toFixed(2).replace(".", ",")}
                          </span>
                        </p>
                        <span className="p4 fw-semibold text-secondary">
                        {cursoObj.valor > 100 ? 'EM ATÉ 10X.' : ''}
                            
                          </span>
                      </div>
                    ) : (
                      <span
                        className="p-gratis fw-bold"
                        style={{ color: `${cor}` }}
                      >
                        {" "}
                        Atividade Gratuita! Garanta já a sua!
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="d-flex btns justify-content-end gap-4 mt-4">
                <Link
                  to="/atividades"
                  className="btn rounded-pill btn-outline-secondary px-4"
                >
                  Ver outras atividades
                </Link>
                <Link
                  className="btn btn-primary rounded-pill px-4"
                  onClick={salvarCursoCarrinho}
                >
                  <FiShoppingCart size={22} className="me-2 icon-add-cart" />
                  Adicionar ao carrinho
                </Link>
              </div>
            </section>
          </section>
          <div className="mt-5 gap50b d-flex">
            <div className="d-flex flex-column area-mini-cards col-md-7">
              <div className="d-flex justify-content-between gap-4">
                <div className="card rounded-5 mini-card text-secondary shadow  mb-4 bg-light-subtle">
                  <h5 className=" fw-semibold fs-5" style={{ color: `${cor}` }}>
                    Data de início:
                  </h5>
                  <p className="fs-4 mb-0">
                    <MdOutlineCalendarMonth size={30} /> {dataFormatada}
                  </p>
                </div>
                <div className="card rounded-5 mini-card text-secondary shadow  mb-4 bg-light-subtle">
                  <h5 className=" fw-semibold fs-5" style={{ color: `${cor}` }}>
                    Modalidade:
                  </h5>
                  <p className="fs-4 mb-0">
                    {dataCurso.modalidade === "Presencial" ? (
                      <>
                        <MdOutlineLocationOn size={30} />{" "}
                        <span>Presencial</span>
                      </>
                    ) : (
                      <>
                        <TbWorldWww size={30} /> + <span>Online</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div className="card rounded-5 mini-card text-secondary shadow  mb-4 bg-light-subtle">
                  <h5 className=" fw-semibold fs-5" style={{ color: `${cor}` }}>
                    Duração:
                  </h5>
                  <p className="fs-4 mb-0">
                    <MdOutlineAccessTime size={30} /> {dataCurso.cargaHoraria}{" "}
                    Horas de atividade
                  </p>
                </div>
                <div className="card rounded-5 mini-card text-secondary shadow  mb-4 bg-light-subtle">
                  <h5 className=" fw-semibold fs-5" style={{ color: `${cor}` }}>
                    Gênero:
                  </h5>
                  <p className="fs-4 mb-0">
                    <MdOutlinePersonPin size={30} /> {sexo}
                  </p>
                </div>
              </div>

              <div className="card rounded-5 card-pre-requisito text-secondary shadow mb-4  bg-light-subtle">
                <h5 className="fw-semibold fs-5" style={{ color: `${cor}` }}>
                  Pré-requisito:
                </h5>
                <p className="fs-5 mb-0">
                  <MdCrisisAlert size={30} /> {dataCurso.preRequisito}
                </p>
              </div>
            </div>
            <div className="area-tabela col-md-5">
              <table className="table text-center table-borderless table-light mt-2 shadow">
                <thead>
                  <tr>
                    <th className="bg-dark-subtle" scope="col" colSpan={3}>
                      Cronograma {perio}
                    </th>
                  </tr>
                  <tr>
                    <th scope="col" className="pb-2 pt-4 fw-semibold">
                      {cronogramas[0]?.diaSemana
                        ? "Dia da Semana"
                        : "Dia do Mês"}
                    </th>
                    <th scope="col" className="pb-2 pt-4 fw-semibold">
                      Horário de início
                    </th>
                    <th scope="col" className="pb-2 pt-4 fw-semibold">
                      Horário de término
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cronogramas.map((item) => {
                    const none = item.horaIni == "00:00";
                    return (
                      <tr key={item.id}>
                        <td>{item.diaSemana ? item.diaSemana : item.diaMes}</td>
                        {!none ? (
                          <>
                            <td>Às {item.horaIni}</td>
                            <td>Às {item.horaFim}</td>
                          </>
                        ) : (
                          <>
                            <td>Agendar com o professor</td>
                            <td>Agendar com o professor</td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <section className="footer-detalhes pt-5">
        <div className="container-cli padding0xs">
          <h4 className="text-white-50 fw-normal mb-4">
            Atividades recomendadas
          </h4>
          <h1 className="mb-3">
            Confira mais algumas atividades <br />
            relacionados aos seus interesses:
          </h1>
          <div className="cursos-recomendados">
            <Swiper
              className="row"
              slidesPerView={slidesPerView}
              modules={[Autoplay, Pagination]}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
            >
              {cursos.map((curso) => {
                return (
                  <SwiperSlide key={curso.idCurso}>
                    <CardCurso
                      idCurso={curso.idCurso}
                      categorias={curso.categorias}
                      descricao={curso.descricao}
                      nomeCurso={curso.nomeCurso}
                      duracao={curso.cargaHoraria}
                      valor={curso.valorVenda}
                      cronogramas={curso.cronogramas}
                      periodicidade={curso.periodicidade}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </section>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
        hidden={true}
        ref={btnShowModal}
      ></button>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body p-4">
              <p>
                {info}
              </p>
              <p className="m-0">Deseja limpar o seu carrinho e prosseguir com a compra?</p>
            </div>
            <div className="d-flex justify-content-end px-4 py-3 gap-3">
              <button
                type="button"
                className="btn btn-secondary rounded-pill px-4"
                data-bs-dismiss="modal"
                ref={btnClose}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary rounded-pill px-4"
                onClick={salvarCursoCarrinho2}
              >
               
                Prosseguir
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
