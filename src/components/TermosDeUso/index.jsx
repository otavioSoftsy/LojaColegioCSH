/* eslint-disable react/prop-types */
import "./termos.css";

export default function TermosDeUso({
  handleCheckbox,
  handleCheckbox2,
  handleCheckbox3,
}) {
  return (
    <div
      className="modal fade"
      id="termos"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
        <div className="modal-content" style={{ backgroundColor: "#fff" }}>
          <div className="modal-body btns-termos p-5 text-dark area-termos">
            <div className="termos-texto">
              <h4 className="text-center mb-3">
                PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS COMPLEMENTARES E OPCIONAIS
                TERMO DE ACEITE
              </h4>
              <p>
                Pela presente, o CONTRATANTE, na qualidade de representante
                legal pelo menor ESTUDANTE vinculado ao COLÉGIO GDV DECLARA,
                para todos os fins de direito e a quem possa interessar, deter
                ciência plena quanto à sistemática operacional relacionada às
                aulas e demais atividades conduzidas, na própria instituição de
                ensino, a título de “CURSOS LIVRES ELETIVOS”, os quais são
                orquestrados, estruturados e administrados pela Associação de
                Pais e Mestres (APM) local, a qual persegue, com tais práticas,
                os seus próprios fins em termos de execução de atos relacionados
                à melhoria continuada do ensino ofertado àquela comunidade
                estudantil.
              </p>
              <p>
                Ademais, resta estabelecido que o CONTRATANTE detém ciência e
                anui, completa e expressamente, quanto às regras aplicáveis a
                tais modalidades de eletivas, atestando que:
              </p>
              <ul>
                <p>
                  • A contratação em questão se faz de modo autônomo e opcional,
                  conforme as modalidades e/ou práticas de interesse do menor
                  estudante, tudo conforme regras, dias e/ou horários de aulas e
                  valores aplicáveis a cada uma delas, em específico;
                </p>
                <p>
                  • A gerência de tais práticas culturais, recreativas e/ou
                  esportivas é de responsabilidade única da APM, cabendo à
                  instituição de ensino denominada Colégio Guilherme Dumont
                  Villares apenas e tão somente fomentar tais práticas em
                  contraturno, fornecendo à instituição sua parceira os
                  subsídios em termos estruturais, cessão de espaço e de
                  materiais de uso comum e/ou coletivo para que tais atividades
                  possam de fato lá ocorrer.
                </p>
                <p>
                  • Diante das especificidades de cada modalidade eletiva, cabe
                  ao CONTRATANTE sinalizar, prévia e expressamente, eventual
                  limitação e/ou impossibilidade excepcional do aluno em
                  participar, temporária ou efetivamente, de tais aulas e/ou
                  atividades físicas, posto que a matrícula do mesmo à eletiva
                  pressupõe, para todos os fins, condição de saúde compatível do
                  aluno para dela participar.
                </p>
                <p>
                  • A presente contratação se dá de modo acessório à contratação
                  dos serviços educacionais havidos na instituição de ensino
                  denominada Colégio Guilherme Dumont Villares, de modo que,
                  assim, persistirão, durante todo o período em que o estudante
                  estiver no colégio as regras preexistentes e ditadas a título
                  de Regimento Interno, Manual de Conduta e, também, afeitas ao
                  Contrato de Prestação de Serviços educacionais originalmente
                  firmado pelo CONTRATANTE.
                </p>
                <p>
                  • Por fim, o CONTRATANTE autoriza que sejam captadas imagens
                  (individuais e/ou grupais) e/ou voz do estudante durante a
                  prática de tais modalidades eletivas, podendo as mesmas serem
                  eventualmente tratadas e publicadas nos diversos veículos de
                  comunicação interna da APM ou mesmo do Colégio GDV (inclusive
                  em redes sociais) para fins de atualizações institucionais
                  e/ou informações das práticas objetos de tais cursos livres.
                </p>
              </ul>
              <p>
                Isto posto, afirmando a veracidade plena do todo supraticado,
                firma-se a presente.
              </p>
            </div>

            <div className="col-12 text-center">
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#modalTermos"
                onClick={() => {
                  handleCheckbox();
                  handleCheckbox2();
                  handleCheckbox3();
                }}
                className="btn btn-primary px-4"
              >
                Concordo e Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
