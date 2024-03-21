import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaQrcode, FaRegCreditCard } from "react-icons/fa";
import { FaArrowLeftLong, FaBarcode } from "react-icons/fa6";
import Barcode from "react-barcode";
import { MdContentCopy, MdDownload } from "react-icons/md";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import useContexts from "../../../hooks/useContexts";
import {api_financeiro} from '../../../services/pagBank';

import "./pagamento.css";

export default function Pagamento() {
  const [pagamento, setPagamento] = useState("CARTAO_CREDITO");
  const [resumo, setResumo] = useState(null);
  const [itens, setItens] = useState([]);
  const [cartao, setCartao] = useState(false);
  const [dadosCartao, setDadosCartao] = useState(null);
  const [dadosPix, setDadosPix] = useState(null);
  const [dadosBoleto, setDadosBoleto] = useState(null);
  const [boleto, setBoleto] = useState(false);
  const [pix, setPix] = useState(false);
  const [cupom, setCupom] = useState("");
  const [total, setTotal] = useState(null);
  const [valorComDesconto, setValorComDesconto] = useState(null);
  const [desconto, setDesconto] = useState(null);
  const [numeroDoBoleto, setNumeroBoleto] = useState(null);
  const [urlBoleto, setUrlBoleto] = useState(null);
  const [codigoPix, setCodigoPix] = useState(null);
  const [imgPix, setImgPix] = useState(null);
  const buttonBoleto = useRef(null);
  const buttonPix = useRef(null);
  const closeModalPix = useRef(null);
  const closeModalBoleto = useRef(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { client, dadosPagamentoCartao } = useContexts();

  async function getResumo(resumo) {
    const pedido = await localStorage.getItem("@csh-resumo-compra");
    const itens = await localStorage.getItem("@csh-itens-carrinho");
    const objetoPedido = JSON.parse(pedido);
    const objItens = JSON.parse(itens);
    console.log(objetoPedido);
    setResumo(objetoPedido);
    setItens(objItens);
    await axios
      .post(
        api_financeiro + `/forma/pagamento/valores`,
        resumo ? resumo : objetoPedido
      )
      .then((response) => {
        console.log(response.data)
        const data = response.data.retorno.pagamentos;
        if (resumo && response.data.retorno.voucherValido) {
          toast.success("Aplicado com sucesso!");
        } else if (resumo && !response.data.retorno.voucherValido) {
          toast.error("Cupom inválido!");
        }

        const aceitaPix = data.some(
          (pagamento) => pagamento.tipo === "PIX" && pagamento.ativo
        );
        const aceitaBoleto = data.some(
          (pagamento) => pagamento.tipo === "BOLETO" && pagamento.ativo
        );
        const aceitaCartao = data.some(
          (pagamento) => pagamento.tipo === "CARTAO_CREDITO" && pagamento.ativo
        );

        const dadosCart = data.find(
          (pagamento) => pagamento.tipo === "CARTAO_CREDITO"
        );
        const dadosBo = data.find((pagamento) => pagamento.tipo === "BOLETO");
        const dadosPi = data.find((pagamento) => pagamento.tipo === "PIX");

        setDadosCartao(dadosCart);
        dadosPagamentoCartao(dadosCart);

        setDadosPix(dadosPi);
        setDadosBoleto(dadosBo);

        setPix(aceitaPix);
        setBoleto(aceitaBoleto);
        setCartao(aceitaCartao);

        if (pagamento === "CARTAO_CREDITO") {
          setTotal(dadosCart.valor);
          setValorComDesconto(dadosCart.valorComDesconto);
          setDesconto(dadosCart.valorDesconto);
        } else if (pagamento === "BOLETO") {
          setTotal(dadosBo.valor);
          setValorComDesconto(dadosBo.valorComDesconto);
          setDesconto(dadosBo.valorDesconto);
        } else if (pagamento === "PIX") {
          setTotal(dadosPi.valor);
          setValorComDesconto(dadosPi.valorComDesconto);
          setDesconto(dadosPi.valorDesconto);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erro na requisição.");
      });
  }

  useEffect(() => {
    getResumo();
  }, []);

  async function fazerPagamento(resumo) {
    setLoading(true);

    if (pagamento === "CARTAO_CREDITO") {
      navigate("cartao");
    } else {
      const objeto = {
        ...resumo,
        idCliente: client.idCliente,
        formaPagamento: pagamento,
      };
      console.log(objeto);
      await axios
        .post(
          api_financeiro + `/pagamento/pagbank/pedido`,
          objeto
        )
        .then(async (response) => {
          const data = response.data.retorno;
          console.log(response.data);
          setLoading(false);
          if (data.urlBoleto) {
            setNumeroBoleto(data.barCode);
            setUrlBoleto(data.urlBoleto);
            if (buttonBoleto.current) {
              buttonBoleto.current.click();
            }
          } else if (data.codigoPix) {
            setCodigoPix(data.codigoPix);
            setImgPix(data.imgQrCodePix);
            if (buttonPix.current) {
              buttonPix.current.click();
            }

            const checkPaymentStatus = async () => {
              try {
                const response = await axios.get(
                  api_financeiro + `/pedido/status?idPedido=${data.idPedidoLoja}`,
                  objeto
                );

                if (
                  response.data.sucesso &&
                  response.data.retorno.status === "P"
                ) {
                  if (closeModalPix.current) {
                    closeModalPix.current.click();
                  }
                  localStorage.setItem(
                    "@csh-resumo-compra",
                    JSON.stringify(null)
                  );
                  localStorage.setItem(
                    "@csh-dados-pagamento",
                    JSON.stringify(null)
                  );
                  localStorage.setItem(
                    "@csh-itens-carrinho",
                    JSON.stringify(null)
                  );
                  setResumo(null);
                  navigate("/pg-sucesso", { replace: true });
                } else {
                  setTimeout(checkPaymentStatus, 1000);
                }
              } catch (error) {
                console.log(error);
              }
            };

            setTimeout(checkPaymentStatus, 1000);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erro na requisição.");
          setLoading(false);
        });
    }
  }
  function fechaModalBoleto() {
    if (closeModalBoleto.current) {
      closeModalBoleto.current.click();
    }
  }
  async function aplicarCupom(cupom) {
    const novoResumo = {
      ...resumo,
      voucher: cupom,
    };
    setResumo(novoResumo);
    localStorage.setItem("@csh-resumo-compra", JSON.stringify(novoResumo));
    await getResumo(novoResumo).then(() => {
      setCupom("");
    });
  }

  async function baixarBoleto() {
    window.open(urlBoleto, "_blank");
  }

  function copiarBoleto() {
    navigator.clipboard.writeText(numeroDoBoleto).then(() => {
      toast.success("Número do boleto copiado!");
    });
  }

  function copiarPix() {
    navigator.clipboard.writeText(codigoPix).then(() => {
      toast.success("Código pix copiado!");
    });
  }

  const partesDoNome = client.nome.split(" ");

  const primeiroNome = partesDoNome[0];

  return (
    <section className="container-cli container-cartao">
      <div
        className="content-cartao text-dark-emphasis"
        style={{ width: "100%" }}
      >
        <div className="formas-pagamento col-md-6">
          <div>
            <Link
              className="btn btn-primary ps-3 rounded-pill d-flex align-items-center mb-3 link-voltar"
              to="/carrinho"
            >
              <FaArrowLeftLong size={20} className="me-3" />
              Voltar para o carrinho
            </Link>
          </div>
          <div>
            <h1>Ok, {primeiroNome}</h1>
            <p className="fs-5 mb-4">
              Chegamos na ultima parte. Faltam apenas os dados de pagamento :)
            </p>
            <p className="fs-4">Como você quer pagar?</p>
            {cartao && (
              <div className="card col-8 rounded-4 mb-3 p-3 px-4 border-0">
                <div className="form-check d-flex align-items-center">
                  <input
                    className="form-check-input fs-5"
                    type="radio"
                    name="formaPg"
                    id="pgCartao"
                    value="CARTAO_CREDITO"
                    checked={pagamento === "CARTAO_CREDITO"}
                    onChange={(e) => {
                      setPagamento(e.target.value);
                      setTotal(dadosCartao.valor);
                      setValorComDesconto(dadosCartao.valorComDesconto);
                      setDesconto(dadosCartao.valorDesconto);
                    }}
                  />
                  <div className="text-forma-pg ms-4 d-flex align-items-center gap-4">
                    <FaRegCreditCard size={30} />
                    <div>
                      <label
                        className="form-check-label fs-3 fw-bold"
                        htmlFor="pgCartao"
                      >
                        Cartão de Crédito
                      </label>
                      <p className="fs-5 mb-0">
                      R${dadosCartao.valor.toFixed(2).replace(".", ",")} em até 10x 
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {boleto && (
              <div className="card col-8 rounded-4 mb-3 p-3 px-4 border-0">
                <div className="form-check d-flex align-items-center">
                  <input
                    className="form-check-input fs-5"
                    type="radio"
                    value="BOLETO"
                    name="formaPg"
                    id="pgBoleto"
                    onChange={(e) => {
                      setPagamento(e.target.value);
                      setTotal(dadosBoleto.valor);
                      setValorComDesconto(dadosBoleto.valorComDesconto);
                      setDesconto(dadosBoleto.valorDesconto);
                    }}
                  />
                  <div className="text-forma-pg ms-4 d-flex align-items-center gap-4">
                    <FaBarcode size={30} />
                    <div>
                      <label
                        className="form-check-label fs-3 fw-bold"
                        htmlFor="pgBoleto"
                      >
                        Pagamento por Boleto
                      </label>
                      <p className="fs-5 mb-0">
                        R${dadosBoleto.valor.toFixed(2).replace(".", ",")} à
                        vista
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {pix && (
              <div className="card col-8 rounded-4 p-3 px-4 border-0">
                <div className="form-check d-flex align-items-center">
                  <input
                    className="form-check-input fs-5"
                    type="radio"
                    name="formaPg"
                    value="PIX"
                    id="pgPix"
                    onChange={(e) => {
                      setPagamento(e.target.value);
                      setTotal(dadosPix.valor);
                      setValorComDesconto(dadosPix.valorComDesconto);
                      setDesconto(dadosPix.valorDesconto);
                    }}
                  />
                  <div className="text-forma-pg ms-4 d-flex align-items-center gap-4">
                    <FaQrcode size={30} />
                    <div>
                      <label
                        className="form-check-label fs-3 fw-bold"
                        htmlFor="pgPix"
                      >
                        Pagamento por Pix
                      </label>
                      <p className="fs-5 mb-0">
                        R${dadosPix.valor.toFixed(2).replace(".", ",")} à vista
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <section className="mt-2 col-md-5">
          <div className="area-cupom mb-4 col-10 mx-auto">
            <label
              htmlFor="cupom"
              className="form-label text-secondary-emphasis fw-semibold"
            >
              Cupom de desconto
            </label>
            <div className="d-flex">
              <input
                type="tel"
                autoComplete="off"
                className="form-control me-4"
                id="cupom"
                style={{ width: "60%" }}
                placeholder="Digite seu cupom"
                value={cupom}
                onChange={(e) => setCupom(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary btn-aplicar fw-bolder"
                onClick={() => aplicarCupom(cupom)}
              >
                Aplicar
              </button>
            </div>
          </div>
          <div className="col-11 rounded-5 d-flex flex-column resumo-pagamento mx-auto">
            <h4 className="fw-semibold mb-0 text-center" style={{ color: "" }}>
              Resumo do pedido
            </h4>
            <hr />
            <span className="d-flex flex-column">
              <div className="d-flex justify-content-between mb-3">
                <h4 className="fw-normal">Itens: </h4>
              </div>
              {itens.map((curso) => {
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
            </span>
            <hr />
            <span className="d-flex justify-content-between">
              <h4 className="fw-normal">Subtotal:</h4>
              <h4 className="fw-normal">
                R${" "}
                {total !== null ? total.toFixed(2).replace(".", ",") : "Null"}
              </h4>
            </span>
            <hr />
            <span className="d-flex justify-content-between">
              <h4 className="fw-normal">Desconto:</h4>
              <h4 className="fw-normal">
                R${" "}
                {desconto !== null
                  ? desconto.toFixed(2).replace(".", ",")
                  : "ERRO"}
              </h4>
            </span>
            <hr />
            <span className="d-flex justify-content-between">
              <h4 className="mb-0 fw-normal">Valor total: </h4>
              <h4 className="mb-0">
                R${" "}
                {valorComDesconto !== null
                  ? valorComDesconto.toFixed(2).replace(".", ",")
                  : "ERRO"}
              </h4>
            </span>
            <p className="text-center info-mudanca text-danger">
              Valor sujeito à alteração conforme opção de pagamento.
            </p>
            <div className="d-flex btns btns-carrinho justify-content-end mt-4">
              {loading ? (
                <button
                  className="btn btn-pg rounded-pill btn-primary fs-5 px-4"
                  style={{ height: "46px", width: "100%" }}
                  type="button"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden" role="status">
                    Loading...
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => fazerPagamento(resumo)}
                  className="btn btn-pg rounded-pill btn-primary fs-5 px-4"
                  style={{ height: "46px", width: "100%" }}
                >
                  Fazer pagamento
                </button>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Botao Pix */}
      <button
        type="button"
        ref={buttonPix}
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#modalPix"
        hidden={true}
      >
        pix
      </button>

      {/* Botao Boleto */}
      <button
        type="button"
        ref={buttonBoleto}
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#modalBoleto"
        hidden={true}
      >
        boleto
      </button>

      {/* Modal Pix */}
      <div
        className="modal fade"
        id="modalPix"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg modal-pix">
          <div className="modal-content">
            <div className="modal-header">
              <p className="modal-title fs-5" id="staticBackdropLabel">
                Escaneie o <strong>QR code</strong> ou copie o{" "}
                <strong>Código PIX</strong>.
              </p>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                ref={closeModalPix}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body py-5 d-flex flex-column justify-content-center gap-5 align-items-center">
              <div
                className="border border-secondary rounded p-3"
                style={{
                  boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)",
                }}
              >
                {/* <QRCode size={280} value={imgPix} /> */}
                <img src={imgPix} alt="Imagem de pagamento" id="img-pix" />
              </div>
              <button
                className="btn rounded-pill btn-primary fs-5 px-4"
                style={{ height: "43px", width: "50%" }}
                onClick={copiarPix}
              >
                Copiar Código Pix
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Boleto */}
      <div
        className="modal fade"
        id="modalBoleto"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg modal-boleto">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Boleto gerado com sucesso!
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={closeModalBoleto}
              ></button>
            </div>
            <div className="modal-body py-5 d-flex flex-column justify-content-center align-items-center">
              <p>
                Utilize o número do código de barras para realizar o pagamento
                da sua compra.
              </p>
              <Barcode size={300} value={numeroDoBoleto} />
              <div className="mt-4 btns btns-boleto btns-carrinho">
                <button className="btn btn-primary" onClick={copiarBoleto}>
                  <MdContentCopy size={22} className="me-2" /> Copiar Boleto
                </button>
                <button className="btn btn-primary" onClick={baixarBoleto}>
                  <MdDownload size={22} className="me-2" /> Baixar Boleto
                </button>
              </div>
              <Link
                className="btn btn-secondary mt-5 mb-2"
                onClick={fechaModalBoleto}
                to="/minha-conta/historico-de-compras"
              >
                Ver status do pedido
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
