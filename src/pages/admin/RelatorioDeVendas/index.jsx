import ReactInputMask from "react-input-mask";

export default function RelatorioDeVendas() {

  return (
    <>
      <div>
        
        <form action="" className="formCadastro py-4 px-5 row">
         
          <div className="col-md-4">
            <label>Usúario</label>
            <input type="text" id="usuario" required name="usuario" />
          </div>
          <div className="col-md-4">
            <label>Senha</label>
            <input type="password" id="senha" required name="senha" />
          </div>
          <div className="col-md-4">
            <label>Email</label>
            <input type="email" id="email" required name="email" />
          </div>
          <div className="col-md-5">
            <label>Nome do Responsável</label>
            <input
              type="text"
              id="nomeResponsavel"
              required
              name="nomeResponsavel"
            />
          </div>
          <div className="col-md-4">
            <label>CPF do Responsável</label>
            <ReactInputMask
              mask="999-999-999-99"
              type="tel"
              id="cpf"
              required
              name="cpf"
            />
      
          </div>

          <div className="col-md-3">
            <label>CNPJ</label>
            <ReactInputMask
              mask="99.999.999/9999-99"
              type="tel"
              id="cnpj"
              required
              name="cnpj"
            />
          </div>
          <div className="col-md-4">
            <label>Nome Fantasia</label>
            <input type="text" id="nomeFantasia" required name="nomeFantasia" />
          </div>
          <div className="col-md-4">
            <label>Gatway Pagamento</label>
            <input type="text" id="gatway" required name="gatway" />
          </div>
          <div className="col-md-4">
            <label>Telefone</label>
            <ReactInputMask
              mask="(99) 99999-9999"
              type="tel"
              id="telefone"
              required
              name="telefone"
            />
          </div>
          <div className="col-md-4">
            <label>Celular</label>
            <ReactInputMask
              type="tel"
              mask="(99) 99999-9999"
              id="celular"
              name="celular"
              required
            />
          </div>

          <div className="col-md-4">
            <label>CEP</label>
            <ReactInputMask
              type="tel"
              mask="99999-999"
              id="cep"
              name="cep"
              required
            />
          </div>
          <div className="col-md-4">
            <label>Número</label>
            <input
              type="tel"
              id="numeroCasa"
              maxLength={6}
              required
              name="numeroCasa"
            />
          </div>
          <div className="col-md-6">
            <label>Logradouro</label>
            <input type="text" id="logradouro" required name="logradouro" />
          </div>

          <div className="col-md-6">
            <label>Complemento</label>
            <input type="text" id="complemento" name="complemento" />
          </div>

          <div className="col-md-12 btn-register">
            <button className="btn btn-primary">Cadastrar</button>
          </div>
        </form>
      </div>
    </>
  );
}
