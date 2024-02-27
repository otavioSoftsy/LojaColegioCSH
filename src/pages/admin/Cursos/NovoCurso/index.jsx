import FormCurso from "../../../../components/admin/FormCurso";
import Title from "../../../../components/admin/Title";
import { FiPlusSquare } from "react-icons/fi";

export default function NovaCurso() {

  return (
    <>
      <div>
        <Title name="Cadastrar atividade">
          <FiPlusSquare size={28} />
        </Title>
        <FormCurso />
      </div>
    </>
  );
}
