import { NavLink } from "react-router-dom";
import {  MdLogout, MdMenu, MdMenuOpen } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import {
  FaRegChartBar,
} from "react-icons/fa";
import Logo from "../../../assets/logo-csh.png";
import useContexts from "../../../hooks/useContexts";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { LiaSchoolSolid } from "react-icons/lia";
import { TbDatabaseDollar } from "react-icons/tb";
import { useState } from "react";
import "./sidebar.css";

function SidebarMenu() {
  const { logoutAdmin } = useContexts();
  const [collapsed, setCollapsed] = useState(false);

  async function sair() {
    await logoutAdmin();
  }

  return (
    <Sidebar
      className="abracaMenu"
      backgroundColor="#009297"
      collapsed={collapsed}
    >
      <div id="sidebar-itens">
        {!collapsed ? (
          <div className="header-sidebar">
            <img src={Logo} alt="Logo" className="logoCsh mx-auto" />
            <MdMenuOpen
              size={30}
              className="sb-button me-2"
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>
        ) : (
          <div className="header-sidebar">
            <MdMenu
              size={30}
              className="sb-button mx-auto"
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>
        )}
        <hr className="text-white" />
        <Menu
          menuItemStyles={{
            button: ({ level, active, disabled }) => {
              if (level === 0)
                return {
                  color: disabled ? "#ddd" : "#f8f8f8",
                  backgroundColor: active ? "#6C757D" : "#009297",
                };
              else
                return {
                  color: disabled ? "#ddd" : "#f8f8f8",
                  backgroundColor: active ? "#f8f8f8" : "#009297",
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
          <SubMenu
            label="Relatórios"
            icon={<FaRegChartBar size={24} />}
          >
            <MenuItem
              component={<NavLink to="relatorios/relatorio-matriculas" />}
            >
              Acadêmicos
            </MenuItem>
            <MenuItem component={<NavLink to="relatorios/relatorio-vendas" />}>
              Financeiros
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
            <MenuItem disabled component={<NavLink to="cancelamentos" />}>
              Cancelamentos
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
