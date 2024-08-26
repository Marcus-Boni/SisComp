import { NavLink } from "react-router-dom";
import { routes } from "../../routes/index.routes";

export const Main = () => {
  return (
    <section className="relative isolate px-6 lg:px-8 py-64">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Sistema de Compras para enriquecer seu negócio
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Projeto desenvolvido para aprimorar suas vendas e gerenciar seus
            produtos de forma eficiente. Comece agora mesmo!
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <NavLink
              to={routes.produtos.path}
              className="rounded-md bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              Vamos começar?
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};
