/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { toast } from "react-toastify";
import { url_base } from "../../../services/apis";

const animatedComponents = makeAnimated();

const TableCreatedParceiros = ({
  onRowDataChange2,
  parceiros,
  parceirosCurso,
  dadosApi,
  setDadosApi,
}) => {
  const initialRow = {
    split: "",
    parceiro: null,
  };
  const [tableData, setTableData] = useState([initialRow]);

  const handleInputChange = (index, name, value) => {
    const updatedData = [...tableData];
    updatedData[index][name] = value;
    setTableData(updatedData);
    onRowDataChange2(updatedData);
  };

  const handleAddRow = () => {
    setTableData([...tableData, { ...initialRow }]);
  };

  const handleRemoveRow = async (index) => {
    const updatedData = [...tableData];
    if (index !== 0 && !dadosApi) {
      updatedData.splice(index, 1);
      setTableData(updatedData);
      onRowDataChange2(updatedData);
    } else if (dadosApi) {
      const itemRemov = dadosApi.find(
        (item) => item.fornecedorId === updatedData[index].parceiro
      );

      try {
        if (itemRemov) {
          await axios.delete(
            url_base + "fornecedoresCurso/" + itemRemov.idFornecedorCurso
          );

          const dadosApiIndex = dadosApi.findIndex(
            (item) => item.fornecedorId === updatedData[index].parceiro
          );

          if (dadosApiIndex !== -1) {
            const updatedDadosApi = [...dadosApi];
            updatedDadosApi.splice(dadosApiIndex, 1);
            setDadosApi(updatedDadosApi);
          }
        }

        updatedData.splice(index, 1);
        setTableData(updatedData);
        onRowDataChange2(updatedData);
      } catch (error) {
        console.error("Erro ao remover item:", error);
      }
    }
  };

  const handleClearRow = (index) => {
    const updatedData = [...tableData];

    if (parceirosCurso && parceirosCurso[index]) {
      updatedData[index] = {
        parceiro: updatedData[index].parceiro,
        split: "",
      };
    } else {
      updatedData[index] = { ...initialRow };
    }

    setTableData(updatedData);
    onRowDataChange2(updatedData);
  };

  useEffect(() => {
    if (parceirosCurso && parceirosCurso.length > 0) {
      const updatedTableData = parceirosCurso.map((item) => {
        return {
          parceiro: item.fornecedorId,
          split: item.percentualSplit,
        };
      });
      setTableData(updatedTableData);
    } else {
      setTableData([initialRow]);
    }
  }, []);

  return (
    <div className="mt-2 mb-4">
      <table className="table rounded-1 table-bordered">
        <thead>
          <tr>
            <th scope="col">Parceiro</th>
            <th scope="col" width="15%">
              % Split
            </th>
            <th scope="col" width="25%">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => {
            const isParceirosCursoData =
              parceirosCurso &&
              parceirosCurso[index] &&
              parceirosCurso[index].parceiro !== null;
            const isDisabled = isParceirosCursoData;
            return (
              <tr key={index}>
                <td>
                  <Select
                    key={`parceiro-${index}`}
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
                    isDisabled={isDisabled}
                    name={`parceiro-${index}`}
                    options={parceiros}
                    className="basic-single mt-1"
                    classNamePrefix="select"
                    value={
                      row.parceiro
                        ? parceiros.find(
                            (option) => option.value === row.parceiro
                          )
                        : null
                    }
                    onChange={(valor) =>
                      handleInputChange(
                        index,
                        "parceiro",
                        valor ? valor.value : ""
                      )
                    }
                    placeholder="Selecione"
                  />
                </td>
                <td>
                  <NumericFormat
                    decimalSeparator="."
                    allowNegative={false}
                    decimalScale={2}
                    required
                    id="split"
                    autoComplete="off"
                    name="split"
                    value={row.split !== "" ? row.split * 100 : ""}
                    className="form-control mb-1"
                    onValueChange={(values) => {
                      const floatValue = values.floatValue / 100;
                      if (floatValue > 1) {
                        toast.warning("% Split não pode ser maior que 100.");
                        handleInputChange(index, "split", "");
                      } else {
                        handleInputChange(index, "split", floatValue);
                      }
                    }}
                    suffix=" %"
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
                  {(index !== 0 || isParceirosCursoData) && (
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
            );
          })}
        </tbody>
      </table>
      <button
        type="button"
        onClick={handleAddRow}
        className="btn btn-sm btn-primary"
      >
        Adicionar Linha
      </button>
    </div>
  );
};

export default TableCreatedParceiros;
