import { Link, NavLink } from "react-router-dom";
import "./menu.css";
import {
  MdLogout,
  MdOutlineHandshake,
  MdOutlineInsertChart,
  MdOutlineListAlt,
} from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";
import { RiGraduationCapLine, RiSchoolLine } from "react-icons/ri";
import { FiPercent, FiUsers } from "react-icons/fi";
import Logo from "../../../assets/logo-sumare.png";
import useContexts from "../../../hooks/useContexts";

function Menu() {
  const { logoutAdmin } = useContexts();

  async function sair() {
    await logoutAdmin();
  }
  return (
    <>
      <div className="abracaMenu">
        <img className="logoSumare" src={Logo}></img>
        <hr></hr>
        <div>
          <div className="ulMenu">
            <NavLink
              to="/admin/dashboard"
              exact={true}
              activeClassName="active"
              className="mb-1"
            >
              <AiOutlineDashboard size={26} /> Dashboard
            </NavLink>
            <NavLink
              to="/admin/descontos"
              activeClassName="active"
              className="mb-1"
            >
              <FiPercent size={26} /> Descontos
            </NavLink>
            <NavLink
              to="/admin/categorias"
              activeClassName="active"
              className="mb-1"
            >
              <MdOutlineListAlt size={26} />
              Categorias
            </NavLink>
            <NavLink
              to="/admin/atividades"
              activeClassName="active"
              className="mb-1"
            >
              {" "}
              <RiGraduationCapLine size={26} />
              Atividades
            </NavLink>
            <NavLink
              to="/admin/colaboradores"
              activeClassName="active"
              className="mb-1"
            >
              <FiUsers size={26} />
              Colaboradores
            </NavLink>
            <NavLink
              to="/admin/parceiros"
              activeClassName="active"
              className="mb-1"
            >
              <MdOutlineHandshake size={26} />
              Parceiros
            </NavLink>
            <NavLink
              to="/admin/dados-instituicao"
              activeClassName="active"
              className="mb-1"
            >
              <RiSchoolLine size={26} />
              Instituição
            </NavLink>
            
            <NavLink
              to="/admin/relatorio-de-vendas"
              activeClassName="active"
              className="mb-1"
            >
              <MdOutlineInsertChart size={26} />
              Relatório de Vendas
            </NavLink>
            <Link onClick={sair} id="sair">
              {" "}
              <MdLogout size={26} />
              Sair
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Menu;
