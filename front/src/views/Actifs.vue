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
  { value: 'low', label: 'Faible' },
  { value: 'medium', label: 'Moyen' },
  { value: 'high', label: 'Élevé' },
  { value: 'critical', label: 'Critique' }
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
    criticality: 'medium'
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
    criticality: 'medium'
  }
}

const handleSubmit = async () => {
  if (validateForm()) {
    soumissionEnCours.value = true
    
    try {
      if (isEditing.value) {
        console.log("lol : " + formData.value.id)
        await assetStore.modifierActif(formData.value.id, formData.value)
      } else {
        await assetStore.ajouterActif(formData.value)
      }
      closeModal()
    } catch (erreur) {
      console.error('Erreur soumission:', erreur)
    } finally {
      soumissionEnCours.value = false
    }
  }
}

const handleDelete = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet actif ?')) {
    try {
      await assetStore.supprimerActif(id)
    } catch (erreur) {
      console.error('Erreur suppression:', erreur)
    }
  }
}

const getCriticalityColor = (criticality) => {
  const colors = {
    low: '#28a745',
    medium: '#ffc107',
    high: '#fd7e14',
    critical: '#dc3545'
  }
  return colors[criticality] || '#6c757d'
}

const getCriticalityLabel = (criticality) => {
  const level = criticalityLevels.find(l => l.value === criticality)
  return level ? level.label : criticality
}
</script>

<template>
  <div class="assets-page">
    <div class="page-header">
      <h1>Gestion des Actifs</h1>
      <button @click="openAddModal" class="btn-primary">
        + Ajouter un actif
      </button>
    </div>

    <div class="assets-table-container">
      <table class="assets-table" v-if="assetStore.assets.length > 0">
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
              <span 
                class="criticality-badge"
                :style="{ backgroundColor: getCriticalityColor(asset.criticality) }"
              >
                {{ getCriticalityLabel(asset.criticality) }}
              </span>
            </td>
            <td>{{ asset.description || '-' }}</td>
            <td class="actions-cell">
              <button @click="openEditModal(asset)" class="btn-edit" title="Modifier">
                ✏️
              </button>
              <button @click="handleDelete(asset.id_actif)" class="btn-delete" title="Supprimer">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Aucun actif enregistré</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditing ? 'Modifier l\'actif' : 'Ajouter un actif' }}</h2>
          <button @click="closeModal" class="btn-close">×</button>
        </div>
        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-group">
            <label for="name">Nom de l'actif *</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              :class="{ 'error': errors.name }"
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
              <option value="">Sélectionnez un type</option>
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
            />
            <span v-if="errors.ipAddress" class="error-message">{{ errors.ipAddress }}</span>
          </div>

          <div class="form-group">
            <label for="criticality">Criticité</label>
            <select id="criticality" v-model="formData.criticality">
              <option v-for="level in criticalityLevels" :key="level.label" :value="level.label">
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
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary" :disabled="soumissionEnCours">Annuler</button>
            <button type="submit" class="btn-primary" :disabled="soumissionEnCours">
              {{ soumissionEnCours ? 'En cours...' : (isEditing ? 'Modifier l\'actif' : 'Ajouter l\'actif') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.assets-page {
  width: 100%;
}

.page-header {
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

.btn-primary {
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

.btn-primary:hover:not(:disabled) {
  background: var(--accent-secondary);
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.assets-table-container {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-card);
  overflow-x: auto;
  transition: all var(--transition-normal);
}

.assets-table-container:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

.assets-table {
  width: 100%;
  border-collapse: collapse;
}

.assets-table thead {
  background: var(--bg-secondary);
}

.assets-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-card);
}

.assets-table tbody tr {
  border-bottom: 1px solid var(--border-subtle);
  transition: all var(--transition-fast);
}

.assets-table tbody tr:hover {
  background: var(--bg-hover);
}

.assets-table tbody tr:last-child {
  border-bottom: none;
}

.assets-table td {
  padding: 1rem 1.5rem;
  color: var(--text-secondary);
}

.actions-cell {
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

.badge-faible {
  background: var(--risk-low);
}

.badge-moyen {
  background: var(--risk-medium);
}

.badge-eleve {
  background: var(--risk-high);
}

.badge-critique {
  background: var(--risk-critical);
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-muted);
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn var(--transition-normal);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: var(--bg-card);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-card);
  animation: slideUp var(--transition-normal);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-card);
  background: var(--bg-secondary);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: var(--bg-hover);
  border: 1px solid var(--border-card);
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0;
  width: 36px;
  height: 36px;
  line-height: 1;
  border-radius: 8px;
  transition: all var(--transition-fast);
}

.btn-close:hover {
  color: var(--text-primary);
  background: var(--bg-card);
  border-color: var(--accent-primary);
}

.modal-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid var(--border-card);
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all var(--transition-fast);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: inherit;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.form-group input.error,
.form-group select.error {
  border-color: var(--risk-high);
  background: rgba(239, 68, 68, 0.1);
}

.form-group input.error:focus,
.form-group select.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.error-message {
  display: block;
  color: var(--risk-high);
  font-size: 0.875rem;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-card);
}

.btn-secondary {
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

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--accent-primary);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  h1 {
    font-size: 1.5rem;
  }

  .assets-table {
    font-size: 0.875rem;
  }

  .assets-table th,
  .assets-table td {
    padding: 0.875rem 0.75rem;
  }

  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header {
    padding: 1.25rem;
  }

  .modal-form {
    padding: 1.25rem;
  }

  .actions-formulaire {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondaire {
    width: 100%;
  }
}
</style>
