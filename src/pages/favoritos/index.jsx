import "./favoritos.css"


export default function Favoritos(){

return(
    <section className="container-favoritos">
        <div className="head-favoritos">
            <h2>Favoritos</h2>
        </div>
        <div className="d-flex gap-5 caixas-favoritos">


            <div className="card-favoritos">
                <h3>Esportes</h3>
                <h2>Volei de Praia</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum culpa necessitatibus, </p>
                <div className="d-flex flex-column gap-0">
                    <div  className="d-flex justify-content-between">
                        <p>duração:</p> <p>60 horas</p>
                    </div>
                    <div  className="d-flex justify-content-between">
                        <p>semanal:</p> <p>TER e QUI</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p>mensalidades:</p> <p>R$ 160,00</p>
                    </div>
                </div>
            </div>

            <div className="card-favoritos">
                <h3>Esportes</h3>
                <h2>Volei de Praia</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum culpa necessitatibus, </p>
                <div className="d-flex flex-column gap-0">
                    <div  className="d-flex justify-content-between">
                        <p>duração:</p> <p>60 horas</p>
                    </div>
                    <div  className="d-flex justify-content-between">
                        <p>semanal:</p> <p>TER e QUI</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p>mensalidades:</p> <p>R$ 160,00</p>
                    </div>
                </div>
            </div>

            <div className="card-favoritos">
                <h3>Esportes</h3>
                <h2>Volei de Praia</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum culpa necessitatibus, </p>
                <div className="d-flex flex-column gap-0">
                    <div  className="d-flex justify-content-between">
                        <p>duração:</p> <p>60 horas</p>
                    </div>
                    <div  className="d-flex justify-content-between">
                        <p>semanal:</p> <p>TER e QUI</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p>mensalidades:</p> <p>R$ 160,00</p>
                    </div>
                </div>
            </div>

            <div className="card-favoritos">

             <div className="icone-add"> 
                <i className="fa-solid fa-plus"></i>
             </div>

            </div>

        </div>
    </section>
)
}