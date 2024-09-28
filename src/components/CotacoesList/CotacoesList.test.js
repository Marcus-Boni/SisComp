/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react';
import { CotacoesList } from './CotacoesList';
import { onSnapshot } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn()
}));

describe('CotacoesList Component', () => {
  const requisicaoId = '123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar mensagem quando não houver cotações', () => {
    onSnapshot.mockImplementation((_, callback) => {
      callback({ docs: [] });
    });

    render(<CotacoesList requisicaoId={requisicaoId} />);

    expect(
      screen.getByText('Nenhuma cotação por enquanto!')
    ).toBeInTheDocument();
  });

  test('deve renderizar cotações quando disponíveis', () => {
    const mockCotacoes = [
      { preco: '1000', data: '2024-09-27' },
      { preco: '1500', data: '2024-09-28' }
    ];

    onSnapshot.mockImplementation((_, callback) => {
      callback({
        docs: mockCotacoes.map((cotacao) => ({
          data: () => cotacao
        }))
      });
    });

    render(<CotacoesList requisicaoId={requisicaoId} />);

    expect(screen.getByText('Preço: R$1000')).toBeInTheDocument();
    expect(screen.getByText('Data: 2024-09-27')).toBeInTheDocument();
    expect(screen.getByText('Preço: R$1500')).toBeInTheDocument();
    expect(screen.getByText('Data: 2024-09-28')).toBeInTheDocument();
  });

  test('deve se inscrever e desinscrever corretamente ao montar e desmontar', () => {
    const unsubscribeMock = jest.fn();

    onSnapshot.mockImplementation(() => unsubscribeMock);

    const { unmount } = render(<CotacoesList requisicaoId={requisicaoId} />);

    expect(onSnapshot).toHaveBeenCalledTimes(1);

    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
