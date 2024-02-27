/* eslint-disable react/prop-types */
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./iconModal.css";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

library.add(fas, far, fab);

export default function IconModal({ onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");

  const allIcons = Object.entries(library.definitions).flatMap(
    ([prefix, icons]) =>
      Object.keys(icons).map((iconName) => [prefix, iconName])
  );

  const filteredIcons = allIcons.filter(([prefix, iconName]) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="icon-overlay">
      <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5 px-4" id="staticBackdropLabel">
              Lista de ícones
            </h1>
            <button
              type="button"
              className="btn-close pe-5"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body scrool">
            <div className="area-search">
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Digite o nome do ícone que você procura. Ex: user-graduate"
                  aria-label="Buscar ícone"
                  aria-describedby="basic-addon1"
                  id="search"
                  value={searchTerm}
                  autoComplete="off"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="icon-grid">
              {filteredIcons.map(([prefix, iconName], index) => (
                <div
                  className="icon-card"
                  key={index}
                  onClick={() => onSelect(iconName)}
                >
                  <FontAwesomeIcon icon={[prefix, iconName]} className="icon" />
                  <div className="icon-name">{iconName}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer"></div>
        </div>
      </div>
    </div>
  );
}
