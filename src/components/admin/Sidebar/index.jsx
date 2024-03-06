import { NavLink } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { FaRegChartBar } from "react-icons/fa";
import Logo from "../../../assets/logo-sumare.png";
import useContexts from "../../../hooks/useContexts";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { LiaSchoolSolid } from "react-icons/lia";
import { TbDatabaseDollar } from "react-icons/tb";
import "./sidebar.css";

function SidebarMenu() {
  const { logoutAdmin } = useContexts();

  async function sair() {
    await logoutAdmin();
  }

  return (
    <Sidebar className="abracaMenu" backgroundColor="#1b1ca1">
      <div style={{ display: "flex", flexDirection: "column", height: "100%"}}>

        <img src={Logo} alt="Logo" className="logoGdv mx-auto" />
        <hr />

        <Menu
          menuItemStyles={{
            button: ({ level, active }) => {
              if (level === 0)
                return {
                  color: active ? "#1b1ca1" : "#f8f8f8",
                  backgroundColor: active ? "#f8f8f8" : "#1b1ca1",
                };
              else
                return {
                  color: active ? "#1b1ca1" : "#f8f8f8",
                  backgroundColor: active ? "#f8f8f8" : "#1b1ca1",
                };
            },
          }}
        >
          <SubMenu label="Administração" icon={<RiAdminLine size={24} />}>
            <MenuItem component={<NavLink to="colaboradores" />}>
              Colaboradores
            </MenuItem>
            <MenuItem component={<NavLink to="parceiros" />}>
              Parceiros
            </MenuItem>
            <MenuItem component={<NavLink to="dados-instituicao" />}>
              Instituição
            </MenuItem>
          </SubMenu>
          <SubMenu label="Acadêmicos" icon={<LiaSchoolSolid size={24} />}>
            <MenuItem component={<NavLink to="atividades" />}>
              Atividades
            </MenuItem>
            <MenuItem component={<NavLink to="categorias" />}>
              Categorias
            </MenuItem>
          </SubMenu>
          <SubMenu label="Financeiro" icon={<TbDatabaseDollar size={24} />}>
            <MenuItem component={<NavLink to="descontos" />}>
              Descontos
            </MenuItem>
            <MenuItem component={<NavLink to="cancelamentos" />}>
              Cancelamentos
            </MenuItem>
          </SubMenu>
          <SubMenu label="Relatórios" icon={<FaRegChartBar size={24} />}>
            <MenuItem
              component={<NavLink to="relatorios/relatorio-matriculas" />}
            >
              Acadêmicos
            </MenuItem>
            <MenuItem component={<NavLink to="relatorio-vendas" />}>
              Financeiros
            </MenuItem>
          </SubMenu>

          <MenuItem icon={<MdLogout size={24} />} onClick={sair}>
            Sair da conta
          </MenuItem>
        </Menu>
      </div>
    </Sidebar>
  );
}

export default SidebarMenu;
