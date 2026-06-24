<script setup>
import { ref, onMounted, computed } from 'vue'
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

const profilComplet = computed(() => {
  return formData.value.name.trim() !== '' &&
         formData.value.sector !== '' &&
         formData.value.employees >= 0 &&
         formData.value.servers >= 0 &&
         formData.value.workstations >= 0
})

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

const handleSubmit = async () => {
  if (validateForm()) {
    try {
      await companyStore.updateCompany(formData.value)
      alert('Informations de l\'entreprise enregistrées avec succès!')
    } catch (erreur) {
      console.log(erreur)
      alert('Erreur lors de l\'enregistrement des informations')
    }
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

onMounted(async () => {
  await companyStore.chargerEntreprise()
  if (companyStore.companyData.name) {
    formData.value = { ...companyStore.companyData }
  }
})
</script>

<template>
  <div class="company-page">
    <div v-if="companyStore.chargement" class="conteneur-chargement">
      <div class="spinner"></div>
      <p>Chargement des données...</p>
    </div>
    
    <div v-else-if="companyStore.erreur" class="conteneur-erreur">
      <p>{{ companyStore.erreur }}</p>
    </div>
    
    <template v-else>
      <div class="page-header">
        <div class="header-content">
          <h1>Profil Entreprise</h1>
          <span class="badge-statut" :class="{ 'complet': profilComplet, 'incomplet': !profilComplet }">
            {{ profilComplet ? '✓ Complet' : '○ Incomplet' }}
          </span>
        </div>
        <p class="subtitle">Configurez les informations de votre entreprise pour l'analyse de risque cyber</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="company-form">
      <div class="form-section">
        <h2 class="section-title">Informations générales</h2>
        
        <div class="form-group">
          <label for="name">Nom de l'entreprise *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            :class="{ 'error': errors.name }"
            placeholder="Ex: Ma Société SAS"
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
      </div>

      <div class="form-section">
        <h2 class="section-title">Infrastructure</h2>
        
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
            <label for="workstations">Postes de travail</label>
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
      </div>

      <div class="form-section">
        <h2 class="section-title">Services exposés sur Internet</h2>
        <div class="checkbox-group">
          <label
            v-for="service in availableServices"
            :key="service"
            class="checkbox-item"
            :class="{ 'selected': formData.exposedServices.includes(service) }"
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
    </template>
  </div>
</template>

<style scoped>
.company-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2.5rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

h1 {
  color: var(--text-primary);
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.badge-statut {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-statut.complet {
  background: var(--risk-low);
  color: white;
}

.badge-statut.incomplet {
  background: var(--bg-hover);
  color: var(--text-muted);
  border: 1px solid var(--border-card);
}

.subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
}

.company-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-card);
  transition: all var(--transition-normal);
}

.form-section:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

.section-title {
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-subtle);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.625rem;
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid var(--border-card);
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all var(--transition-fast);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: inherit;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

input.error,
select.error {
  border-color: var(--risk-high);
  background: rgba(239, 68, 68, 0.1);
}

input.error:focus,
select.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.error-message {
  display: block;
  color: var(--risk-high);
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
  gap: 0.625rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-card);
  border-radius: 8px;
  transition: all var(--transition-fast);
  background: var(--bg-secondary);
  font-weight: 400;
  color: var(--text-secondary);
}

.checkbox-item:hover {
  background: var(--bg-hover);
  border-color: var(--accent-primary);
}

.checkbox-item.selected {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--accent-primary);
  color: var(--text-primary);
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--accent-primary);
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-subtle);
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
  box-shadow: var(--shadow-subtle);
}

.btn-primary:hover {
  background: var(--accent-secondary);
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-hover);
  color: var(--text-secondary);
  border: 1px solid var(--border-card);
}

.btn-secondary:hover {
  background: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--accent-primary);
}

.conteneur-chargement {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-card);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.conteneur-erreur {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--risk-high);
  border-radius: 12px;
  padding: 2rem;
  color: var(--risk-high);
  text-align: center;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  h1 {
    font-size: 1.5rem;
  }

  .form-section {
    padding: 1.5rem;
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
