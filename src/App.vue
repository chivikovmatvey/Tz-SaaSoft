<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import AccountsList from './components/AccountsList.vue'

const store = useAccountsStore()

const addAccount = () => {
  store.addAccount()
}
</script>

<template>
  <v-app style="min-height: 100vh; width: 100vw">
    <v-main>
      <v-container fluid class="pa-4" style="max-width: 100%; width: 100%">
        <v-card class="mb-6" elevation="3">
          <v-card-title class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold">Управление учетными записями</h1>
              <p class="text-subtitle-1 text-grey mt-2 mb-0">
                Добавляйте, редактируйте и удаляйте учетные записи пользователей
              </p>
            </div>
            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-plus"
              @click="addAccount"
              class="ml-4"
            >
              Добавить учетную запись
            </v-btn>
          </v-card-title>
        </v-card>

        <v-alert type="info" variant="tonal" class="mb-6" closable>
          <template v-slot:title>
            <strong>Подсказка для поля "Метка"</strong>
          </template>
          <div class="text-body-2">
            • Поле необязательное для заполнения<br />
            • Максимум 50 символов<br />
            • Разделяйте несколько меток знаком <strong>;</strong> (точка с запятой)<br />
            • Пример: <code>админ; супер-пользователь; тест</code>
          </div>
        </v-alert>

        <AccountsList />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-container {
  max-width: 100%;
  margin: 0;
}

.v-card-title h1 {
  background: linear-gradient(45deg, #1976d2, #42a5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.v-btn {
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}

code {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .v-card-title {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .v-card-title .v-btn {
    margin-left: 0 !important;
    margin-top: 1rem;
    width: 100%;
  }
}
</style>
