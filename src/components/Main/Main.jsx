import { NavLink } from "react-router-dom";
import { routes } from "../../routes/index.routes";

export const Main = () => {
  return (
    <div className="relative isolate px-6 lg:px-8 py-32">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Sistema de Compras para enriquecer seu negócio
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
            lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
            fugiat aliqua.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <NavLink
              to={routes.produtos.path}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Vamos começar?
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
