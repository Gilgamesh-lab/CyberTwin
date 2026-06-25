<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useCompanyStore } from '../stores/companyStore'
import { useAssetStore } from '../stores/assetStore'
import { useVulnerabilityStore } from '../stores/vulnerabilityStore'

const companyStore = useCompanyStore()
const assetStore = useAssetStore()
const vulnerabilityStore = useVulnerabilityStore()

const modeCreation = ref(false)

const formData = ref({
  name: '',
  sector: '',
  employees: 0,
  servers: 0,
  workstations: 0,
  exposedServices: []
})

const sectors = [
  'Finance', 'Santé', 'Éducation', 'Commerce de détail',
  'Manufacturier', 'Technologie', 'Services publics', 'Autre'
]

const availableServices = [
  'Site Web', 'Email', 'VPN', 'FTP',
  'Base de données', 'API REST', 'Cloud Services', 'E-commerce'
]

const errors = ref({})

const profilComplet = computed(() => {
  return formData.value.name.trim() !== '' && formData.value.sector !== ''
})

const validateForm = () => {
  errors.value = {}
  if (!formData.value.name.trim()) errors.value.name = 'Le nom de l\'entreprise est requis'
  if (!formData.value.sector) errors.value.sector = 'Le secteur d\'activité est requis'
  if (formData.value.employees < 0) errors.value.employees = 'Doit être positif'
  if (formData.value.servers < 0) errors.value.servers = 'Doit être positif'
  if (formData.value.workstations < 0) errors.value.workstations = 'Doit être positif'
  return Object.keys(errors.value).length === 0
}

const selectionnerEntreprise = (company) => {
  modeCreation.value = false
  companyStore.selectionnerEntreprise(company)
  assetStore.chargerActifs(company.id_entreprise)
  vulnerabilityStore.chargerVulnerabilites(company.id_entreprise)
}

const ouvrirCreation = () => {
  modeCreation.value = true
  formData.value = { name: '', sector: '', employees: 0, servers: 0, workstations: 0, exposedServices: [] }
  errors.value = {}
}

watch(() => companyStore.companyData, (company) => {
  if (company && !modeCreation.value) {
    formData.value = { ...company, exposedServices: company.exposedServices || [] }
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!validateForm()) return
  try {
    if (modeCreation.value) {
      const nouvelle = await companyStore.creerEntreprise(formData.value)
      modeCreation.value = false
      assetStore.chargerActifs(nouvelle.id_entreprise)
      vulnerabilityStore.chargerVulnerabilites(nouvelle.id_entreprise)
      alert(`Entreprise « ${nouvelle.name} » créée avec succès !`)
    } else {
      await companyStore.updateCompany(formData.value)
      alert('Modifications enregistrées avec succès !')
    }
  } catch (erreur) {
    alert('Erreur lors de l\'enregistrement')
  }
}

const toggleService = (service) => {
  const index = formData.value.exposedServices.indexOf(service)
  if (index === -1) formData.value.exposedServices.push(service)
  else formData.value.exposedServices.splice(index, 1)
}

onMounted(async () => {
  await companyStore.chargerEntreprise()
  if (companyStore.companyData) {
    assetStore.chargerActifs(companyStore.companyData.id_entreprise)
    vulnerabilityStore.chargerVulnerabilites(companyStore.companyData.id_entreprise)
  }
})
</script>

<template>
  <div class="company-page">
    <div v-if="companyStore.chargement" class="conteneur-chargement">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>

    <template v-else>
      <div class="page-header">
        <h1>Profil Entreprise</h1>
        <p class="subtitle">Sélectionnez une entreprise ou créez-en une nouvelle</p>
      </div>

      <!-- Sélecteur d'entreprise -->
      <div class="section-selection">
        <h2 class="section-title">Entreprises</h2>
        <div class="grille-entreprises">
          <div
            v-for="company in companyStore.companies"
            :key="company.id_entreprise"
            class="carte-entreprise"
            :class="{ 'selectionnee': companyStore.companyData?.id_entreprise === company.id_entreprise && !modeCreation }"
            @click="selectionnerEntreprise(company)"
          >
            <div class="carte-icone">🏢</div>
            <div class="carte-nom">{{ company.name }}</div>
            <div class="carte-secteur">{{ company.sector }}</div>
            <div class="carte-info">
              <span>{{ company.employees }} employés</span>
              <span>{{ company.servers }} serveurs</span>
            </div>
            <div v-if="companyStore.companyData?.id_entreprise === company.id_entreprise && !modeCreation" class="badge-selection">
              ✓ Sélectionnée
            </div>
          </div>

          <div class="carte-entreprise carte-nouvelle" :class="{ 'selectionnee': modeCreation }" @click="ouvrirCreation">
            <div class="carte-icone">➕</div>
            <div class="carte-nom">Nouvelle entreprise</div>
            <div class="carte-secteur">Créer un profil</div>
          </div>
        </div>
      </div>

      <!-- Formulaire -->
      <div class="section-formulaire" v-if="companyStore.companyData || modeCreation">
        <h2 class="section-title">
          {{ modeCreation ? 'Nouvelle entreprise' : `Modifier — ${companyStore.companyData?.name}` }}
          <span v-if="!modeCreation" class="badge-statut" :class="{ 'complet': profilComplet }">
            {{ profilComplet ? '✓ Complet' : '○ Incomplet' }}
          </span>
        </h2>

        <form @submit.prevent="handleSubmit" class="company-form">
          <div class="form-section">
            <h3 class="section-sub-title">Informations générales</h3>

            <div class="form-group">
              <label for="name">Nom *</label>
              <input id="name" v-model="formData.name" type="text" :class="{ 'error': errors.name }" placeholder="Ex: Ma Société SAS" />
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="sector">Secteur *</label>
              <select id="sector" v-model="formData.sector" :class="{ 'error': errors.sector }">
                <option value="">Sélectionnez un secteur</option>
                <option v-for="sector in sectors" :key="sector" :value="sector">{{ sector }}</option>
              </select>
              <span v-if="errors.sector" class="error-message">{{ errors.sector }}</span>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-sub-title">Infrastructure</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="employees">Employés</label>
                <input id="employees" v-model.number="formData.employees" type="number" min="0" :class="{ 'error': errors.employees }" />
                <span v-if="errors.employees" class="error-message">{{ errors.employees }}</span>
              </div>
              <div class="form-group">
                <label for="servers">Serveurs</label>
                <input id="servers" v-model.number="formData.servers" type="number" min="0" :class="{ 'error': errors.servers }" />
                <span v-if="errors.servers" class="error-message">{{ errors.servers }}</span>
              </div>
              <div class="form-group">
                <label for="workstations">Postes de travail</label>
                <input id="workstations" v-model.number="formData.workstations" type="number" min="0" :class="{ 'error': errors.workstations }" />
                <span v-if="errors.workstations" class="error-message">{{ errors.workstations }}</span>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-sub-title">Services exposés sur Internet</h3>
            <div class="checkbox-group">
              <label
                v-for="service in availableServices"
                :key="service"
                class="checkbox-item"
                :class="{ 'selected': formData.exposedServices.includes(service) }"
              >
                <input type="checkbox" :checked="formData.exposedServices.includes(service)" @change="toggleService(service)" />
                <span>{{ service }}</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">
              {{ modeCreation ? 'Créer l\'entreprise' : 'Enregistrer les modifications' }}
            </button>
            <button v-if="modeCreation" type="button" class="btn-secondary" @click="modeCreation = false">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>

<style scoped>
.company-page {
  max-width: 960px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

h1 {
  color: var(--text-primary);
  margin: 0 0 0.5rem;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 1rem;
}

.section-selection,
.section-formulaire {
  margin-bottom: 2.5rem;
}

.section-title {
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-sub-title {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-subtle);
}

.grille-entreprises {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.carte-entreprise {
  background: var(--bg-card);
  border: 2px solid var(--border-card);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.carte-entreprise:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}

.carte-entreprise.selectionnee {
  border-color: var(--accent-primary);
  background: rgba(59, 130, 246, 0.08);
  box-shadow: var(--shadow-glow);
}

.carte-nouvelle {
  border-style: dashed;
  align-items: center;
  text-align: center;
  color: var(--text-muted);
}

.carte-icone {
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
}

.carte-nom {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.carte-secteur {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.carte-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-top: 0.5rem;
}

.carte-info span {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.badge-selection {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-primary);
}

.badge-statut {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--bg-hover);
  color: var(--text-muted);
  border: 1px solid var(--border-card);
}

.badge-statut.complet {
  background: var(--risk-low);
  color: white;
  border-color: transparent;
}

.company-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  background: var(--bg-card);
  padding: 1.75rem;
  border-radius: 12px;
  border: 1px solid var(--border-card);
  transition: all var(--transition-normal);
}

.form-section:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-card);
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all var(--transition-fast);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: inherit;
  box-sizing: border-box;
}

input:focus, select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

input.error, select.error {
  border-color: var(--risk-high);
}

.error-message {
  display: block;
  color: var(--risk-high);
  font-size: 0.8rem;
  margin-top: 0.375rem;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--border-card);
  border-radius: 8px;
  transition: all var(--transition-fast);
  background: var(--bg-secondary);
  font-weight: 400;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.checkbox-item:hover {
  border-color: var(--accent-primary);
}

.checkbox-item.selected {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--accent-primary);
  color: var(--text-primary);
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--accent-primary);
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 1rem;
  padding-top: 0.5rem;
}

.btn-primary, .btn-secondary {
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
  border-color: var(--accent-primary);
  color: var(--text-primary);
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
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .grille-entreprises {
    grid-template-columns: 1fr 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .checkbox-group {
    grid-template-columns: 1fr;
  }
  .form-actions {
    flex-direction: column;
  }
}
</style>
