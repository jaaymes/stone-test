import Modal from '@/components/Modal'

import { fireEvent, render, screen } from '@testing-library/react'

describe('Modal', () => {
  const title = 'Test Modal'
  const description = 'Test Description'
  const alert = 'Test Alert'
  const buttons = <button>Fechar</button>
  const onClose = jest.fn()

  it('renderiza o título, a descrição, o alerta e os botões corretamente', async () => {
    const { container } = render(
      <Modal open={true} onClose={onClose} title={title} description={description} alert={alert} buttons={buttons} />
    )
    const titleElement = screen.getByText(title)
    const descriptionElement = screen.getByText(description)
    const alertElement = screen.getByText(alert)
    expect(titleElement).toBeInTheDocument()
    expect(descriptionElement).toBeInTheDocument()
    expect(alertElement).toBeInTheDocument()
    const closeButton = screen.getByText('Fechar')
    expect(closeButton).toBeInTheDocument()
    fireEvent.click(closeButton)

    expect(container).toMatchSnapshot()
  })
})
