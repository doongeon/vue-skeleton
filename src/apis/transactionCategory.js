import axios from 'axios'

const BASE_URL = 'http://localhost:5173/api'

const fetchTransactionCategories = async () => {
  try {
    const res = await axios.get(BASE_URL + '/transactionCategory')
    if (res.status !== 200) {
      alert('TransactionCategories를 불러오는데 실패했습니다.')
      console.log('  ⚠️  : ', res)
    }
    return res
  } catch (e) {
    console.log('  ⚠️ fail to fetch transaction : ', e)
  }
}

const postTransactionCategory = async (transactionCategory) => {
  try {
    const res = await axios.post(BASE_URL + '/transactionCategory', transactionCategory)
    if (res.status !== 201) {
      alert('TransactionCategory를 추가하는데 실패했습니다.')
      console.log('  ⚠️  : ', res)
    }
    return res
  } catch (e) {
    console.log('  ⚠️  : ', e)
  }
}

const deleteTransactionCategory = async (transactionCategoryId) => {
  try {
    const res = await axios.delete(BASE_URL + `/transactionCategory/${transactionCategoryId}`)
    if (res.status !== 200) {
      alert('TransactionCategory를 삭제하는데 실패했습니다.')
      console.log('  ⚠️  : ', res)
    }
    return res
  } catch (e) {
    console.log('  ⚠️  : ', e)
  }
}

const updateTransactionCategory = async (transactionCategory) => {
  try {
    const res = await axios.put(
      BASE_URL + `/transactionCategory/${transactionCategory.id}`,
      transactionCategory,
    )
    if (res.status !== 200) {
      alert('TransactionCategory을 수정하는데 실패했습니다.')
      console.log('  ⚠️  : ', res)
    }
    return res
  } catch (e) {
    console.log('  ⚠️  : ', e)
  }
}

export default {
  fetchTransactionCategories,
  postTransactionCategory,
  deleteTransactionCategory,
  updateTransactionCategory,
}
