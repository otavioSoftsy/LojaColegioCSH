/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import axios from "axios";
import { url_base } from "../../services/apis";
import useContexts from "../../hooks/useContexts";
import { toast } from "react-toastify";

export default function ModalCadastraAluno({ atualizaLista, atualizarAlunos }) {
  const [isAluno, setIsAluno] = useState("S");
  const [matricula, setMatricula] = useState(null);
  const [rg, setRg] = useState("");
  const [nome, setNome] = useState("");
  const [nomeAlunoExterno, setNomeAlunoExterno] = useState("");
  const btnClose = useRef(null);

  async function cadastrar(e) {
    e.preventDefault();
    const alunoExterno = {
      nome: nomeAlunoExterno,
      rg
    };

    if (isAluno === "S") {
      getAluno(matricula);
    }

    if (rg && nomeAlunoExterno) {
      await axios
        .post(url_base + "alunos", alunoExterno)
        .then((response) => {
          toast.success("Vinculado com sucesso.");
          setMatricula("");
          setRg("");
          setNomeAlunoExterno("");
          atualizarAlunos();
        })
        .catch((erro) => {
          console.log(erro);
          toast.error("Erro ao cadastrar aluno.");
          setMatricula("");
          setRg("");
          setNomeAlunoExterno("");
        });
    }
  }

  function sucesso(aluno) {
    toast.success("Vinculado com sucesso.");
    atualizaLista(aluno);

    setTimeout(() => {
      setMatricula("");
      setRg("");
      setNome("");
      if (btnClose.current) {
        btnClose.current.click();
      }
    }, 2000);
  }

  async function getAluno(id) {
    await axios
      .get(
        `https://api-captacao.sumare.edu.br/api-csh-alunos/buscarAlunoCsh?aluno=${id}`
      )
      .then((response) => {
        const data = response.data;
        if (data.length > 0) {
          setNome(data[0].nomeCompl);
          sucesso(data[0]);
        } else {
          setNome("");
          toast.warn("Aluno não encontrado.");
        }
      });
  }

  return (
    <>
      <div
        className="modal fade"
        id="modalCadastro"
        tabIndex="-1"
        aria-labelledby="modalCadastro"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="m-0 fw-normal">Informe os dados abaixo:</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={btnClose}
              ></button>
            </div>
            <div className="modal-body btns-termos px-3 py-4 d-flex flex-column">
              <form className="col-12 mb-4" onSubmit={cadastrar}>
                <div className="d-flex gap-2">
                  <p>O beneficiário é aluno do colégio?</p>
                  <div className="form-check form-check-inline">
                    <input
                      required
                      className="form-check-input"
                      type="radio"
                      name="isAluno"
                      id="alunoSim"
                      value="S"
                      checked={isAluno === "S"}
                      onChange={(e) => setIsAluno(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="alunoSim">
                      Sim
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      required
                      className="form-check-input"
                      type="radio"
                      name="isAluno"
                      id="alunoNao"
                      value="N"
                      checked={isAluno === "N"}
                      onChange={(e) => setIsAluno(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="alunoNao">
                      Não
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-5 mb-3">
                    {isAluno === "S" ? (
                      <NumericFormat
                        allowNegative={false}
                        decimalScale={0}
                        id="matricula"
                        required
                        name="matricula"
                        placeholder="Matrícula"
                        autoComplete="off"
                        maxLength={8}
                        className="form-control inputForm"
                        value={matricula}
                        onChange={(e) => {
                          setMatricula(e.target.value);
                        }}
                      />
                    ) : (
                      <NumericFormat
                        allowNegative={false}
                        decimalScale={0}
                        id="rg"
                        required
                        name="rg"
                        maxLength={9}
                        placeholder="RG"
                        autoComplete="off"
                        className="form-control inputForm"
                        value={rg}
                        onChange={(e) => setRg(e.target.value)}
                      />
                    )}
                  </div>
                  <div className="col-7 mb-3">
                    {isAluno === "S" ? (
                      <input
                        type="text"
                        className="form-control"
                        id="nome"
                        required
                        readOnly={isAluno === "S"}
                        placeholder="Nome completo"
                        autoComplete="off"
                        value={nome}
                        onFocus={() => {
                          getAluno(matricula);
                        }}
                        onChange={(e) => setNome(e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        id="nomeAlunoExterno"
                        required
                        placeholder="Nome completo"
                        autoComplete="off"
                        value={nomeAlunoExterno}
                        onChange={(e) => setNomeAlunoExterno(e.target.value)}
                      />
                    )}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-sm px-4">
                  Vincular
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
