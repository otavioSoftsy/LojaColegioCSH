/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import "./article.css";
import PropTypes from "prop-types";
import useContexts from "../../hooks/useContexts";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import {
  MdDelete,
  MdOutlineCalendarMonth,
  MdOutlineLocationOn,
} from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import ModalCadastraAluno from "../ModalCadastraAluno";
import axios from "axios";
import { toast } from "react-toastify";

ArticleCurso.propTypes = {
  nomeCurso: PropTypes.string.isRequired,
  modalidade: PropTypes.string.isRequired,
  periodicidade: PropTypes.string.isRequired,
  categorias: PropTypes.array,
  idCurso: PropTypes.number.isRequired,
  valor: PropTypes.number,
  cronogramas: PropTypes.array,
  icone: PropTypes.string,
  cor: PropTypes.string,
  onDelete: PropTypes.func,
  onQuantidadeChange: PropTypes.func,
  quantidade: PropTypes.number,
};

export default function ArticleCurso({
  idCurso,
  nomeCurso,
  categorias,
  modalidade,
  periodicidade,
  onDelete,
  onQuantidadeChange,
  quantidade,
  valor,
  icone,
  cor,
  atualizarAluno,
  exibeModalCadastro,
  getAlunos,
  alunos
}) {
  const [valorPeriodicidade, setValorPeriodicidade] = useState("");
  const [valoresSelecionados, setValoresSelecionados] = useState(['']);
  const { setCurso } = useContexts();
  const categoriasArray = categorias || [];
  const descricoes = categoriasArray.map((categoria) => categoria.descricao);
  const nomesSeparadosPorVirgula = descricoes.join(", ");
  const removerAcentos = (str) => {
    if (typeof str !== "string") {
      return "";
    }
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  const curso = removerAcentos(nomeCurso).toLowerCase().replace(/\s+/g, "-");

  const handleClick = (id) => {
    setCurso(id);
  };

  useEffect(() => {
    if (periodicidade === "U") {
      setValorPeriodicidade("Única");
    } else if (periodicidade === "S") {
      setValorPeriodicidade("Semanal");
    } else if (periodicidade === "M") {
      setValorPeriodicidade("Mensal");
    } else if (periodicidade === "D") {
      setValorPeriodicidade("Diária");
    }
    getAlunos();
  }, []);

  const handleOptionChange = (event, index) => {
    const selectedValue = event.target.value;
  
    if (selectedValue === "outro") {
      exibeModalCadastro()
    } else {
      atualizarAluno(idCurso, selectedValue);
      setValoresSelecionados((valoresAnteriores) => {
        const novosValores = [...valoresAnteriores];
        novosValores[index] = selectedValue;
        return novosValores;
      });
    }
  };


  // function valid() {
  //   const teste = valoresSelecionados.some(
  //     (valor) => valor === ""
  //   )

  //   if (teste) {
  //     toast.error('Campos vazio')
  //   }
  // }

  const validSelect = (index) => {
    const possuiDuplicatas =
      new Set(valoresSelecionados).size !== valoresSelecionados.length;

    if (possuiDuplicatas) {
      toast.error("Este aluno já esta vinculado!");
      setValoresSelecionados((valoresAnteriores) => {
        const novosValores = [...valoresAnteriores];
        novosValores.splice(index, 1);
        return novosValores;
      });
    }
  };

  let selects = [];

  for (let i = 0; i < quantidade; i++) {
    selects.push(
      <>
        <div key={i} className="col-12  mb-1">
          <select
            className="form-select form-select-sm"
            aria-label="Small select example"
            onChange={(e) => handleOptionChange(e, i)}
            required
            onBlur={() => validSelect(i)}
            value={valoresSelecionados[i] || ''}
          >
            <option disabled value="">
              Selecione um aluno
            </option>
            {alunos.map((item) => (
              <option key={item.aluno} value={item.
              aluno}>
                {item.aluno} - {item.nomeCompl}
              </option>
            ))}
            <option value="outro">Outro</option>
          </select>
        </div>
      </>
    );
  }

  return (
    <div className="card rounded-3 shadow article-curso bg-light-subtle">
      {/* <div className="area-article col-2">
        <div className="rounded-start-3" style={{ backgroundColor: `${cor}` }}>
          <FontAwesomeIcon icon={icone} />
        </div>
      </div> */}
      <div className="card-body card-carrinho px-4 gap-2">
        <Link to={`/atividades/${curso}`} onClick={() => handleClick(idCurso)}>
          <p className="fw-semibold mb-0 fs-6" style={{ color: "#F5B45D" }}>
            {nomeCurso}
          </p>
        </Link>
        <div
          className="d-flex align-items-center text-dark gap-2 article-spans flex-wrap"
          style={{ fontSize: "16px" }}
        >
          <span style={{ backgroundColor: cor, color: "#fff" }}>
            <FontAwesomeIcon icon={icone} /> {nomesSeparadosPorVirgula}
          </span>
          <span style={{ backgroundColor: cor, color: "#fff" }}>
            <MdOutlineLocationOn size={20} /> {modalidade}
          </span>
          <span style={{ backgroundColor: cor, color: "#fff" }}>
            <MdOutlineCalendarMonth size={20} /> {valorPeriodicidade}
          </span>
        </div>
        <span
          className="col-12 d-flex align-items-center flex-wrap"
          style={{ width: "100%" }}
        >
          {selects.map((select, index) => (
            <React.Fragment key={index}>{select}</React.Fragment>
          ))}
        </span>
      </div>
      <div
        id="area-valor"
        className="rounded-end-3 ps-4 pe-2"
        style={{ backgroundColor: "#EEEEEE" }}
      >
        <div className="btns-quantidade align-items-center">
          <div className="text-end rounded-pill px-3">
            <p className="valor-curso1">Valor anual</p>
            <p
              className="valor-curso fw-semibold mb-0"
              style={{ color: "#00A2A8", whiteSpace: "nowrap" }}
            >
              {valor !== null
                ? `R$ ${valor.toFixed(2).replace(".", ",")}`
                : "Grátis"}
            </p>
          </div>
          <div
            className="d-flex align-items-center fs-4 gap-2"
            style={{ color: "#00A2A8" }}
          >
            <FiMinusCircle
              size={24}
              onClick={() => onQuantidadeChange(Math.max(1, quantidade - 1))}
              style={{ cursor: "pointer" }}
            />
            {quantidade}
            <FiPlusCircle
              size={24}
              onClick={() => onQuantidadeChange(quantidade + 1)}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <MdDelete
          size={28}
          color="#dc3545"
          onClick={() => onDelete(idCurso)}
          className="mb-1"
          style={{ cursor: "pointer", alignSelf: "end" }}
        />
      </div>
    </div>
  );
}
