import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '../types'
import transactionRequest from '../apis/transaction'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useTransactionStore = defineStore('transactionStore', () => {
  const states = reactive({ transactions: [] })

  const initStore = async () => {
    try {
      const axiosResponse = await transactionRequest.fetchTransactions()
      states.transactions = axiosResponse.data
    } catch (e) {
      console.error('initStore 실패:', e)
      states.transactions = [] // fallback 처리
    }
  }

  /**
   * typeId, categoryId는 types/index.js 에 있는 객체를 사용할 수 있습니다.
   * typeId: TRANSACTION_TYPE.expense
   * categoryId: TRANSACTION_CATEGORY['교통']
   * 시간 문자열은 ISOString을 사용합니다.
   *
   * 성공시 추가한 transaction객체 반환
   */
  const addTransaction = async ({ typeId, categoryId, amount, memo, date }) => {
    if (!Object.values(TRANSACTION_TYPE).find((id) => id === typeId)) {
      alert('addAccount typeId가 올바르지 않습니다.')
    }
    if (!Object.values(TRANSACTION_CATEGORY).find((id) => id === categoryId)) {
      alert('addAccount categoryId가 올바르지 않습니다.')
    }
    if (!parseInt(amount) || parseInt(amount) < 0) {
      alert('addTransaction amout가 올바르지 않습니다.')
    }

    const currentTime = new Date().toISOString()
    const newTransaction = {
      id: String(new Date().getTime()),
      userId: String(1),
      typeId: String(typeId),
      categoryId: String(categoryId),
      amount,
      memo,
      date,
      createdAt: currentTime,
      updatedAt: currentTime,
    }

    const axiosResponse = await transactionRequest.postTransaction(newTransaction)
    if (axiosResponse && axiosResponse.status === 201) {
      states.transactions.push(newTransaction)
      return newTransaction
    }
  }

  /**
   * transactionId는 문자열 입니다.
   * 성공시 삭제한 transaction객체 반환
   */
  const deleteTransaction = async (transactionId) => {
    let idx = states.transactions.findIndex((a) => a.id === transactionId)
    if (idx < 0) return

    const axiosResponse = await transactionRequest.deleteTransaction(transactionId)
    if (axiosResponse && axiosResponse.status === 200) return states.transactions.splice(idx, 1)
  }

  /**
   * 사용 방법
   *
   * 시간 문자열은 ISOString을 사용합니다.
   * const time = new Date().toISOString()
   *
   * id는 문자열 입니다.
   *
   * updateTransaction({ id: '1', categoryId: TRANSACTION_CATEGORY['월급'] })
   *
   * updateTransaction({ id: '1', categoryId: TRANSACTION_CATEGORY['월급'], amout: 1000 })
   *
   * updateTransaction({ id: '1', date: newDate })
   *
   * 성공시 업데이트한 transaction객체 반환
   */
  const updateTransaction = async ({ id, typeId, categoryId, amount, memo, date }) => {
    const idx = states.transactions.findIndex((a) => a.id === id)

    if (typeof id !== 'string') alert('updateAccount id가 올바르지 않습니다. id가 String이 아님')
    if (idx < 0) alert('updateAccount id가 올바르지 않습니다. 해당 id를 찾을 수 없음')

    const currentTime = new Date().toISOString()
    const prev = states.transactions[idx]
    const newTransaction = {
      ...prev,
      typeId: typeId === undefined ? prev.typeId : String(typeId),
      categoryId: categoryId === undefined ? prev.categoryId : String(categoryId),
      amount: amount === undefined ? prev.amount : amount,
      memo: memo === undefined ? prev.memo : memo,
      date: date === undefined ? prev.date : date,
      updatedAt: currentTime,
    }

    const axiosResponse = await transactionRequest.updateTransaction(newTransaction)
    if (axiosResponse.status === 200) {
      states.transactions[idx] = newTransaction
      return newTransaction
    }
  }

  // 스토어가 생성되자마자 transactions 데이터를 서버에서 한 번 불러와 초기화
  // 로그인 별 관리를 위해선 외부로 빼고, 컴포넌트에서 onMounted(명시적 호출) 권장
  initStore()

  return { states, actions: { addTransaction, deleteTransaction, updateTransaction } }
})
