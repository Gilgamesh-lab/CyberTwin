<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useVulnerabilityStore } from '../stores/vulnerabilityStore'
import { useAssetStore } from '../stores/assetStore'

const vulnerabilityStore = useVulnerabilityStore()
const assetStore = useAssetStore()

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

const soumettreFormulaire = () => {
  if (!validerFormulaire()) return
  
  if (vulnerabiliteEnEdition.value) {
    vulnerabilityStore.modifierVulnerabilite(vulnerabiliteEnEdition.value.id, donneesFormulaire.value)
  } else {
    vulnerabilityStore.ajouterVulnerabilite(donneesFormulaire.value)
  }
  
  fermerModal()
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
      <button class="btn-principal" @click="ouvrirModal()">Ajouter</button>
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
        <form @submit.prevent="soumettreFormulaire" class="formulaire-modal">
          <div class="groupe-formulaire">
            <label for="actifId">Actif *</label>
            <select
              id="actifId"
              v-model="donneesFormulaire.actifId"
              :class="{ 'erreur': erreurs.actifId }"
            >
              <option value="">Sélectionner un actif</option>
              <option v-for="actif in assetStore.assets" :key="actif.id" :value="actif.id">
                {{ actif.name }}
              </option>
            </select>
            <span v-if="erreurs.actifId" class="message-erreur">{{ erreurs.actifId }}</span>
          </div>

          <div class="groupe-formulaire">
            <label for="nom">Nom de la vulnérabilité *</label>
            <select
              id="nom"
              v-model="donneesFormulaire.nom"
              :class="{ 'erreur': erreurs.nom }"
            >
              <option value="">Sélectionner un type</option>
              <option v-for="type in typesVulnerabilites" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <span v-if="erreurs.nom" class="message-erreur">{{ erreurs.nom }}</span>
          </div>

          <div class="groupe-formulaire">
            <label for="criticite">Criticité</label>
            <select id="criticite" v-model="donneesFormulaire.criticite">
              <option v-for="niveau in niveauxCriticite" :key="niveau.valeur" :value="niveau.valeur">
                {{ niveau.label }}
              </option>
            </select>
          </div>

          <div class="groupe-formulaire">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="donneesFormulaire.description"
              rows="3"
            ></textarea>
          </div>

          <div class="actions-formulaire">
            <button type="button" class="btn-secondaire" @click="fermerModal">Annuler</button>
            <button type="submit" class="btn-principal">
              {{ vulnerabiliteEnEdition ? 'Modifier' : 'Ajouter' }}
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
  margin-bottom: 2rem;
}

h1 {
  color: #0f172a;
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
}

.btn-principal {
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

.btn-principal:hover {
  background: #2563eb;
}

.conteneur-tableau {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  border: 1px solid #e2e8f0;
}

.tableau-vulnerabilites {
  width: 100%;
  border-collapse: collapse;
}

.tableau-vulnerabilites thead {
  background: #0f172a;
  color: white;
}

.tableau-vulnerabilites th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tableau-vulnerabilites tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.tableau-vulnerabilites tbody tr:hover {
  background: #f8fafc;
}

.tableau-vulnerabilites tbody tr:last-child {
  border-bottom: none;
}

.tableau-vulnerabilites td {
  padding: 1rem 1.25rem;
  color: #475569;
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
  transition: all 0.2s ease;
  font-weight: 500;
}

.btn-modifier {
  background: #f59e0b;
  color: white;
}

.btn-modifier:hover {
  background: #d97706;
}

.btn-supprimer {
  background: #ef4444;
  color: white;
}

.btn-supprimer:hover {
  background: #dc2626;
}

.badge-criticite {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.etat-vide {
  padding: 4rem 2rem;
  text-align: center;
  color: #64748b;
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  pointer-events: auto;
}

.contenu-modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  pointer-events: auto;
}

.en-tete-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.en-tete-modal h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-fermer {
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

.btn-fermer:hover {
  color: #0f172a;
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.formulaire-modal {
  padding: 1.5rem;
}

.groupe-formulaire {
  margin-bottom: 1.25rem;
}

.groupe-formulaire label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1e293b;
  font-size: 0.9rem;
}

.groupe-formulaire select,
.groupe-formulaire textarea {
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

.groupe-formulaire select:focus,
.groupe-formulaire textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.groupe-formulaire select.erreur {
  border-color: #ef4444;
  background: #fef2f2;
}

.groupe-formulaire select.erreur:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
}

.message-erreur {
  display: block;
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.actions-formulaire {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-secondaire {
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

.btn-secondaire:hover {
  background: #475569;
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
    padding: 1rem 1.25rem;
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
