/* eslint-disable react/prop-types */

import TermosDeUso from "../TermosDeUso";
import "./modaltermos.css";

export default function ModalTermos({
  enviaTermos,
  handleCheckbox,
  accepted,
  accepted2,
  handleCheckbox2,
  accepted3,
  handleCheckbox3,
}) {
  return (
    <>
      <div
        className="modal fade"
        id="modalTermos"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div id="btns-termos" className="modal-body py-5 d-flex flex-column align-items-center text-dark">
              <h1>Termos de Contrato</h1>
              <button
                type="button"
                className="btn btn-primary my-5 fs-5 px-4"
                data-bs-toggle="modal"
                data-bs-target="#termos"
              >
                Clique para abrir
              </button>
              <div className="col-10 my-5 d-flex flex-column align-items-start">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                    checked={accepted}
                    onChange={handleCheckbox}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Li e concordo com os termos acima.
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="check2"
                    checked={accepted2}
                    onChange={handleCheckbox2}
                  />
                  <label className="form-check-label" htmlFor="check2">
                    Estou certo que conferi que a atividade relacionada está de
                    acordo com a faixa etária, ano/série do meu filho.
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="check2"
                    checked={accepted3}
                    onChange={handleCheckbox3}
                  />
                  <label className="form-check-label" htmlFor="check2">
                    Em caso de atividade com pré-requisito tecnico(convocados) á
                    adesão da atividade só deve ser feita se seu filho foi
                    preveamente comunicado pelo coordenador da modalidade,
                    atentando-se ao código correto da turma.
                  </label>
                </div>
              </div>
              <button
                className="btn btn-primary my-5 fs-5 px-4"
                onClick={enviaTermos}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
      <TermosDeUso
        handleCheckbox={handleCheckbox}
        handleCheckbox2={handleCheckbox2}
        handleCheckbox3={handleCheckbox3}
      />
    </>
  );
}
