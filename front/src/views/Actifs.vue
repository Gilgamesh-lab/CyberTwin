<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAssetStore } from '../stores/assetStore'

const assetStore = useAssetStore()

const showModal = ref(false)
const isEditing = ref(false)
const editingAssetId = ref(null)
const soumissionEnCours = ref(false)

const formData = ref({
  name: '',
  type: '',
  description: '',
  ipAddress: '',
  criticality: 'medium'
})

onMounted(() => {
  assetStore.chargerActifs()
  document.addEventListener('keydown', gererToucheEchap)
})

onUnmounted(() => {
  document.removeEventListener('keydown', gererToucheEchap)
})

const gererToucheEchap = (event) => {
  if (event.key === 'Escape' && showModal.value) {
    closeModal()
  }
}

const assetTypes = [
  'Serveur Web',
  'Base de données',
  'Poste utilisateur',
  'Routeur',
  'Pare-feu',
  'Application métier'
]

const criticalityLevels = [
  { value: 'faible', label: 'Faible' },
  { value: 'moyen', label: 'Moyen' },
  { value: 'eleve', label: 'Élevé' },
  { value: 'critique', label: 'Critique' }
]

const errors = ref({})

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = 'Le nom de l\'actif est requis'
  }
  
  if (!formData.value.type) {
    errors.value.type = 'Le type d\'actif est requis'
  }
  
  if (!formData.value.ipAddress.trim()) {
    errors.value.ipAddress = 'L\'adresse IP est requise'
  } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(formData.value.ipAddress)) {
    errors.value.ipAddress = 'Format d\'adresse IP invalide'
  }
  
  return Object.keys(errors.value).length === 0
}

const openAddModal = () => {
  isEditing.value = false
  editingAssetId.value = null
  formData.value = {
    name: '',
    type: '',
    description: '',
    ipAddress: '',
    criticality: 'moyen'
  }
  errors.value = {}
  showModal.value = true
}

const openEditModal = (asset) => {
  isEditing.value = true
  editingAssetId.value = asset.id
  formData.value = {
    id: asset.id_actif,
    name: asset.name,
    type: asset.type,
    description: asset.description || '',
    ipAddress: asset.ipAddress || '',
    criticality: asset.criticality || 'medium'
  }
  errors.value = {}
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  errors.value = {}
  formData.value = {
    name: '',
    type: '',
    description: '',
    ipAddress: '',
    criticality: 'moyen'
  }
}

const handleSubmit = async () => {
  console.log('Tentative de soumission', formData.value)
  if (validateForm()) {
    console.log('Formulaire validé')
    soumissionEnCours.value = true
    
    try {
      if (isEditing.value) {
        console.log('Modification actif avec ID:', formData.value.id)
        await assetStore.modifierActif(formData.value.id, formData.value)
        alert('Actif modifié avec succès!')
      } else {
        console.log('Ajout nouvel actif')
        await assetStore.ajouterActif(formData.value)
        alert('Actif ajouté avec succès!')
      }
      closeModal()
    } catch (erreur) {
      console.error('Erreur soumission:', erreur)
      alert('Erreur lors de l\'opération: ' + erreur.message)
    } finally {
      soumissionEnCours.value = false
    }
  } else {
    console.log('Formulaire invalide:', errors.value)
    alert('Veuillez corriger les erreurs du formulaire')
  }
}

const handleDelete = async (id) => {
  console.log('Tentative de suppression actif ID:', id)
  if (confirm('Êtes-vous sûr de vouloir supprimer cet actif ?')) {
    try {
      console.log('Suppression actif ID:', id)
      await assetStore.supprimerActif(id)
      alert('Actif supprimé avec succès!')
    } catch (erreur) {
      console.error('Erreur suppression:', erreur)
      alert('Erreur lors de la suppression: ' + erreur.message)
    }
  } else {
    console.log('Suppression annulée')
  }
}

const getCriticalityColor = (criticality) => {
  const colors = {
    'Faible': '#28a745',
    'Moyen': '#ffc107',
    'Élevé': '#fd7e14',
    'Critique': '#dc3545',
    'faible': '#28a745',
    'moyen': '#ffc107',
    'eleve': '#fd7e14',
    'critique': '#dc3545'
  }
  return colors[criticality] || '#6c757d'
}

const getCriticalityLabel = (criticality) => {
  const level = criticalityLevels.find(l => l.value === criticality)
  if (level) return level.label
  // Fallback pour les valeurs de la base de données
  const labels = {
    'Faible': 'Faible',
    'Moyen': 'Moyen',
    'Élevé': 'Élevé',
    'Critique': 'Critique'
  }
  return labels[criticality] || criticality
}
</script>

<template>
  <div class="page-actifs">
    <div class="en-tete-page">
      <h1>Actifs</h1>
      <button class="btn-principal" @click="openAddModal">+ Ajouter un actif</button>
    </div>

    <div class="conteneur-tableau">
      <table class="tableau-actifs">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Adresse IP</th>
            <th>Criticité</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="asset in assetStore.assets" :key="asset.id">
            <td>{{ asset.name }}</td>
            <td>{{ asset.type }}</td>
            <td>{{ asset.ipAddress || '-' }}</td>
            <td>
              <span class="badge-criticite" :style="{ backgroundColor: getCriticalityColor(asset.criticality) }">
                {{ getCriticalityLabel(asset.criticality) }}
              </span>
            </td>
            <td>{{ asset.description || '-' }}</td>
            <td class="cellule-actions">
              <button class="btn-modifier" @click="openEditModal(asset)" title="Modifier">
                ✏️
              </button>
              <button class="btn-supprimer" @click="handleDelete(asset.id_actif)" title="Supprimer">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="assetStore.assets.length === 0" class="etat-vide">
        <p>Aucun actif détecté</p>
      </div>
    </div>

    <div v-if="showModal" class="overlay-modal" @click.self="closeModal">
      <div class="contenu-modal" @click.stop>
        <div class="en-tete-modal">
          <h2>{{ isEditing ? 'Modifier' : 'Ajouter' }} un actif</h2>
          <button class="btn-fermer" @click="closeModal">×</button>
        </div>
        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-group">
            <label for="name">Nom de l'actif *</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              :class="{ 'error': errors.name }"
              placeholder="Ex: Serveur Web"
            />
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label for="type">Type d'actif *</label>
            <select
              id="type"
              v-model="formData.type"
              :class="{ 'error': errors.type }"
            >
              <option value="">Sélectionner un type</option>
              <option v-for="type in assetTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <span v-if="errors.type" class="error-message">{{ errors.type }}</span>
          </div>

          <div class="form-group">
            <label for="ipAddress">Adresse IP *</label>
            <input
              id="ipAddress"
              v-model="formData.ipAddress"
              type="text"
              :class="{ 'error': errors.ipAddress }"
              placeholder="Ex: 192.168.1.1"
            />
            <span v-if="errors.ipAddress" class="error-message">{{ errors.ipAddress }}</span>
          </div>

          <div class="form-group">
            <label for="criticality">Criticité</label>
            <select
              id="criticality"
              v-model="formData.criticality"
            >
              <option v-for="level in criticalityLevels" :key="level.value" :value="level.value">
                {{ level.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              placeholder="Description de l'actif..."
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondaire" :disabled="soumissionEnCours">Annuler</button>
            <button type="submit" class="btn-principal" :disabled="soumissionEnCours">
              {{ soumissionEnCours ? 'En cours...' : (isEditing ? 'Modifier l\'actif' : 'Ajouter l\'actif') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-actifs {
  width: 100%;
}

.en-tete-page {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

h1 {
  color: var(--text-primary);
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.btn-principal {
  padding: 0.875rem 1.75rem;
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-subtle);
}

.btn-principal:hover:not(:disabled) {
  background: var(--accent-secondary);
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}

.btn-principal:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.conteneur-tableau {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-card);
  overflow-x: auto;
  transition: all var(--transition-normal);
}

.conteneur-tableau:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

.tableau-actifs {
  width: 100%;
  border-collapse: collapse;
}

.tableau-actifs thead {
  background: var(--bg-secondary);
}

.tableau-actifs th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-card);
}

.tableau-actifs tbody tr {
  border-bottom: 1px solid var(--border-subtle);
  transition: all var(--transition-fast);
}

.tableau-actifs tbody tr:hover {
  background: var(--bg-hover);
}

.tableau-actifs tbody tr:last-child {
  border-bottom: none;
}

.tableau-actifs td {
  padding: 1rem 1.5rem;
  color: var(--text-secondary);
}

.cellule-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-modifier,
.btn-supprimer {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all var(--transition-fast);
  font-weight: 500;
}

.btn-modifier {
  background: var(--risk-medium);
  color: white;
}

.btn-modifier:hover {
  background: #d97706;
  transform: translateY(-1px);
}

.btn-supprimer {
  background: var(--risk-high);
  color: white;
}

.btn-supprimer:hover {
  background: var(--risk-critical);
  transform: translateY(-1px);
}

.badge-criticite {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.etat-vide {
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
}

.overlay-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.contenu-modal {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-card);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-glow);
}

.en-tete-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-card);
}

.en-tete-modal h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-fermer {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all var(--transition-fast);
}

.btn-fermer:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.modal-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-card);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all var(--transition-fast);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form-group input.error,
.form-group select.error {
  border-color: var(--risk-high);
}

.error-message {
  display: block;
  margin-top: 0.375rem;
  color: var(--risk-high);
  font-size: 0.75rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-card);
}

.btn-secondaire {
  padding: 0.875rem 1.75rem;
  background: var(--bg-hover);
  color: var(--text-secondary);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-secondaire:hover:not(:disabled) {
  background: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--accent-primary);
}

.btn-secondaire:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
