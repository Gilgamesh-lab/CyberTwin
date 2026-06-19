<script setup>
import { ref, onMounted } from 'vue'
import { useCompanyStore } from '../stores/companyStore'

const companyStore = useCompanyStore()

const formData = ref({
  name: '',
  sector: '',
  employees: 0,
  servers: 0,
  workstations: 0,
  exposedServices: []
})

const sectors = [
  'Finance',
  'Santé',
  'Éducation',
  'Commerce de détail',
  'Manufacturier',
  'Technologie',
  'Services publics',
  'Autre'
]

const availableServices = [
  'Site Web',
  'Email',
  'VPN',
  'FTP',
  'Base de données',
  'API REST',
  'Cloud Services',
  'E-commerce'
]

const errors = ref({})

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = 'Le nom de l\'entreprise est requis'
  }
  
  if (!formData.value.sector) {
    errors.value.sector = 'Le secteur d\'activité est requis'
  }
  
  if (formData.value.employees < 0) {
    errors.value.employees = 'Le nombre d\'employés doit être positif'
  }
  
  if (formData.value.servers < 0) {
    errors.value.servers = 'Le nombre de serveurs doit être positif'
  }
  
  if (formData.value.workstations < 0) {
    errors.value.workstations = 'Le nombre de postes de travail doit être positif'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (validateForm()) {
    companyStore.updateCompany(formData.value)
    alert('Informations de l\'entreprise enregistrées avec succès!')
  }
}

const toggleService = (service) => {
  const index = formData.value.exposedServices.indexOf(service)
  if (index === -1) {
    formData.value.exposedServices.push(service)
  } else {
    formData.value.exposedServices.splice(index, 1)
  }
}

onMounted(() => {
  if (companyStore.companyData.name) {
    formData.value = { ...companyStore.companyData }
  }
})
</script>

<template>
  <div class="company-page">
    <h1>Profil Entreprise</h1>
    <p class="subtitle">Configurez les informations de votre entreprise pour l'analyse de risque cyber</p>
    
    <form @submit.prevent="handleSubmit" class="company-form">
      <div class="form-group">
        <label for="name">Nom de l'entreprise *</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          :class="{ 'error': errors.name }"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="sector">Secteur d'activité *</label>
        <select
          id="sector"
          v-model="formData.sector"
          :class="{ 'error': errors.sector }"
        >
          <option value="">Sélectionnez un secteur</option>
          <option v-for="sector in sectors" :key="sector" :value="sector">
            {{ sector }}
          </option>
        </select>
        <span v-if="errors.sector" class="error-message">{{ errors.sector }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="employees">Nombre d'employés</label>
          <input
            id="employees"
            v-model.number="formData.employees"
            type="number"
            min="0"
            :class="{ 'error': errors.employees }"
            placeholder="0"
          />
          <span v-if="errors.employees" class="error-message">{{ errors.employees }}</span>
        </div>

        <div class="form-group">
          <label for="servers">Nombre de serveurs</label>
          <input
            id="servers"
            v-model.number="formData.servers"
            type="number"
            min="0"
            :class="{ 'error': errors.servers }"
            placeholder="0"
          />
          <span v-if="errors.servers" class="error-message">{{ errors.servers }}</span>
        </div>

        <div class="form-group">
          <label for="workstations">Postes de travail clients</label>
          <input
            id="workstations"
            v-model.number="formData.workstations"
            type="number"
            min="0"
            :class="{ 'error': errors.workstations }"
            placeholder="0"
          />
          <span v-if="errors.workstations" class="error-message">{{ errors.workstations }}</span>
        </div>
      </div>

      <div class="form-group">
        <label>Services exposés sur Internet</label>
        <div class="checkbox-group">
          <label
            v-for="service in availableServices"
            :key="service"
            class="checkbox-item"
          >
            <input
              type="checkbox"
              :value="service"
              :checked="formData.exposedServices.includes(service)"
              @change="toggleService(service)"
            />
            <span>{{ service }}</span>
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">Enregistrer</button>
        <button type="button" @click="companyStore.resetCompany(); formData = { name: '', sector: '', employees: 0, servers: 0, workstations: 0, exposedServices: [] }" class="btn-secondary">
          Réinitialiser
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.company-page {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
  font-weight: 600;
}

.subtitle {
  color: #64748b;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.company-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.form-group {
  margin-bottom: 1.75rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1e293b;
  font-size: 0.9rem;
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
  background: white;
  color: #1e293b;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

input.error,
select.error {
  border-color: #ef4444;
  background: #fef2f2;
}

input.error:focus,
select.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.875rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: white;
  font-weight: 400;
  color: #1e293b;
}

.checkbox-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #3b82f6;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #64748b;
  color: white;
}

.btn-secondary:hover {
  background: #475569;
}

@media (max-width: 768px) {
  .company-form {
    padding: 1.75rem;
    border-radius: 12px;
  }

  h1 {
    font-size: 1.75rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .checkbox-group {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
