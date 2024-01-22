import { useActionData, useNavigate, redirect } from "react-router-dom";
import Formulario from "../components/Formulario";
import { Form } from "react-router-dom";
import Error from "../components/Error";
import { agregarCliente } from "../data/clientes";

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const email = formData.get("email");

  const errores = [];
  if (Object.values(data).includes("")) {
    errores.push("Todos los campos son obligatorios");
  }

  let regex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  );

  if (!regex.test(email)) {
    errores.push("El email no es válido");
  }

  if (errores?.length) return errores;

  await agregarCliente(data);

  return redirect("/");
}

export default function NuevoCliente() {
  const errores = useActionData();
  const navigate = useNavigate();

  return (
    <>
      <h1 className="font-black text-4xl text-blue-900">Nuevo Cliente</h1>
      <p className="mt-3">
        Llena todos los campos para registrar un nuevo cliente
      </p>

      <div className="flex justify-end">
        <button
          className="bg-blue-800 text-white px-3 py-1 font-bold uppercase"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>

      <div className="bg-white shadow rounded-md md:w-3/4 mx-auto px-5 pt-3 pb-10 mt-10">
        {errores &&
          errores.length &&
          errores.map((error, index) => <Error key={index}>{error}</Error>)}
        <Form method="POST" action="/clientes/nuevo" noValidate>
          <Formulario />
        </Form>
      </div>
    </>
  );
}
