import { useEffect, useState } from "react";
import axios from "axios";
import { url_base } from "../../services/apis";
import { toast } from "react-toastify";
import Banner from "../../assets/banner.png";
import Banner2 from "../../assets/banner.jpg";
import BannerMobile from "../../assets/banner-mobile.png";
import BannerMobile2 from "../../assets/banner-mobile.jpg";
import Moca from "../../assets/moca.png";
import { Link } from "react-router-dom";
import CardCurso from "../../components/CardCurso";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./home.css";

export default function Home() {
  const [cursos, setCursos] = useState([]);
  const [areas, setAreas] = useState([]);
  const windowWidth = window.innerWidth;

  useEffect(() => {
    async function getCursos() {
      await axios
        .get(url_base + `curso/listarEmDestaque`)
        .then((response) => {
          const responseData = response.data;

          if (responseData && responseData.content) {
            setCursos(responseData.content);
          }
        })
        .catch((error) => {
          toast.error("Erro ao buscar atividades.");
          console.log(error);
        });
    }
    async function getAreas() {
      await axios
        .get(url_base + "categoria/listarAtivos")
        .then((data) => {
          setAreas(data.data);
        })
        .catch(() => {
          toast.error("Erro ao listar categorias.");
        });
    }
    getCursos();
    getAreas();
  }, []);

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

  return (
    <div id="container-home">
      {windowWidth <= 767 ? (
        <section
          id="area-img"
          style={{ height: cursos.length === 0 && "0vh", marginBottom: "200%" }}
        >
          <div className="banners">
            {windowWidth <= 767 ? (
             <Swiper
             className="swiper-banners"
             modules={[Autoplay]}
             autoplay={{
               delay: 4000,
               disableOnInteraction: false,
             }}
           >
             <SwiperSlide>
               <img
                 className="banner-mobile"
                 src={BannerMobile2}
                 alt="Banner-Mobile2"
               />
             </SwiperSlide>
             <SwiperSlide>
               <img
                 className="banner-mobile"
                 src={BannerMobile}
                 alt="Banner-Mobile"
               />
             </SwiperSlide>
           </Swiper>
            ) : (
              <Swiper
                className="swiper-banners"
                modules={[Autoplay, Pagination]}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
              >
                <SwiperSlide>
                  <img className="banner2" src={Banner2} alt="Banner" />
                </SwiperSlide>
                <SwiperSlide>
                  <img className="banner" src={Banner} alt="Banner" />
                </SwiperSlide>
              </Swiper>
            )}
          </div>
          {cursos.length !== 0 && (
            <section className="container-cli area-destaque">
              <div className="info-destaque d-flex justify-content-between marginTopCards">
                <div>
                  <p className="text-body-secondary mb-0 fs-5">
                    Eletivas em destaque
                  </p>
                  <h2
                    className=" pb-3"
                    style={{ color: "#F5B45D", position: "relative" }}
                  >
                    Descubra o poder da aprendizagem <br />
                    personalizada com a nossa <br />
                    plataforma inovadora
                    <span className="custom-border"></span>
                  </h2>
                </div>
                <div
                  className="cursos-disponiveis"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div className="d-flex">
                    <span
                      className="fw-light fs-4"
                      style={{ color: "#F5B45D", height: "85px" }}
                    >
                      MAIS DE{" "}
                      <span className="fw-bold" style={{ fontSize: "3em" }}>
                        85
                      </span>
                    </span>
                  </div>
                  <div
                    className="py-1 px-3"
                    style={{
                      backgroundColor: "#616161",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <h4 className="fw-bold m-0 text-white">
                      ELETIVAS DISPONÍVEIS
                    </h4>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="container-cli cursos-destaque">
            <Swiper
              modules={[Autoplay, Pagination]}
              className="carrossel py-4"
              slidesPerView={slidesPerView}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 1500,
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
        </section>
      ) : (
        <section
          id="area-img"
          style={{ height: cursos.length === 0 && "35vh" }}
        >
          <div className="banners">
            {windowWidth <= 767 ? (
              <Swiper
                className="swiper-banners"
                modules={[Autoplay]}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
              >
                <SwiperSlide>
                  <img
                    className="banner-mobile"
                    src={BannerMobile2}
                    alt="Banner-Mobile2"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    className="banner-mobile"
                    src={BannerMobile}
                    alt="Banner-Mobile"
                  />
                </SwiperSlide>
              </Swiper>
            ) : (
              <Swiper
                className="swiper-banners"
                modules={[Autoplay, Pagination]}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
              >
                <SwiperSlide>
                  <img className="banner2" src={Banner2} alt="Banner" />
                </SwiperSlide>
                <SwiperSlide>
                  <img className="banner" src={Banner} alt="Banner" />
                </SwiperSlide>
              </Swiper>
            )}
          </div>
          {cursos.length !== 0 && (
            <section className="container-cli area-destaque">
              <div className="info-destaque d-flex justify-content-between marginTopCards">
                <div>
                  <p className="text-body-secondary mb-0 fs-5">
                    Eletivas em destaque
                  </p>
                  <h2
                    className=" pb-3"
                    style={{ color: "#F5B45D", position: "relative" }}
                  >
                    Descubra o poder da aprendizagem <br />
                    personalizada com a nossa <br />
                    plataforma inovadora
                    <span className="custom-border"></span>
                  </h2>
                </div>
                <div
                  className="cursos-disponiveis"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div className="d-flex">
                    <span
                      className="fw-light fs-4"
                      style={{ color: "#F5B45D", height: "85px" }}
                    >
                      MAIS DE{" "}
                      <span className="fw-bold" style={{ fontSize: "3em" }}>
                        85
                      </span>
                    </span>
                  </div>
                  <div
                    className="py-1 px-3"
                    style={{
                      backgroundColor: "#616161",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <h4 className="fw-bold m-0 text-white">
                      ELETIVAS DISPONÍVEIS
                    </h4>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="container-cli cursos-destaque">
            <Swiper
              modules={[Autoplay, Pagination]}
              className="carrossel py-4"
              slidesPerView={slidesPerView}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 1500,
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
        </section>
      )}
      <section className="container-cli area-interesse">
        <p className="text-body-secondary mb-0 fs-5">Categorias de interesse</p>
        <h2
          className=" pb-3"
          style={{ color: "#F5B45D", position: "relative" }}
        >
          Aproveite para aprender mais
          <span className="custom-border"></span>
        </h2>
        <div className="areas-destaque d-flex justify-content-center">
          <section className="col-md-8 pb-3">
            <div className="row py-4 mb-5">
              {areas.map((area) => {
                if (area.descricao !== "Todas as categorias") {
                  return (
                    <Link
                      key={area.id}
                      to={`/atividades?categoria=${encodeURIComponent(
                        area.descricao
                      )}`}
                      className="card card-areas mt-2 rounded-5 shadow p-2 bg-light-subtle"
                      style={{ textDecoration: "none" }}
                    >
                      <div className="card-body d-flex flex-column align-items-center justify-content-center">
                        <div
                          className="rounded-pill p-3"
                          // aqui vai a cor que o usuario cadastrou
                          style={{ backgroundColor: `${area.cor}` }}
                        >
                          {/* aqui vai o icone que o usuario cadastrou */}
                          <FontAwesomeIcon icon={area.icone} />
                        </div>
                        <h3
                          className="title-card-areas mt-3"
                          // aqui vai a cor que o usuario cadastrou
                          style={{ color: area.cor }}
                        >
                          {area.descricao}
                        </h3>
                      </div>
                    </Link>
                  );
                }
              })}
            </div>
            <div className="show">
              <Link
                to="atividades"
                className="btn fw-normal btn-primary btn-lg rounded-pill"
              >
                Ver todas as atividades
              </Link>
            </div>
          </section>
          <section className="col-md-4 d-flex">
            <div className="moca-img">
              <img className="moca" src={Moca} alt="Moça" />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
