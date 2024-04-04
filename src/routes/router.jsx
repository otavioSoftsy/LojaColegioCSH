import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import LoginAdmin from "../pages/admin/LoginAdmin";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import NovoFornecedor from "../pages/admin/Fornecedores/NovoFornecedor";
import RootLayout from "../pages/RootLayout";
import Fornecedores from "../pages/admin/Fornecedores/ListarFornecedores";
import EditarFornecedor from "../pages/admin/Fornecedores/EditarFornecedor";
import ListarCursos from "../pages/admin/Cursos/ListarCursos";
import NovoCurso from "../pages/admin/Cursos/NovoCurso";
import NovoColaborador from "../pages/admin/Colaboradores/NovoColaborador";
import Areas from "../pages/admin/Areas";
import EditarCurso from "../pages/admin/Cursos/EditarCurso";
import Home from "../pages/Home";
import Cursos from "../pages/Cursos";
import EditarColaborador from "../pages/admin/Colaboradores/EditarColaborador";
import ListarColaboradores from "../pages/admin/Colaboradores/ListarColaboradores";
// import NovaInstituicao from "../pages/admin/DadosInstituicao/NovaInstituicao";
// import ListarInstituicoes from "../pages/admin/DadosInstituicao/ListarInstituicoes";
import EditarInstituicao from "../pages/admin/DadosInstituicao/EditarInstituicao";
import DetalhesCurso from "../pages/Cursos/DetalhesCurso";
import Carrinho from "../pages/Carrinho";
import Private from "./Private";
import Autentica from "./Autentica";
import Pagamento from "../pages/Carrinho/Pagamento";
import Cartao from "../pages/Cartao";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DadosUsuario from "../pages/DadosUsuario";
import Desconto from "../pages/admin/Desconto";
import UltimasCompras from "../pages/DadosUsuario/UltimasCompras";
import PgSucesso from "../components/PgSucesso";
import RelatorioDeMatriculas from "../pages/admin/Relatorios/RelatorioDeMatriculas";
import RelatorioDeVendas from "../pages/admin/Relatorios/RelatorioDeVendas";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "atividades", element: <Cursos /> },
      { path: "atividades/:atividade", element: <DetalhesCurso /> },
      { path: "carrinho", element: <Carrinho /> },
      { path: "carrinho/pagamento", element: <Pagamento /> },
      { path: "carrinho/pagamento/cartao", element: <Cartao /> },
      { path: "pg-sucesso", element: <PgSucesso /> },
      { path: "minha-conta/entrar", element: <Login /> },
      { path: "minha-conta/cadastro", element: <Register /> },
      { path: "minha-conta", element: <DadosUsuario /> },
      { path: "minha-conta/historico-de-compras", element: <UltimasCompras /> },
    ],
  },
  {
    path: "admin",
    element: <LoginAdmin />,
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <Private>
            <DashboardAdmin />
          </Private>
        ),
      },
      {
        path: "descontos",
        element: (
          <Private>
            <Desconto />
          </Private>
        ),
      },
      {
        path: "atividades",
        element: (
          <Private>
            <ListarCursos />
          </Private>
        ),
      },
      {
        path: "categorias",
        element: (
          <Private>
            <Areas />
          </Private>
        ),
      },

      {
        path: "atividades/nova-atividade",
        element: (
          <Private>
            <Autentica>
              <NovoCurso />
            </Autentica>
          </Private>
        ),
      },
      {
        path: "atividades/editar-atividade/:id",
        element: (
          <Private>
            <Autentica>
              <EditarCurso />
            </Autentica>
          </Private>
        ),
      },

      {
        path: "parceiros",
        element: (
          <Private>
            <Fornecedores />
          </Private>
        ),
      },

      {
        path: "parceiros/cadastro",
        element: (
          <Private>
            <Autentica>
              <NovoFornecedor />
            </Autentica>
          </Private>
        ),
      },
      {
        path: "parceiros/editar/:id",
        element: (
          <Private>
            <Autentica>
              <EditarFornecedor />
            </Autentica>
          </Private>
        ),
      },

      {
        path: "dados-instituicao",
        element: (
          <Private>
            <EditarInstituicao />
          </Private>
        ),
      },

      // {
      //   path: "dados-instituicao/nova-instituicao",
      //   element: (
      //     <Private>
      //       <Autentica>
      //         <NovaInstituicao />
      //       </Autentica>
      //     </Private>
      //   ),
      // },
      // {
      //   path: "dados-instituicao/editar-instituicao/:id",
      //   element: (
      //     <Private>
      //       <Autentica>
      //         <EditarInstituicao />
      //       </Autentica>
      //     </Private>
      //   ),
      // },

      {
        path: "colaboradores",
        element: (
          <Private>
            <ListarColaboradores />
          </Private>
        ),
      },

      {
        path: "colaboradores/novo-colaborador",
        element: (
          <Private>
            <Autentica>
              <NovoColaborador />
            </Autentica>
          </Private>
        ),
      },
      {
        path: "colaboradores/editar-colaborador/:id",
        element: (
          <Private>
            <EditarColaborador />
          </Private>
        ),
      },
      {
        path: "relatorios/relatorio-matriculas",
        element: (
          <Private>
            <RelatorioDeMatriculas />
          </Private>
        ),
      },
      {
        path: "relatorios/relatorio-vendas",
        element: (
          <Private>
            <RelatorioDeVendas />
          </Private>
        ),
      },
    ],
  },
]);

export default router;
