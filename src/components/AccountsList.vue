<template>
  <div class="accounts-list">
    <div v-if="store.accounts.length === 0" class="empty-state">
      <v-card class="text-center pa-8" elevation="1">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-account-plus</v-icon>
        <h3 class="text-h6 mb-2">Нет учетных записей</h3>
        <p class="text-body-2 text-grey">Нажмите кнопку "+" чтобы добавить первую учетную запись</p>
      </v-card>
    </div>

    <div v-else>
      <v-card class="mb-4" elevation="1">
        <v-card-text class="py-3">
          <v-row align="center" no-gutters>
            <v-col cols="auto">
              <v-chip color="primary" size="small" class="me-2">
                Всего: {{ store.accounts.length }}
              </v-chip>
            </v-col>
            <v-col cols="auto">
              <v-chip color="success" size="small" class="me-2">
                Валидные: {{ store.validAccounts.length }}
              </v-chip>
            </v-col>
            <v-col cols="auto">
              <v-chip color="warning" size="small">
                С ошибками: {{ store.invalidAccounts.length }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <div class="accounts-grid">
        <AccountForm
          v-for="account in store.accounts"
          :key="account.id"
          :account="account"
          @delete="handleDeleteAccount"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import AccountForm from './AccountForm.vue'

const store = useAccountsStore()

const handleDeleteAccount = (id: string) => {
  store.deleteAccount(id)
}
</script>

<style scoped>
.accounts-list {
  min-height: 200px;
}

.empty-state {
  margin: 2rem 0;
}

.accounts-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .empty-state {
    margin: 4rem 0;
  }
}

.v-chip {
  font-weight: 500;
}
</style>
