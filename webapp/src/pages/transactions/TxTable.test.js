import { fireEvent, render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/client/testing'
import TxTable from './TxTable'
import { transactions, users } from '../../utils/mocks'
import GetUsers from '../../gql/users.gql'
import DeleteTransaction from '../../gql/deleteTransaction.gql'
import UpdateTransaction from '../../gql/updateTransaction.gql'
import AddTransaction from '../../gql/addTransaction.gql'


describe('Transactions Table', () => {
  const testTransaction = transactions.find(tx => tx.user_id === users[0].id)

  const mockGetUsers = {
    request: {
      query: GetUsers
    },
    result: {
      data: {
        users
      }
    }
  }
  
  const mockDeleteTx = {
    request: {
      query: DeleteTransaction,
      variables: { id: testTransaction.id }
    },
    result: {
      data: {
        id: null,
        __typename: 'Transaction'
      }
    }
  }

  const mockAddTx = {
    request: {
      query: AddTransaction,
      variables: {
        user_id: '61946c571c2a20c8f553d76b',
        description: 'test description',
        merchant_id: 'test merchant',
        debit: true,
        credit: false,
        amount: 2.99
      }
    },
    result: {
      data: {
        addTransaction: {
          id: 'testid',
        },
      }
    }
  }

  const mockUpdateTx = {
    request: {
      query: UpdateTransaction,
      variables: {
        id: '619463389d0b3bb69eba7379',
        user_id: '61946c571c2a20c8f553d76b',
        description: 'baking supplies',
        merchant_id: 'walmart',
        debit: true,
        credit: false,
        amount: 17.99
      }
    },
    result: {
      data: {
        updateTransaction: {
          id: null,
        },
      }
    }
  }

  const mocks = [ mockGetUsers, mockDeleteTx, mockAddTx, mockUpdateTx ]

  it('should match snapshot', () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <TxTable data={transactions} />
      </MockedProvider>
    )
    expect(container).toMatchSnapshot()
  })
  it('should show correct user data', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mocks} addTypeName={false}>
        <TxTable data={transactions} />
      </MockedProvider>
    )
    const txDataRow = getByTestId(`transactions-${testTransaction.id}-table-row`)
    expect(txDataRow).toBeInTheDocument()
  })
  it('should switch to edit mode when edit icon clicked', async () => {
    const { getByTestId } = await render(
      <MockedProvider mocks={mocks} addTypeName={false}>
        <TxTable data={transactions} />
      </MockedProvider>
    )

    await waitFor(() => new Promise((res) => setTimeout(res, 0)));

    const txDataEditButton = getByTestId(`transactions-${testTransaction.id}-edit-button`)
    fireEvent.click(txDataEditButton)
    const txDescriptionInputField = getByTestId(`transactions-${testTransaction.id}-description-input`)
    expect(txDescriptionInputField).toBeInTheDocument()
  })
  it('should add transaction row when Add Transaction button clicked', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mocks} addTypeName={false}>
        <TxTable data={transactions} />
      </MockedProvider>
    )
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));

    const txAddButton = getByTestId(`transactions-add-button`)
    fireEvent.click(txAddButton)
    const newInputField = getByTestId(`transactions--description-input`)
    expect(newInputField).toBeInTheDocument()
  })
  it('should save new transaction row when Add Transaction row filled and saved', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mocks} addTypeName={false}>
        <TxTable data={transactions} />
      </MockedProvider>
    )
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));

    const txAddButton = getByTestId(`transactions-add-button`)
    fireEvent.click(txAddButton)

    const newDescriptionField = getByTestId(`transactions--description-input`)
    fireEvent.change(newDescriptionField, { target: { value: 'test description' } })

    const newMerchantField = getByTestId(`transactions--merchant_id-input`)
    fireEvent.change(newMerchantField, { target: { value: 'test merchant' } })

    const newUserField = getByTestId(`transactions--user-input-dropdown`)
    fireEvent.change(newUserField, { target: { value: users[0].id } })

    const newAmountField = getByTestId(`transactions--amount-input`)
    fireEvent.change(newAmountField, { target: { value: '-2.99' } })

    const saveNewTxField = getByTestId(`transactions--save-button`)
    fireEvent.click(saveNewTxField)

    await waitFor(() => new Promise((res) => setTimeout(res, 0)));

    const newTxRow = getByTestId(`transactions-testid-table-row`)
    expect(newTxRow).toBeInTheDocument()
  })
  it('should delete row when delete button clicked', async () => {
    const { getByTestId, queryByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false} >
        <TxTable data={transactions} />
      </MockedProvider>
    )
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));

    const txDataDeleteButton = getByTestId(`transactions-${testTransaction.id}-delete-button`)
    fireEvent.click(txDataDeleteButton)
  
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));

    const deletedRow = queryByTestId(`transactions-${testTransaction.id}-table-row`)
    expect(deletedRow).not.toBeInTheDocument()
  })
  it('should clear changes when transaction updated and revert button clicked', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false} >
        <TxTable data={transactions} />
      </MockedProvider>
    )
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));

    const txDataEditButton = getByTestId(`transactions-${testTransaction.id}-edit-button`)
    fireEvent.click(txDataEditButton)

    const txDescriptionInputField = getByTestId(`transactions-${testTransaction.id}-description-input`)
    fireEvent.change(txDescriptionInputField, { target: { value: 'test description', name: 'description' }})

    const txDataRevertIconButton = getByTestId(`transactions-${testTransaction.id}-revert-button`)
    fireEvent.click(txDataRevertIconButton)

    const txDescriptionCell = getByTestId(`transactions-${testTransaction.id}-description-cell`)
    expect(txDescriptionCell).toHaveTextContent(testTransaction.description)
  })
  it('should save changes when transaction updated', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false} >
        <TxTable data={transactions} />
      </MockedProvider>
    )
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));

    const txDataEditButton = getByTestId(`transactions-${testTransaction.id}-edit-button`)
    fireEvent.click(txDataEditButton)

    await waitFor(() => new Promise((res) => setTimeout(res, 0)));

    const txAmountInputField = getByTestId(`transactions-${testTransaction.id}-amount-input`)
    fireEvent.change(txAmountInputField, { target: { value: '-17.99' }})

    const txDataSaveIconButton = getByTestId(`transactions-${testTransaction.id}-save-button`)
    fireEvent.click(txDataSaveIconButton)

    await waitFor(() => new Promise((res) => setTimeout(res, 0)));

    const txAmountCell = getByTestId(`transactions-${testTransaction.id}-amount-cell`)
    expect(txAmountCell).toHaveTextContent('17.99')
  })
})