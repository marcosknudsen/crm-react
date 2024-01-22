import {
  useLoaderData,
  Form,
  useNavigate,
  useActionData,
  redirect,
} from "react-router-dom";
import Formulario from "../components/Formulario";
import { actualizarCliente, obtenerCliente } from "../data/clientes";
import Error from "../components/Error";

export async function loader({ params }) {
  const cliente = await obtenerCliente(params.clienteId);
  if (!Object.values(cliente).length) {
    throw new Response("", {
      status: 404,
      statusText: "El Cliente no fue encontrado",
    });
  }
  return cliente;
}

export async function action({ request, params }) {
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

  //Editar cliente

  await actualizarCliente(params.clienteId, data);

  return redirect("/");
}

export default function EditarCliente() {
  const navigate = useNavigate();
  const cliente = useLoaderData();
  const errores = useActionData();

  return (
    <>
      <h1 className="font-black text-4xl text-blue-900">Editar Cliente</h1>
      <p className="mt-3">
        A continuación podrás modificar los datos de un cliente
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
        <Form method="PUT" action={`/clientes/${cliente.id}/editar`} noValidate>
          <Formulario cliente={cliente} />
        </Form>
      </div>
    </>
  );
}
