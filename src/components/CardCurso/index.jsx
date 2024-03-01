import { Link } from "react-router-dom";
import "./cardcurso.css";
import PropTypes from "prop-types";
import useContexts from "../../hooks/useContexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

CardCurso.propTypes = {
  nomeCurso: PropTypes.string.isRequired,
  duracao: PropTypes.string.isRequired,
  periodicidade: PropTypes.string.isRequired,
  valor: PropTypes.number,
  idCurso: PropTypes.number.isRequired,
  categorias: PropTypes.array,
  descricao: PropTypes.string.isRequired,
  cronogramas: PropTypes.array.isRequired,
};

export default function CardCurso({
  idCurso,
  nomeCurso,
  duracao,
  valor,
  categorias,
  descricao,
  periodicidade,
  cronogramas,
}) {
  const { setCurso } = useContexts();
  const [perio, setPerio] = useState('')
  const [nomeFormatado, setNomeFormatado] = useState('')
  
  useEffect(() => {
    if (periodicidade === 'S') {
      setPerio('Semanal')
    } else if (periodicidade === 'U') {
      setPerio('Única')
    } else if (periodicidade === 'D') {
      setPerio('Diária')
    } else if (periodicidade === 'M') {
      setPerio('Mensal')
    }
    const removerAcentos = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };
    const cursoAtualizado = removerAcentos(nomeCurso).toLowerCase().replace(/\s+/g, "-").replace(/\//g, "");
    setNomeFormatado(cursoAtualizado);
  }, [])

  const categoriasArray = categorias || [];

  const descricoesCategorias = categoriasArray
    .map((categoria) => categoria.descricao)
    .join(", ");

  const nomesSeparadosPorVirgula = descricoesCategorias || descricao;



  const handleClick = (id) => {
    setCurso(id);
  };


  return (
    <Link
      to={`/atividades/${nomeFormatado}`}
      onClick={() => handleClick(idCurso)}
      className="card rounded-5 cardCurso shadow bg-light-subtle"
    >
      <div className="area">
        <div
          className="area-icon-card rounded-pill p-2"
          style={{ backgroundColor: `${categorias[0].cor}` }}
        >
          <FontAwesomeIcon icon={categorias[0].icone} />
        </div>
      </div>
      <div className="card-body">
        <p className="card-subtitle text-dark-emphasis">
          {nomesSeparadosPorVirgula}
        </p>
        <Link to={`/atividades/${nomeFormatado}`} onClick={() => handleClick(idCurso)}>
          <p
            className="fw-semibold mb-1 fs-5 nomeCurso"
            style={{ color: "#00A2A8" }}
          >
            {nomeCurso}
          </p>
        </Link>
        <p className="card-text fw-light descricao text-secondary text mb-1">
          {descricao}
        </p>
        <div className="d-flex flex-column info-card text-dark fw-light">
          {/* <div className="d-flex mb-1">
            <span>Horário:</span>
            <span style={{ fontWeight: "bold", color: "#023e8a" }}>
              12 ás 14h
            </span>
          </div> */}
          <div className="d-flex col-12 justify-content-between">
            <span>Duração:</span>
            <span className="fw-semibold" style={{ color: "#023e8a" }}>
              {duracao} horas
            </span>
          </div>
          <div className="d-flex col-12 justify-content-between">
            <span>{perio}:</span>
            <span className="fw-semibold" style={{ color: "#023e8a" }}>
            {cronogramas[0].diaSemana || cronogramas[0].diaMes
                ? cronogramas[0].diaSemana ||
                  cronogramas[0].diaMes.split("-").reverse().join("/")
                : "De SEG a SEX"}
              {cronogramas[1] &&
                " e " + (cronogramas[1].diaSemana || cronogramas[1].diaMes)}
            </span>
          </div>
          <div className="d-flex col-12 justify-content-between">
            <span>Mensalidades:</span>
            {valor ? (
              <span className="fw-semibold" style={{color: "#023e8a" }}>
                R$ {valor.toFixed(2).replace(".", ",")}
              </span>
            ) : (
              <span className="fw-semibold" style={{ fontWeight: "bolder", color: "#023e8a" }}>
                Grátis
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
