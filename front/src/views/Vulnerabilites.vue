<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useVulnerabilityStore } from '../stores/vulnerabilityStore'
import { useAssetStore } from '../stores/assetStore'

const vulnerabilityStore = useVulnerabilityStore()
const assetStore = useAssetStore()
const soumissionEnCours = ref(false)

onMounted(() => {
  assetStore.chargerActifs()
  vulnerabilityStore.chargerVulnerabilites()
})

const afficherModal = ref(false)
const vulnerabiliteEnEdition = ref(null)
const donneesFormulaire = ref({
  actifId: '',
  nom: '',
  criticite: 'moyen',
  description: ''
})

const typesVulnerabilites = [
  'Logiciel obsolète',
  'Mot de passe faible',
  'Port exposé',
  'Sauvegarde manquante',
  'Configuration incorrecte',
  'Patch manquant',
  'Certificat expiré'
]

const niveauxCriticite = [
  { valeur: 'faible', label: 'Faible' },
  { valeur: 'moyen', label: 'Moyen' },
  { valeur: 'eleve', label: 'Élevé' }
]

const erreurs = ref({})

const validerFormulaire = () => {
  erreurs.value = {}
  
  if (!donneesFormulaire.value.actifId) {
    erreurs.value.actifId = 'L\'actif est requis'
  }
  
  if (!donneesFormulaire.value.nom.trim()) {
    erreurs.value.nom = 'Le nom de la vulnérabilité est requis'
  }
  
  return Object.keys(erreurs.value).length === 0
}

const ouvrirModal = (vulnerabilite = null) => {
  if (vulnerabilite) {
    vulnerabiliteEnEdition.value = vulnerabilite
    donneesFormulaire.value = { ...vulnerabilite }
  } else {
    vulnerabiliteEnEdition.value = null
    donneesFormulaire.value = {
      actifId: '',
      nom: '',
      criticite: 'moyen',
      description: ''
    }
  }
  afficherModal.value = true
}

const fermerModal = () => {
  afficherModal.value = false
  erreurs.value = {}
  vulnerabiliteEnEdition.value = null
}

const soumettreFormulaire = async () => {
  if (!validerFormulaire()) return
  
  soumissionEnCours.value = true
  
  try {
    if (vulnerabiliteEnEdition.value) {
      vulnerabilityStore.modifierVulnerabilite(vulnerabiliteEnEdition.value.id, donneesFormulaire.value)
    } else {
      vulnerabilityStore.ajouterVulnerabilite(donneesFormulaire.value)
    }
    
    fermerModal()
  } catch (erreur) {
    console.error('Erreur soumission:', erreur)
  } finally {
    soumissionEnCours.value = false
  }
}

const supprimerVulnerabilite = (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette vulnérabilité ?')) {
    vulnerabilityStore.supprimerVulnerabilite(id)
  }
}

const obtenirNomActif = (actifId) => {
  const actif = assetStore.obtenirParId(actifId)
  return actif ? actif.name : 'Actif inconnu'
}

const obtenirLabelCriticite = (valeur) => {
  const niveau = niveauxCriticite.find(n => n.valeur === valeur)
  return niveau ? niveau.label : valeur
}

const obtenirCouleurCriticite = (valeur) => {
  const couleurs = {
    faible: '#22c55e',
    moyen: '#f59e0b',
    eleve: '#ef4444'
  }
  return couleurs[valeur] || '#64748b'
}

const vulnerabilitesAvecActifs = computed(() => {
  return vulnerabilityStore.vulnerabilites.map(v => ({
    ...v,
    nomActif: obtenirNomActif(v.actifId)
  }))
})

const gererToucheEchap = (event) => {
  if (event.key === 'Escape' && afficherModal.value) {
    fermerModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', gererToucheEchap)
})

onUnmounted(() => {
  document.removeEventListener('keydown', gererToucheEchap)
})
</script>

<template>
  <div class="page-vulnerabilites">
    <div class="en-tete-page">
      <h1>Vulnérabilités</h1>
      <button class="btn-principal" @click="ouvrirModal()">+ Ajouter une vulnérabilité</button>
    </div>

    <div class="conteneur-tableau">
      <table class="tableau-vulnerabilites">
        <thead>
          <tr>
            <th>Actif</th>
            <th>Vulnérabilité</th>
            <th>Criticité</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vulnerabilite in vulnerabilitesAvecActifs" :key="vulnerabilite.id">
            <td>{{ vulnerabilite.nomActif }}</td>
            <td>{{ vulnerabilite.nom }}</td>
            <td>
              <span class="badge-criticite" :style="{ backgroundColor: obtenirCouleurCriticite(vulnerabilite.criticite) }">
                {{ obtenirLabelCriticite(vulnerabilite.criticite) }}
              </span>
            </td>
            <td>{{ vulnerabilite.description || '-' }}</td>
            <td class="cellule-actions">
              <button class="btn-modifier" @click="ouvrirModal(vulnerabilite)" title="Modifier">
                ✏️
              </button>
              <button class="btn-supprimer" @click="supprimerVulnerabilite(vulnerabilite.id)" title="Supprimer">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="vulnerabilitesAvecActifs.length === 0" class="etat-vide">
        <p>Aucune vulnérabilité détectée</p>
      </div>
    </div>

    <div v-if="afficherModal" class="overlay-modal" @click.self="fermerModal">
      <div class="contenu-modal" @click.stop>
        <div class="en-tete-modal">
          <h2>{{ vulnerabiliteEnEdition ? 'Modifier' : 'Ajouter' }} une vulnérabilité</h2>
          <button class="btn-fermer" @click="fermerModal">×</button>
        </div>
        <form @submit.prevent="soumettreFormulaire" class="modal-form">
          <div class="form-group">
            <label for="actifId">Actif *</label>
            <select
              id="actifId"
              v-model="donneesFormulaire.actifId"
              :class="{ 'error': erreurs.actifId }"
            >
              <option value="">Sélectionner un actif</option>
              <option v-for="actif in assetStore.assets" :key="actif.id" :value="actif.id">
                {{ actif.name }}
              </option>
            </select>
            <span v-if="erreurs.actifId" class="error-message">{{ erreurs.actifId }}</span>
          </div>

          <div class="form-group">
            <label for="nom">Nom de la vulnérabilité *</label>
            <select
              id="nom"
              v-model="donneesFormulaire.nom"
              :class="{ 'error': erreurs.nom }"
            >
              <option value="">Sélectionner un type</option>
              <option v-for="type in typesVulnerabilites" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <span v-if="erreurs.nom" class="error-message">{{ erreurs.nom }}</span>
          </div>

          <div class="form-group">
            <label for="criticite">Criticité</label>
            <select id="criticite" v-model="donneesFormulaire.criticite">
              <option v-for="niveau in niveauxCriticite" :key="niveau.valeur" :value="niveau.valeur">
                {{ niveau.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="donneesFormulaire.description"
              rows="3"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="fermerModal" :disabled="soumissionEnCours">Annuler</button>
            <button type="submit" class="btn-primary" :disabled="soumissionEnCours">
              {{ soumissionEnCours ? 'En cours...' : (vulnerabiliteEnEdition ? 'Modifier la vulnérabilité' : 'Ajouter la vulnérabilité') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-vulnerabilites {
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

.tableau-vulnerabilites {
  width: 100%;
  border-collapse: collapse;
}

.tableau-vulnerabilites thead {
  background: var(--bg-secondary);
}

.tableau-vulnerabilites th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-card);
}

.tableau-vulnerabilites tbody tr {
  border-bottom: 1px solid var(--border-subtle);
  transition: all var(--transition-fast);
}

.tableau-vulnerabilites tbody tr:hover {
  background: var(--bg-hover);
}

.tableau-vulnerabilites tbody tr:last-child {
  border-bottom: none;
}

.tableau-vulnerabilites td {
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

.etat-vide {
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-muted);
}

.etat-vide p {
  font-size: 1.1rem;
  margin: 0;
}

.overlay-modal {
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
  pointer-events: auto;
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

.contenu-modal {
  background: var(--bg-card);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-card);
  pointer-events: auto;
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

.en-tete-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-card);
  background: var(--bg-secondary);
}

.en-tete-modal h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-fermer {
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

.btn-fermer:hover {
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
  .en-tete-page {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  h1 {
    font-size: 1.5rem;
  }

  .tableau-vulnerabilites {
    font-size: 0.875rem;
  }

  .tableau-vulnerabilites th,
  .tableau-vulnerabilites td {
    padding: 0.875rem 0.75rem;
  }

  .contenu-modal {
    width: 95%;
    max-height: 95vh;
  }

  .en-tete-modal {
    padding: 1.25rem;
  }

  .formulaire-modal {
    padding: 1.25rem;
  }

  .actions-formulaire {
    flex-direction: column;
  }

  .btn-principal,
  .btn-secondaire {
    width: 100%;
  }
}
</style>
