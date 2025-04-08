import axios from 'axios'

const BASE_URL = 'http://localhost:5173/api'

const fetchTransactions = async () => {
  try {
    const res = await axios.get(BASE_URL + '/transactions')
    if (res.status !== 200) {
      alert('transactions를 불러오는데 실패했습니다.')
      console.log('  ⚠️  : ', res)
    }
    return res
  } catch (e) {
    console.log('  ⚠️ fail to fetch transaction : ', e)
  }
}

const postTransaction = async (transaction) => {
  try {
    const res = await axios.post(BASE_URL + '/transactions', transaction)
    if (res.status !== 201) {
      alert('account를 추가하는데 실패했습니다.')
      console.log('  ⚠️  : ', res)
    }
    return res
  } catch (e) {
    console.log('  ⚠️  : ', e)
  }
}

const deleteTransaction = async (transactionId) => {
  try {
    const res = await axios.delete(BASE_URL + `/transactions/${transactionId}`)
    if (res.status !== 200) {
      alert('account를 삭제하는데 실패했습니다.')
      console.log('  ⚠️  : ', res)
    }
    return res
  } catch (e) {
    console.log('  ⚠️  : ', e)
  }
}

const updateTransaction = async (transaction) => {
  try {
    const res = await axios.put(BASE_URL + `/transactions/${transaction.id}`, transaction)
    if (res.status !== 200) {
      alert('transaction을 수정하는데 실패했습니다.')
      console.log('  ⚠️  : ', res)
    }
    return res
  } catch (e) {
    console.log('  ⚠️  : ', e)
  }
}

export default { fetchTransactions, postTransaction, deleteTransaction, updateTransaction }
