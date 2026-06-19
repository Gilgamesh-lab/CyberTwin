<script setup>
import { ref, computed } from 'vue'
import { useAssetStore } from '../stores/assetStore'

const assetStore = useAssetStore()

const showModal = ref(false)
const isEditing = ref(false)
const editingAssetId = ref(null)

const formData = ref({
  name: '',
  type: '',
  description: '',
  ipAddress: '',
  criticality: 'medium'
})

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
}

const handleSubmit = () => {
  if (validateForm()) {
    if (isEditing.value) {
      assetStore.updateAsset(editingAssetId.value, formData.value)
    } else {
      assetStore.addAsset(formData.value)
    }
    closeModal()
  }
}

const handleDelete = (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet actif ?')) {
    assetStore.deleteAsset(id)
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
              <button @click="handleDelete(asset.id)" class="btn-delete" title="Supprimer">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>Aucun actif enregistré. Commencez par en ajouter un !</p>
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
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">
              {{ isEditing ? 'Modifier' : 'Ajouter' }}
            </button>
            <button type="button" @click="closeModal" class="btn-secondary">
              Annuler
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
  margin-bottom: 2rem;
}

h1 {
  color: #0f172a;
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: #2563eb;
}

.assets-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  border: 1px solid #e2e8f0;
}

.assets-table {
  width: 100%;
  border-collapse: collapse;
}

.assets-table thead {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
}

.assets-table th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.assets-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.assets-table tbody tr:hover {
  background: #f8fafc;
}

.assets-table tbody tr:last-child {
  border-bottom: none;
}

.assets-table td {
  padding: 1rem 1.25rem;
  color: #475569;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  font-weight: 500;
}

.btn-edit {
  background: #f59e0b;
  color: white;
}

.btn-edit:hover {
  background: #d97706;
  transform: translateY(-1px);
}

.btn-edit:active {
  transform: translateY(0);
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-delete:active {
  transform: translateY(0);
}

.criticality-badge {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  color: #64748b;
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
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
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.modal-header h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: white;
  border: 1px solid #e2e8f0;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  width: 36px;
  height: 36px;
  line-height: 1;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-close:hover {
  color: #0f172a;
  background: #f1f5f9;
  border-color: #cbd5e1;
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
  font-weight: 500;
  color: #1e293b;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
  background: white;
  color: #1e293b;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form-group input.error,
.form-group select.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.form-group input.error:focus,
.form-group select.error:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: #64748b;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-secondary:hover {
  background: #475569;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  h1 {
    font-size: 1.75rem;
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
    padding: 1.5rem 1.25rem;
  }

  .modal-form {
    padding: 1.5rem 1.25rem;
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
