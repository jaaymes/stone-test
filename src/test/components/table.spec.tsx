import Table from '@/components/Table'

import { render } from '@testing-library/react'

describe('Table', () => {
  it('renders without crashing', () => {
    const headers = [
      { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
      { id: 'age', numeric: true, disablePadding: false, label: 'Age' },
    ]
    const data = [
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' },
    ]
    const { container } = render(
      <Table headers={headers} data={data} title="Test Table" />
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
