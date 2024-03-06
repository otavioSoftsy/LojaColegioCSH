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
      setPerio('SEMANAL')
    } else if (periodicidade === 'U') {
      setPerio('ÚNICA')
    } else if (periodicidade === 'D') {
      setPerio('DIÁRIA')
    } else if (periodicidade === 'M') {
      setPerio('MENSAL')
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
      <div className="card-body pb-1">
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
        <p className="card-text fw-light descricao text-secondary text mb-3">
          {descricao}
        </p>
        <div className="d-flex info-card text-secondary justify-content-between fw-light">
          <div className="d-flex flex-column text-center">
            <span className="span-n-one">DURAÇÃO</span>
            <span className="fw-semibold badge text-bg-secondary">
              {duracao} Horas
            </span>
          </div>
          <div className="d-flex flex-column text-center">
            <span className="span-n-one">{perio}</span>
            <span className="fw-semibold badge text-bg-secondary">
            {cronogramas[0].diaSemana || cronogramas[0].diaMes
                ? cronogramas[0].diaSemana ||
                  cronogramas[0].diaMes.split("-").reverse().join("/")
                : "De SEG a SEX"}
              {cronogramas[1] &&
                " e " + (cronogramas[1].diaSemana || cronogramas[1].diaMes)}
            </span>
          </div>
          <div className="d-flex flex-column text-center">
            <span className="span-n-one">VALOR</span>
            {valor ? (
              <span className="fw-semibold badge text-bg-secondary">
                R$ {valor.toFixed(2).replace(".", ",")}
              </span>
            ) : (
              <span className="fw-semibold badge text-bg-secondary" style={{ fontWeight: "bolder"}}>
                Grátis
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
