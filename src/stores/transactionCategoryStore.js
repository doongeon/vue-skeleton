import transactionCategoryRequest from '../apis/transactionCategory'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useTransactionCategoryStore = defineStore('transactionCategoryStore', () => {
  /**
   * transactionCategories: [
   *   { id: '1', name: '식비', icon: '🍽️', accountTypeId: '1' },
   *   { id: '2', name: '교통', icon: '🚗', accountTypeId: '1' },
   *   { id: '3', name: '문화/여가', icon: '🎮', accountTypeId: '1' },
   *   { id: '4', name: '술/유흥', icon: '🍺', accountTypeId: '1' },
   *   { id: '5', name: '쇼핑', icon: '🛍️', accountTypeId: '1' },
   *   { id: '6', name: '여행/숙박', icon: '🏨', accountTypeId: '1' },
   *   { id: '7', name: '월급', icon: '💼', accountTypeId: '2' },
   *   { id: '8', name: '용돈', icon: '💸', accountTypeId: '2' },
   *   { id: '9', name: '보너스', icon: '🎁', accountTypeId: '2' },
   *   { id: '10', name: '매매', icon: '📈', accountTypeId: '2' },
   *   { id: '11', name: '이자', icon: '💰', accountTypeId: '2' },
   * ]
   */
  const states = reactive({ transactionCategories: [] })

  const initStore = async () => {
    try {
      const axiosResponse = await transactionCategoryRequest.fetchTransactionCategories()
      states.transactionCategories = axiosResponse.data
    } catch (e) {
      console.error('initStore 실패:', e)
      states.transactionCategories = [] // fallback 처리
    }
  }

  /**
   * 성공시 추가한 transactionCategory객체 반환
   */
  const addTransactionCategory = async ({ name, icon, accountTypeId }) => {
    const newTransactionCategory = {
      id: String(new Date().getTime()),
      name,
      icon,
      accountTypeId,
    }

    const axiosResponse =
      await transactionCategoryRequest.postTransactionCategory(newTransactionCategory)
    if (axiosResponse && axiosResponse.status === 201) {
      states.transactionCategories.push(newTransactionCategory)
      return newTransactionCategory
    }
  }

  /**
   * transactionCategoryId는 문자열 입니다.
   *
   * 성공시 삭제한 transactionCategory객체 반환
   */
  const deleteTransactionCategory = async (transactionCategoryId) => {
    let idx = states.transactionCategories.findIndex((a) => a.id === transactionCategoryId)
    if (idx < 0) return

    const axiosResponse =
      await transactionCategoryRequest.deleteTransactionCategory(transactionCategoryId)
    if (axiosResponse && axiosResponse.status === 200)
      return states.transactionCategories.splice(idx, 1)
  }

  /**
   * 사용 방법
   *
   * id는 문자열 입니다.
   *
   * 성공시 업데이트한 transactionCategories객체 반환
   */
  const updateTransactionCategory = async ({ id, name, icon, accountTypeId }) => {
    const idx = states.transactionCategories.findIndex((a) => a.id === id)

    if (typeof id !== 'string')
      alert('updateTransactionCategory id가 올바르지 않습니다. id가 String이 아님')
    if (idx < 0) alert('updateTransactionCategory id가 올바르지 않습니다. 해당 id를 찾을 수 없음')

    const prev = states.transactionCategories[idx]
    const newTransactionCategory = {
      ...prev,
      name: name === undefined ? prev.name : String(name),
      icon: icon === undefined ? prev.icon : String(icon),
      accountTypeId: accountTypeId === undefined ? prev.accountTypeId : accountTypeId,
    }

    const axiosResponse =
      await transactionCategoryRequest.updateTransactionCategory(newTransactionCategory)
    if (axiosResponse.status === 200) {
      states.transactionCategories[idx] = newTransactionCategory
      return newTransactionCategory
    }
  }

  initStore()

  return {
    states,
    actions: {
      addTransactionCategory,
      deleteTransactionCategory,
      updateTransactionCategory,
    },
  }
})
