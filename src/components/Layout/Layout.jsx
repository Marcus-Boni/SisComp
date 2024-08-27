import { useState } from 'react';
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel
} from '@headlessui/react';
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../../routes/index.routes';
import { Main } from '../Main';
import { Description } from '../Description';
import { Testimonial } from '../Testimonial';
import { Stats } from '../Stats';
import { Footer } from '../Footer';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../../context/AuthProvider';

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser, role } = useAuth();

  const userRole = role;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <>
      <header className="bg-gradient-to-r from-sky-200 via-sky-300 to-sky-500">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <NavLink
              to={routes.home.path}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              <img
                className="h-8 w-auto lg:h-10 lg:w-auto"
                src={'/cart.svg'}
                alt=""
              />
            </NavLink>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <PopoverGroup className="hidden lg:flex lg:gap-x-12">
            {userRole === 'administrador' && (
              <div className="flex items-center gap-2 text-sm font-semibold leading-6 text-black focus:outline-none">
                <NavLink
                  to={routes.home.path}
                  className="block px-4 py-2 text-sm leading-6"
                >
                  Home
                </NavLink>
                <NavLink
                  to={routes.produtos.path}
                  className="block px-4 py-2 text-sm leading-6"
                >
                  Produtos
                </NavLink>
                <NavLink
                  to={routes.fornecedores.path}
                  className="block px-4 py-2 text-sm leading-6"
                >
                  Fornecedores
                </NavLink>
                <NavLink
                  to={routes.contatos.path}
                  className="block px-4 py-2 text-sm leading-6"
                >
                  Contatos
                </NavLink>
                <NavLink
                  to={routes.requisicoesCompras.path}
                  className="block px-4 py-2 text-sm leading-6"
                >
                  Requisições de Compras
                </NavLink>
                <NavLink
                  to={routes.adminDashboard.path}
                  className="block px-4 py-2 text-sm leading-6"
                >
                  Admin Dashboard
                </NavLink>
              </div>
            )}
            {userRole === 'administrador' && (
              <Popover className="relative self-center">
                <PopoverButton className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 focus:outline-none">
                  Cotações
                  <ChevronDownIcon className="h-5 w-5 ml-1 text-gray-700" />
                </PopoverButton>
                <PopoverPanel
                  className="absolute z-10 w-48 py-2 mt-2 bg-white rounded-lg shadow-lg transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                  anchor="bottom start"
                  transition
                >
                  <NavLink
                    to={routes.cotacoes.children[0].path}
                    className="block px-4 py-2 text-sm leading-6"
                  >
                    Cadastrar Cotação
                  </NavLink>
                  <NavLink
                    to={routes.cotacoes.children[1].path}
                    className="block px-4 py-2 text-sm leading-6"
                  >
                    Consultar Cotações
                  </NavLink>
                </PopoverPanel>
              </Popover>
            )}
            {userRole === 'colaborador' && (
              <>
                <div className="flex items-center gap-2 text-sm font-semibold leading-6 text-black focus:outline-none">
                  <NavLink
                    to={routes.home.path}
                    className="text-sm font-semibold leading-6"
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to={routes.cotacoes.children[1].path}
                    className="block px-4 py-2 text-sm leading-6"
                  >
                    Consultar Cotações
                  </NavLink>
                  <NavLink
                    to={routes.requisicoesCompras.path}
                    className="block px-4 py-2 text-sm leading-6"
                  >
                    Requisições de Compras
                  </NavLink>
                </div>
              </>
            )}
          </PopoverGroup>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Popover className="relative">
              <PopoverButton className="flex items-center space-x-2 focus:outline-none">
                {currentUser?.photoURL || (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
                <span className="text-sm font-semibold leading-6 text-gray-900">
                  {currentUser?.email.split('@').shift() ||
                    'Usuário não logado'}
                </span>
              </PopoverButton>

              <PopoverPanel
                className="absolute z-10 w-48 py-2 mt-2 bg-white rounded-lg shadow-lg transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                transition
                anchor="bottom start"
              >
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.email}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Sair
                  </button>
                </div>
              </PopoverPanel>
            </Popover>
          </div>
        </nav>
        <Dialog
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <NavLink to={routes.home.path}>
                <img
                  className="h-8 w-auto lg:h-10 lg:w-auto"
                  src={'/cart.svg'}
                  alt=""
                />
              </NavLink>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <NavLink
                    to={routes.produtos.path}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Cotações
                  </NavLink>
                  <NavLink
                    to={routes.fornecedores.path}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Fornecedores
                  </NavLink>
                  <NavLink
                    to={routes.contatos.path}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Contatos
                  </NavLink>
                  <NavLink
                    to={routes.cotacoes.path}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Cotações
                  </NavLink>
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
      {location.pathname === routes.home.path && (
        <>
          <Main />
          <Description />
          <Testimonial />
          <Stats />
          <Footer />
        </>
      )}
      <Outlet />
    </>
  );
}
