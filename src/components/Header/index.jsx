import Logo from "../../assets/logo-sumare.png";

import { MdSearch } from "react-icons/md";
import {
  FiUser,
  FiShoppingCart,
  FiHome,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RiGraduationCapLine } from "react-icons/ri";
import { useState } from "react";
import useContexts from "../../hooks/useContexts";
import "./header.css";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();

  const { clientLogado } = useContexts();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/atividades?busca=${searchTerm}`, { replace: true });
    handleLinkClick();
  };
  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleLinkClick = () => {
    if (isMobile()) {
      setOpenSidebar(!openSidebar);
    }
  };

  const isMobile = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes("android") || userAgent.includes("iphone");
  };

  return (
    <header className="header-sumare">
      <div
        className={`header-mobile px-3 ${openSidebar ? "sidebar-open" : ""}`}
      >
        <FiMenu onClick={toggleSidebar} size={28} color="#f8f8f8" />
        <Link to="/">
          <img className="logo-sumare" src={Logo}></img>
        </Link>
        <div id="d-none">
          <FiMenu size={26} color="#f8f8f8" />
        </div>
      </div>
      <div
        id="nav-header"
        className={`${openSidebar ? "sidebar-open" : "none-sidebar"}`}
      >
        <FiX
          color="#f8f8f8"
          size={26}
          id="fiX"
          onClick={toggleSidebar}
          className={`${openSidebar ? "visivel" : "hiden"} ms-auto`}
        />
        <Link to="/">
          <img className="logo-sumare" src={Logo}></img>
        </Link>
        <nav>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Qual atividade você está procurando?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <MdSearch size={24} color="#fff" />
            </button>
          </form>
        </nav>
        <nav className="area-login">
          <NavLink to="/" onClick={handleLinkClick} activeClassName="active">
            <FiHome size={34} />
            <span>Início</span>
          </NavLink>
          <NavLink
            to="/atividades"
            onClick={handleLinkClick}
            activeClassName="active"
          >
            <RiGraduationCapLine size={35} />
            <span>Atividades</span>
          </NavLink>

          {/* <NavLink
            to="/favoritos"
            onClick={handleLinkClick}
            activeClassName="active"
          >
            <FiHeart size={35} />
            <span>Favoritos</span>
          </NavLink> */}
          <NavLink
            to="/carrinho"
            onClick={handleLinkClick}
            activeClassName="active"
          >
            <FiShoppingCart size={35} />
            <span>Carrinho</span>
          </NavLink>
          <NavLink
            to={clientLogado ? "/minha-conta" : "/minha-conta/entrar"}
            onClick={handleLinkClick}
            activeClassName="active"
          >
            <FiUser size={35} />
            {clientLogado ? (
              <span>Minha conta</span>
            ) : (
              <span>Login</span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
