<template>
  <v-card
    class="mb-4"
    :elevation="account.isValid ? 3 : 1"
    :class="{ 'valid-account': account.isValid, 'invalid-account': !account.isValid }"
  >
    <v-card-text>
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="labelsString"
            label="Метка"
            hint="Максимум 50 символов. Разделяйте метки знаком ;"
            :rules="labelRules"
            :error="hasErrors"
            variant="outlined"
            density="compact"
            @blur="handleLabelsChange"
            @input="handleLabelsInput"
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-select
            v-model="account.type"
            :items="accountTypes"
            label="Тип записи"
            variant="outlined"
            density="compact"
            @update:model-value="handleTypeChange"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="account.login"
            label="Логин"
            :rules="loginRules"
            :error="hasLoginError"
            variant="outlined"
            density="compact"
            required
            @blur="handleFieldChange"
            @input="handleLoginInput"
          />
        </v-col>

        <v-col v-if="account.type === 'Локальная'" cols="12" md="3">
          <v-text-field
            v-model="account.password"
            label="Пароль"
            type="password"
            :rules="passwordRules"
            :error="hasPasswordError"
            variant="outlined"
            density="compact"
            required
            @blur="handleFieldChange"
            @input="handlePasswordInput"
          />
        </v-col>

        <v-col cols="12" md="1" class="d-flex align-center justify-center">
          <div class="d-flex align-center">
            <v-icon :color="account.isValid ? 'success' : 'warning'" size="small" class="me-2">
              {{ account.isValid ? 'mdi-check-circle' : 'mdi-alert-circle' }}
            </v-icon>

            <v-btn
              icon="mdi-delete"
              color="error"
              variant="text"
              size="small"
              @click="handleDelete"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAccountsStore, type Account, type AccountType } from '@/stores/accounts'

interface Props {
  account: Account
}

interface Emits {
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const store = useAccountsStore()

const labelsString = ref('')
const accountTypes: AccountType[] = ['LDAP', 'Локальная']

const labelRules = [(v: string) => !v || v.length <= 50 || 'Максимум 50 символов']

const loginRules = [
  (v: string) => !!v || 'Логин обязателен',
  (v: string) => !v || v.length <= 100 || 'Максимум 100 символов',
]

const passwordRules = [
  (v: string) => {
    if (props.account.type === 'Локальная') {
      return !!v || 'Пароль обязателен'
    }
    return true
  },
  (v: string) => !v || v.length <= 100 || 'Максимум 100 символов',
]

const hasErrors = computed(() => {
  return labelsString.value.length > 50
})

const hasLoginError = computed(() => {
  return !props.account.login.trim() || props.account.login.length > 100
})

const hasPasswordError = computed(() => {
  if (props.account.type === 'Локальная') {
    return !props.account.password?.trim() || (props.account.password?.length || 0) > 100
  }
  return false
})

const handleLabelsChange = () => {
  const labels = store.parseLabels(labelsString.value)
  store.updateAccount(props.account.id, { labels })
}

const handleLabelsInput = () => {
  if (labelsString.value.length > 50) {
    labelsString.value = labelsString.value.substring(0, 50)
  }
}

const handleTypeChange = () => {
  if (props.account.type === 'LDAP') {
    store.updateAccount(props.account.id, {
      type: props.account.type,
      password: null,
    })
  } else {
    store.updateAccount(props.account.id, {
      type: props.account.type,
      password: props.account.password || '',
    })
  }
}

const handleFieldChange = () => {
  store.updateAccount(props.account.id, {
    login: props.account.login,
    password: props.account.password,
  })
}

const handleLoginInput = () => {
  if (props.account.login.length > 100) {
    props.account.login = props.account.login.substring(0, 100)
  }
}

const handlePasswordInput = () => {
  if (props.account.password && props.account.password.length > 100) {
    props.account.password = props.account.password.substring(0, 100)
  }
}

const handleDelete = () => {
  emit('delete', props.account.id)
}

onMounted(() => {
  labelsString.value = store.labelsToString(props.account.labels)
})

watch(
  () => props.account.labels,
  (newLabels) => {
    labelsString.value = store.labelsToString(newLabels)
  },
  { deep: true },
)
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12) !important;
}

.valid-account {
  border-left: 4px solid #4caf50;
}

.invalid-account {
  border-left: 4px solid #ff9800;
}

.v-icon {
  transition: all 0.2s ease;
}
</style>
