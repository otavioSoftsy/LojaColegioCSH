import { useEffect, useRef, useState } from "react";
import useContexts from "../../hooks/useContexts";
import { Link, useNavigate } from "react-router-dom";
import ModalTermos from "../../components/ModalTermos";
import ArticleCurso from "../../components/ArticleCurso";
import { toast } from "react-toastify";
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineAccessTime } from "react-icons/md";
import ModalCadastraAluno from "../../components/ModalCadastraAluno";
import axios from "axios";
import "./carrinho.css";

export default function Carrinho() {
  const [cursos, setCursos] = useState([]);
  const btnModalCadastro = useRef(null);
  const [alunos, setAlunos] = useState([]);
  const [total, setTotal] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [accepted2, setAccepted2] = useState(false);
  const [accepted3, setAccepted3] = useState(false);
  const btnModal = useRef(null);
  const btnForm = useRef(null);
  const btnAlert = useRef(null);
  const btnCloseAlert = useRef(null);

  const { clientLogado, client } = useContexts();
  const navigate = useNavigate();
  const articleCursoRef = useRef();

  useEffect(() => {
    const meuCarrinho = localStorage.getItem("@csh-itens-carrinho");
    const carrinhoItens = JSON.parse(meuCarrinho) || [];
    setCursos(carrinhoItens);

    const subtotalCalculado = carrinhoItens.reduce(
      (acc, curso) => acc + curso.valor * curso.quantidade,
      0
    );

    const desconto = 0;
    const totalCalculado = subtotalCalculado - desconto;
    setTotal(totalCalculado);
    if (!clientLogado && btnAlert.current) {
      btnAlert.current.click();
    }
  }, []);

  async function getAlunos() {
    await axios
      .get(
        `https://api-captacao.sumare.edu.br/api-csh-alunos/listaAlunosCsh?cpf=${
          client ? client.cpf : null
        }`
      )
      .then((response) => {
        if (response.status === 200) {
          setAlunos(response.data);
          console.log(response);
        } else {
          console.log(response);
          toast.error("Erro ao buscar alunos.");
        }
      });
  }

  function handleQuantidadeChange(idCurso, novaQuantidade) {
    setCursos((cursosAntigos) => {
      const novoCarrinho = cursosAntigos.map((curso) =>
        curso.id === idCurso ? { ...curso, quantidade: novaQuantidade } : curso
      );

      const subtotalCalculado = novoCarrinho.reduce(
        (acc, curso) => acc + curso.valor * curso.quantidade,
        0
      );

      const desconto = subtotalCalculado * 0;
      const totalCalculado = subtotalCalculado - desconto;
      setTotal(totalCalculado);

      return novoCarrinho;
    });
  }

  function fechaModal() {
    if (btnCloseAlert.current) {
      btnCloseAlert.current.click();
    }
  }
  function deletarCurso(id) {
    setCursos((cursosAntigos) => {
      const filtroCursos = cursosAntigos.filter((item) => item.id !== id);

      localStorage.setItem("@csh-itens-carrinho", JSON.stringify(filtroCursos));

      const subtotalCalculado = filtroCursos.reduce(
        (acc, curso) => acc + curso.valor * curso.quantidade,
        0
      );

      const desconto = subtotalCalculado * 0;
      const totalCalculado = subtotalCalculado - desconto;
      setTotal(totalCalculado);

      return filtroCursos;
    });
  }

  function limparCarrinho() {
    setCursos([]);
    localStorage.removeItem("@csh-itens-carrinho");

    setTotal(0);
  }

  function showModal(e) {
    e.preventDefault();
    if (clientLogado) {
      setAccepted(false);
      setAccepted2(false);
      setAccepted3(false);
      if (btnModal.current) {
        btnModal.current.click();
      } else {
        navigate("/minha-conta/entrar");
      }
    }
  }
  function showModalCadastro() {
    if (btnModalCadastro.current) {
      btnModalCadastro.current.click();
    }
  }

  function handleCheckbox() {
    setAccepted(!accepted);
  }
  function handleCheckbox2() {
    setAccepted2(!accepted2);
  }
  function handleCheckbox3() {
    setAccepted3(!accepted3);
  }
  const adicionarNovoAluno = (cursoIndex, novoAluno) => {
    setCursos((cursosAnteriores) => {
      const indexCurso = cursosAnteriores.findIndex(
        (curso) => curso.id === cursoIndex
      );

      if (indexCurso !== -1) {
        const novosCursos = [...cursosAnteriores];
        const cursoEncontrado = novosCursos[indexCurso];

        cursoEncontrado.alunos = cursoEncontrado.alunos || [];

        const alunoExistente = cursoEncontrado.alunos.some(
          (aluno) => aluno.idAluno === novoAluno
        );

        if (!alunoExistente) {
          cursoEncontrado.alunos = [
            ...cursoEncontrado.alunos,
            { idAluno: novoAluno },
          ];
        }

        return novosCursos;
      }

      return cursosAnteriores;
    });
  };

  function enviaTermos() {
    console.log(cursos);
    if (accepted && accepted2 && accepted3) {
      btnModal.current.click();
      let resumo = {
        itens: cursos.map((item) => {
          return {
            idCurso: item.id,
            qtd: item.quantidade,
            alunos: item.alunos,
          };
        }),
        voucher: null,
        dtAceiteTermos: new Date(),
      };
      localStorage.setItem("@csh-itens-carrinho", JSON.stringify(cursos));
      localStorage.setItem("@csh-resumo-compra", JSON.stringify(resumo));

      navigate("/carrinho/pagamento");
    } else {
      btnModal.current.click();
      toast.warning("Aceite os termos para continuar a compra.");
    }
  }
  function acionaForm() {
    if (btnForm.current) {
      btnForm.current.click();
    }
  }

  return (
    <section id="#carrinho" className="container-cli carrinho">
      <div className="col-12 title-carrinho d-flex justify-content-between">
        <h2 className="mb-0">Meu carrinho</h2>

        <div className="d-flex gap-3">
          <Link
            className="btn btn-sm rounded-pill btn-secondary text-white px-3 d-flex align-items-center justify-content-center"
            to="/minha-conta/historico-de-compras"
          >
            <MdOutlineAccessTime className="me-2" size={22} />
            Histórico de compras
          </Link>
          <Link
            className="btn btn-sm rounded-pill btn-danger px-3 d-flex align-items-center justify-content-center"
            onClick={limparCarrinho}
          >
            <FiShoppingCart size={20} className="me-2" />
            Limpar carrinho
          </Link>
        </div>
      </div>
      <hr />

      {cursos.length === 0 ? (
        <h1 className="msg-carrinho text-center mt-5">
          Você não possui itens no carrinho :(
        </h1>
      ) : (
        <form onSubmit={showModal} className="itens-resumo py-4 d-flex">
          <section className="itens d-flex flex-column gap-4 col-8">
            {cursos.map((curso) => {
              return (
                <ArticleCurso
                  atualizarAluno={adicionarNovoAluno}
                  ref={articleCursoRef}
                  key={curso.id}
                  idCurso={curso.id}
                  modalidade={curso.modalidade}
                  nomeCurso={curso.nome}
                  periodicidade={curso.periodicidade}
                  categorias={curso.areas}
                  valor={curso.valor}
                  icone={curso.icone}
                  cor={curso.cor}
                  quantidade={curso.quantidade}
                  onQuantidadeChange={(novaQuantidade) =>
                    handleQuantidadeChange(curso.id, novaQuantidade)
                  }
                  onDelete={deletarCurso}
                  exibeModalCadastro={showModalCadastro}
                  getAlunos={getAlunos}
                  alunos={alunos}
                />
              );
            })}
          </section>

          <section
            className="d-flex flex-column resumo-pedido gap-3 pb-3"
            style={{ width: "100%" }}
          >
            <div
              className="text-center py-3"
              style={{ backgroundColor: "#EEEEEE" }}
            >
              <h4 className="title-resumo fw-semibold mb-0">
                Resumo do pedido
              </h4>
            </div>
            <span className="d-flex flex-column px-3 ">
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-normal">Itens: </h5>
              </div>
              {cursos.map((curso) => {
                return (
                  <div
                    className="d-flex justify-content-between itens"
                    key={curso.id}
                  >
                    <p className="fw-normal">{curso.quantidade} x</p>
                    <div className="col-9">
                      <p className="fw-normal">{curso.nome}</p>
                    </div>
                    <p className="fw-normal">
                      R${" "}
                      {(curso.quantidade * curso.valor)
                        .toFixed(2)
                        .replace(".", ",")}
                    </p>
                  </div>
                );
              })}
              <hr />
            </span>
            <span className="d-flex justify-content-between px-3">
              <h5 className="mb-0 fw-normal">Valor total</h5>
              <h5 className="mb-0">R$ {total.toFixed(2).replace(".", ",")}</h5>
            </span>
            <p className="text-center text-danger info-mudanca mt-2 mb-0">
              Valor sujeito à alteração conforme opção de pagamento.
            </p>
            <div className="abracaFlex btns btns-carrinho justify-content-between mt-3 px-3">
              <Link
                to="/atividades"
                className="btn rounded-pill btn-secondary px-3"
              >
                Continuar comprando
              </Link>
              <Link
                onClick={acionaForm}
                className="btn btn-a rounded-pill btn-primary px-4"
              >
                Prosseguir compra
              </Link>
              <button type="submit" hidden ref={btnForm}></button>
            </div>
          </section>
        </form>
      )}
      <button
        type="button"
        className="btn btn-primary"
        ref={btnModal}
        data-bs-toggle="modal"
        data-bs-target="#modalTermos"
        hidden={true}
      ></button>
      <button
        type="button"
        className="btn btn-primary"
        ref={btnModalCadastro}
        data-bs-toggle="modal"
        data-bs-target="#modalCadastro"
        hidden={true}
      ></button>
      <button
        type="button"
        className="btn btn-primary"
        ref={btnAlert}
        data-bs-toggle="modal"
        data-bs-target="#modalAlert"
        hidden={true}
      ></button>

      <div
        className="modal fade"
        id="modalAlert"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Faça o login!
              </h1>

              <button
                type="button"
                className="btn-close"
                ref={btnCloseAlert}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              Para realizar a compra das atividades eletivas, por favor, realize
              o login em sua conta.
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Fechar
              </button>

              <Link
                className="btn btn-primary"
                to="/minha-conta/entrar"
                onClick={fechaModal}
              >
                Fazer login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ModalTermos
        enviaTermos={() => enviaTermos()}
        handleCheckbox={handleCheckbox}
        accepted={accepted}
        accepted2={accepted2}
        handleCheckbox2={handleCheckbox2}
        accepted3={accepted3}
        handleCheckbox3={handleCheckbox3}
      />
      <ModalCadastraAluno atualizaLista={getAlunos} />
    </section>
  );
}
