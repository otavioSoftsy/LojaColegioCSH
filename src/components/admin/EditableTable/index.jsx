/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { toast } from "react-toastify";
import "./editableTable.css";

const animatedComponents = makeAnimated();

const EditableTable = ({ onRowDataChange, periodicidade, dados }) => {
  const initialRow = { diaSemana: null, horaInicio: "", horaFim: "", diaMes: null };
  const [tableData, setTableData] = useState([initialRow]);

  const diasSemanaOptions = [
    { value: "SEG", label: "Segunda-Feira" },
    { value: "TER", label: "Terça-Feira" },
    { value: "QUA", label: "Quarta-Feira" },
    { value: "QUI", label: "Quinta-Feira" },
    { value: "SEX", label: "Sexta-Feira" },
    { value: "SAB", label: "Sábado" },
    { value: "DOM", label: "Domingo" },
  ];

  const handleInputChange = (index, name, value) => {
    const updatedData = [...tableData];
    updatedData[index][name] = value;
    setTableData(updatedData);
    onRowDataChange(updatedData);
  };

  const handleAddRow = () => {
    if (periodicidade !== "U" && periodicidade !== "D") {
      setTableData([...tableData, { ...initialRow }]);
    }
  };

  const handleRemoveRow = (index) => {
    if (periodicidade !== "U" && periodicidade !== "D" && index !== 0) {
      const updatedData = [...tableData];
      updatedData.splice(index, 1);
      setTableData(updatedData);
      onRowDataChange(updatedData);
    }
  };

  const handleClearRow = (index) => {
    const updatedData = [...tableData];
    updatedData[index] = { ...initialRow };
    setTableData(updatedData);
    onRowDataChange(updatedData);
  };

  useEffect(() => {
    if (dados) {
      const updatedTableData = dados.map((item) => {
        return {
          idCronograma: item.idCronograma,
          diaSemana: item.diaSemana,
          horaInicio: item.horaInicio,
          horaFim: item.horaFim,
          diaMes: item.diaMes,
          idCurso: item.idCurso
        };
      });
      setTableData(updatedTableData);
    } else {
      setTableData([initialRow]);
    }
  }, []);

  const isValidDate = (selectedDate) => {
    const currentDate = new Date();
    const selectedDateObj = new Date(selectedDate);

    if (selectedDateObj < currentDate) {
      toast.error("Selecione uma data futura.");
      return false;
    }

    return true;
  };

  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="mt-2 mb-4">
      <table className="table rounded-1 table-bordered">
        <thead>
          <tr>
            {periodicidade == "S" && (
              <th scope="col" width="30%">
                Dia da semana
              </th>
            )}
            {periodicidade == "M" && (
              <th scope="col" width="28%">
                Dia do mês
              </th>
            )}
            <th scope="col">Hora Início</th>
            <th scope="col">Hora Fim</th>
            <th scope="col" width="25%">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              {periodicidade == "S" && (
                <td>
                  <Select
                    required
                    components={animatedComponents}
                    isClearable={true}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        borderColor: "#dee2e6",
                        "&:hover": {
                          borderColor: "#dee2e6",
                        },
                      }),
                    }}
                    name={`selectDay-${index}`}
                    options={diasSemanaOptions}
                    className="basic-singl mt-1"
                    classNamePrefix="select"
                    value={
                      row.diaSemana
                        ? diasSemanaOptions.find((option) => option.value === row.diaSemana)
                        : null
                    }
                    onChange={(valor) =>
                      handleInputChange(
                        index,
                        "diaSemana",
                        valor ? valor.value : ""
                      )
                    }
                    placeholder="Selecione"
                  />
                </td>
              )}
              {periodicidade == "M" && (
                <td>
                  <input
                    type="date"
                    name={`diaMes-${index}`}
                    className="form-control mb-1"
                    required
                    min={currentDate}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      if (isValidDate(selectedDate)) {
                        handleInputChange(index, "diaMes", selectedDate);
                      } else {
                        e.target.value = "";
                      }
                    }}
                    value={row.diaMes}
                  />
                </td>
              )}

              <td>
                <input
                  type="time"
                  value={row.horaInicio}
                  onChange={(e) =>
                    handleInputChange(index, "horaInicio", e.target.value)
                  }
                  className="form-control mb-1"
                  required
                />
              </td>
              <td>
                <input
                  type="time"
                  value={row.horaFim}
                  required
                  onChange={(e) =>
                    handleInputChange(index, "horaFim", e.target.value)
                  }
                  className="form-control mb-1"
                />
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => handleClearRow(index)}
                  className="btn btn-sm mt-1 btn-warning"
                >
                  Limpar
                </button>
                {periodicidade !== "U" &&
                  periodicidade !== "D" &&
                  index !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      className="btn btn-sm mt-1 btn-danger ms-2"
                    >
                      Remover
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {periodicidade !== "U" && periodicidade !== "D" && (
        <button
          type="button"
          onClick={handleAddRow}
          className="btn btn-sm btn-success"
        >
          Adicionar Linha
        </button>
      )}
    </div>
  );
};

export default EditableTable;
