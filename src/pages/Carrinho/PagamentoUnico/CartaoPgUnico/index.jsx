import { useEffect, useState } from "react";
import axios from "axios";
import ReactInputMask from "react-input-mask";
import { FcSimCardChip } from "react-icons/fc";
import { PagSeguro } from "../../../../hooks/pagSeguro";
import { toast } from "react-toastify";
import { api_financeiro, public_key } from "../../../../services/pagBank";
import { useNavigate } from "react-router-dom";
import useContexts from "../../../../hooks/useContexts";
import "./cartaoUnico.css";

export default function CartaoPgUnico() {
  const [cardData, setCardData] = useState({
    cardHolder: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  });
  const [dadosPg, setDadosPg] = useState(null);
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itensCar, setItensCar] = useState([]);
  const [parcela, setParcela] = useState("");
  const [parcelas, setParcelas] = useState(null);
  const navigate = useNavigate();
  const { client } = useContexts();

  useEffect(() => {
    const pedido = JSON.parse(localStorage.getItem("@csh-resumo-compra"));
    const dadosPagamento = JSON.parse(
      localStorage.getItem("@csh-dados-pagamento")
    );
    if (dadosPagamento) {
      console.log(dadosPagamento);
      setDadosPg(dadosPagamento);
      setParcelas(dadosPagamento.parcelas);
    } else {
      return navigate("/");
    }
    const itens = JSON.parse(localStorage.getItem("@csh-itens-carrinho"));
    setResumo(pedido);
    setItensCar(itens);
  }, []);

  async function handleEncryptCard() {
    setLoading(true);
    const cardNumberWithoutSpaces = cardData.cardNumber.replace(/\s/g, "");

    const card = await PagSeguro.encryptCard({
      publicKey: public_key,
      holder: cardData.cardHolder,
      number: cardNumberWithoutSpaces,
      expMonth: cardData.expMonth,
      expYear: cardData.expYear,
      securityCode: cardData.cvv,
    });
    const encrypted = card.encryptedCard;
    const hasErrors = card.hasErrors;

    if (hasErrors) {
      toast.error("Revise os dados do cartão.");
      setLoading(false);
      const dados = {
        idCliente: client.idCliente,
        json: JSON.stringify(card),
      };
      await axios
        .post(api_financeiro + `/pagamento/pagbank/log/criptografia`, dados, {
          timeout: 5000,
        })
        .then((response) => {
          console.log(response);
        });
    } else {
      const cartao = {
        cartaoCript: encrypted,
        ultDigit: cardNumberWithoutSpaces.slice(-4),
        nomeCartao: cardData.cardHolder,
        cvv: cardData.cvv,
        numParcelas: Number(parcela),
      };
      fazerPagamento(cartao);
    }
  }

  async function fazerPagamento(cartao) {
    const objeto = {
      itens: resumo.itens,
      voucher: resumo.voucher,
      dtAceiteTermos: resumo.dtAceiteTermos,
      formaPagamento: "CARTAO_CREDITO",
      idCliente: client.idCliente,
      cartaoCredito: cartao,
    };
    await axios
      .post(api_financeiro + `/pagamento/pagbank/pedido`, objeto)
      .then((response) => {
        if (response.data.sucesso) {
          setLoading(false);
          navigate("/pg-sucesso");
          localStorage.setItem("@csh-resumo-compra", JSON.stringify(null));
          localStorage.setItem("@csh-dados-pagamento", JSON.stringify(null));
          localStorage.setItem("@csh-itens-carrinho", JSON.stringify(null));
          setDadosPg(null);
          setResumo(null);
          setItensCar(null);
        } else {
          setLoading(false);
          console.log(response);
          toast.error("Erro ao efetuar pagamento.");
        }
      });
  }

  const handleCardNumberChange = (e) => {
    const { value } = e.target;
    const formattedValue = value
      .replace(/\D/g, "")
      .replace(/(\d{4})(?=\d)/g, "$1 ");

    setCardData((prevData) => ({
      ...prevData,
      cardNumber: formattedValue,
    }));
  };

  function prev() {
    navigate("/carrinho/pagamento-unico");
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "expirationDate") {
      const [month, year] = value.split("/");
      setCardData((prevData) => ({
        ...prevData,
        expMonth: month,
        expYear: year,
        [name]: value,
      }));
    } else if (name === "cvv") {
      let valorSemEspaco = value.trim();
      setCardData((prevData) => ({
        ...prevData,
        [name]: valorSemEspaco,
      }));
    } else {
      setCardData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleBlur = () => {
    if (
      !isNaN(cardData.expYear) &&
      cardData.expYear >= 10 &&
      cardData.expYear < 100
    ) {
      cardData.expYear = "20" + cardData.expYear;
      cardData.expYear = cardData.expYear.trim();
    }
  };

  return (
    <section className="container-cli container-cartao">
      <div className="content-cartao" style={{ width: "100%" }}>
        <div className="custom-credit-card-form">
          <h2>Dados do Cartão</h2>
          <div className="sections">
            <div className="custom-form col-5">
              <h2>Cartão de Crédito</h2>
              <form>
                <label>
                  Número do Cartão
                  <input
                    type="tel"
                    className="col-12"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleCardNumberChange}
                    autoComplete="off"
                    maxLength={19}
                  />
                </label>
                <label>
                  Nome do Titular
                  <input
                    type="text"
                    className="col-12"
                    name="cardHolder"
                    autoComplete="off"
                    value={cardData.cardHolder}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                </label>
                <div className="d-flex area-validade">
                  <label>
                    Validade
                    <ReactInputMask
                      mask="99/9999"
                      maskChar=" "
                      type="text"
                      autoComplete="off"
                      name="expirationDate"
                      placeholder="00/0000"
                      value={cardData.expirationDate}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                    />
                  </label>
                  <label>
                    CVV
                    <ReactInputMask
                      mask="9999"
                      maskChar=" "
                      type="text"
                      autoComplete="off"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
              </form>
            </div>
            <div className="custom-card-preview">
              <div className="custom-card-display">
                <div className="custom-card">
                  <div className="custom-card-front">
                    <div className="custom-card-chip">
                      <FcSimCardChip size={55} />
                    </div>

                    <div className="custom-card-info gap-2">
                      <div className="custom-card-number">
                        {cardData.cardNumber || "XXXX XXXX XXXX XXXX"}
                      </div>
                      <div className="d-flex justify-content-between">
                        <div className="custom-card-holder d-flex flex-column">
                          {cardData.cardHolder || "TITULAR DO CARTÂO"}
                        </div>
                        <div className="custom-card-expiration d-flex flex-column">
                          {cardData.expirationDate || "MM/AA"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="custom-card-back">
                    <div className="custom-card-cvv">
                      {cardData.cvv || "CVV"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-form2">
            <div className="col-12 d-flex justify-content-between">
              <label>
                Parcela
                <select
                  name="parcela"
                  value={parcela}
                  style={{ outline: "none" }}
                  onChange={(e) => setParcela(e.target.value)}
                  required
                >
                  <option selected value="" disabled>
                    Selecione a Parcela
                  </option>
                  {parcelas &&
                    Array.from({ length: itensCar[0].parcelas }, (_, index) => {
                      const parcelaNumber = index + 1;
                      const valorParcela = (
                        dadosPg.valorPgto / parcelaNumber
                      )
                        .toFixed(2)
                        .replace(".", ",");
                      return (
                        <option key={parcelaNumber} value={parcelaNumber}>
                          {`Em até ${parcelaNumber}x de R$ ${valorParcela}`}
                        </option>
                      );
                    })}
                </select>
              </label>
            </div>
          </div>
        </div>
        <section className="gap-1 col-md-5 mt-2 d-flex rounded-5 flex-column resumo-pagamento">
          <h4 className="fw-semibold text-center">Resumo do pedido</h4>
          <hr />
          <span className="d-flex flex-column">
            <div className="d-flex justify-content-between mb-3">
              <h4 className="fw-normal">Itens: </h4>
            </div>
            {itensCar.map((curso) => {
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
          <hr className="mt-0" />
          <span className="d-flex justify-content-between">
            <h4 className="fw-normal"> Subtotal:</h4>
            <h4 className="fw-normal">
              R${" "}
              {dadosPg
                ? dadosPg.valorPgto?.toFixed(2).replace(".", ",")
                : ""}
            </h4>
          </span>
          <hr />
          <span className="d-flex justify-content-between">
            <h4 className="fw-normal"> Desconto:</h4>
            <h4 className="fw-normal">
              R${" "}
              {dadosPg
                ? dadosPg.valorDesconto?.toFixed(2).replace(".", ",")
                : ""}
            </h4>
          </span>
          <hr />
          <span className="d-flex justify-content-between">
            <h4 className="mb-0 fw-normal">Valor total:</h4>
            <h4 className="mb-0">
              R${" "}
              {dadosPg
                ? dadosPg.total?.toFixed(2).replace(".", ",")
                : ""}
            </h4>
          </span>
          <div className="mt-4">
            {loading ? (
              <button
                className="btn rounded-pill btn-primary mb-2 px-4"
                style={{ height: "40px", width: "100%" }}
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
                className="btn rounded-pill btn-primary mb-2 px-4"
                style={{ height: "40px", width: "100%" }}
                onClick={handleEncryptCard}
              >
                Fazer pagamento
              </button>
            )}

            <button
              className="btn rounded-pill btn-secondary px-4"
              style={{ height: "40px", width: "100%" }}
              onClick={prev}
            >
              Outras formas de pagamento
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}
