import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type AccountType = 'LDAP' | 'Локальная'

export interface Label {
  text: string
}

export interface Account {
  id: string
  labels: Label[]
  type: AccountType
  login: string
  password: string | null
  isValid: boolean
}

export const useAccountsStore = defineStore(
  'accounts',
  () => {
    const accounts = ref<Account[]>([])

    const addAccount = () => {
      const newAccount: Account = {
        id: Date.now().toString(),
        labels: [],
        type: 'Локальная',
        login: '',
        password: '',
        isValid: false,
      }
      accounts.value.push(newAccount)
    }

    const deleteAccount = (id: string) => {
      const index = accounts.value.findIndex((account) => account.id === id)
      if (index !== -1) {
        accounts.value.splice(index, 1)
      }
    }

    const updateAccount = (id: string, updates: Partial<Account>) => {
      const account = accounts.value.find((acc) => acc.id === id)
      if (account) {
        Object.assign(account, updates)
        account.isValid = validateAccount(account)
      }
    }

    const validateAccount = (account: Account): boolean => {
      if (!account.login.trim()) return false

      if (account.type === 'Локальная' && !account.password?.trim()) return false

      if (account.login.length > 100) return false
      if (account.password && account.password.length > 100) return false

      const labelsString = labelsToString(account.labels)
      if (labelsString.length > 50) return false

      return true
    }

    const parseLabels = (labelsString: string): Label[] => {
      if (!labelsString.trim()) return []

      return labelsString
        .split(';')
        .map((label) => label.trim())
        .filter((label) => label.length > 0)
        .map((label) => ({ text: label }))
    }

    const labelsToString = (labels: Label[]): string => {
      return labels.map((label) => label.text).join('; ')
    }

    const validAccounts = computed(() => accounts.value.filter((account) => account.isValid))

    const invalidAccounts = computed(() => accounts.value.filter((account) => !account.isValid))

    return {
      accounts,
      addAccount,
      deleteAccount,
      updateAccount,
      validateAccount,
      parseLabels,
      labelsToString,
      validAccounts,
      invalidAccounts,
    }
  },
  {
    persist: true,
  },
)
