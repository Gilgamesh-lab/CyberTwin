<script setup>
import { onMounted } from 'vue'
import { useRiskStore } from '../stores/riskStore'
import { useAssetStore } from '../stores/assetStore'
import { useVulnerabilityStore } from '../stores/vulnerabilityStore'
import { useCompanyStore } from '../stores/companyStore'

const riskStore = useRiskStore()
const assetStore = useAssetStore()
const vulnerabilityStore = useVulnerabilityStore()
const companyStore = useCompanyStore()

const chargerDonneesEntreprise = async (companyId) => {
  await assetStore.chargerActifs(companyId)
  await vulnerabilityStore.chargerVulnerabilites(companyId)
  await riskStore.calculerRisque()
}

const changerEntreprise = async (event) => {
  const id = Number(event.target.value)
  const company = companyStore.companies.find(c => c.id_entreprise === id)
  if (company) {
    companyStore.selectionnerEntreprise(company)
    await chargerDonneesEntreprise(id)
  }
}

onMounted(async () => {
  await companyStore.chargerEntreprise()
  const companyId = companyStore.companyData?.id_entreprise
  await chargerDonneesEntreprise(companyId)
})

const imprimer = () => {
  window.print()
}

const obtenirNomActif = (actifId) => {
  const actif = assetStore.obtenirParId(actifId)
  return actif ? actif.name : 'Actif inconnu'
}


const obtenirActif = (id_actif) => {
  const actif = assetStore.obtenirParId(id_actif)
  return actif ? actif : 'Actif inconnu'
}

const obtenirLabelCriticite = (valeur) => {
  const labels = {
    'faible': 'Faible',
    'moyen': 'Moyen',
    'eleve': 'Élevé',
    'Faible': 'Faible',
    'Moyen': 'Moyen',
    'Élevé': 'Élevé',
    'Critique': 'Critique'
  }
  return labels[valeur] || valeur
}

const obtenirCouleurCriticite = (valeur) => {
  const couleurs = {
    'faible': '#22c55e',
    'moyen': '#f59e0b',
    'eleve': '#ef4444',
    'Faible': '#22c55e',
    'Moyen': '#f59e0b',
    'Élevé': '#ef4444',
    'Critique': '#dc3545'
  }
  return couleurs[valeur] || '#64748b'
}
</script>

<template>
  <div class="page-rapport">
    <div v-if="riskStore.chargement" class="conteneur-chargement">
      <div class="spinner"></div>
      <p>Génération du rapport...</p>
    </div>
    
    <div v-else-if="riskStore.erreur" class="conteneur-erreur">
      <p>{{ riskStore.erreur }}</p>
    </div>
    
    <template v-else>
      <div class="en-tete-rapport">
        <h1>Rapport de Sécurité</h1>
        <div class="selecteur-entreprise" v-if="companyStore.companies.length">
          <label for="select-entreprise-rapport">🏢 Entreprise :</label>
          <select
            id="select-entreprise-rapport"
            :value="companyStore.companyData?.id_entreprise"
            @change="changerEntreprise"
          >
            <option v-for="company in companyStore.companies" :key="company.id_entreprise" :value="company.id_entreprise">
              {{ company.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="conteneur-rapport">
      <section class="section-rapport">
        <h2>Présentation de l'entreprise</h2>
        <div class="carte-entreprise">
          <div class="ligne-info">
            <span class="label">Nom :</span>
            <span class="valeur">{{ companyStore.companyData?.name || '-' }}</span>
          </div>
          <div class="ligne-info">
            <span class="label">Secteur :</span>
            <span class="valeur">{{ companyStore.companyData?.sector || '-' }}</span>
          </div>
          <div class="ligne-info">
            <span class="label">Effectif :</span>
            <span class="valeur">{{ companyStore.companyData?.employees ?? '-' }} employés</span>
          </div>
          <div class="ligne-info">
            <span class="label">Services exposés :</span>
            <span class="valeur">{{ Array.isArray(companyStore.companyData?.exposedServices) ? companyStore.companyData.exposedServices.join(', ') : (companyStore.companyData?.exposedServices || '-') }}</span>
          </div>
        </div>
      </section>

      <section class="section-rapport">
        <h2>Inventaire des actifs</h2>
        <div class="tableau-actifs">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Adresse IP</th>
                <th>Criticité</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="actif in assetStore.assets" :key="actif.id_actif">
                <td>{{ actif.name }}</td>
                <td>{{ actif.type }}</td>
                <td>{{ actif.ipAddress }}</td>
                <td>{{ actif.criticality }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="section-rapport">
        <h2>Failles détectées</h2>
        <div class="tableau-vulnerabilites">
          <table>
            <thead>
              <tr>
                <th>Actif</th>
                <th>Vulnérabilité</th>
                <th>Criticité</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="vulnerabilite in vulnerabilityStore.vulnerabilites" :key="vulnerabilite.id_vulnerabilite">
                <td>{{ obtenirNomActif(vulnerabilite.id_actif) }}</td>
                <td>{{ vulnerabilite.type_vulnerabilite }}</td>
                <td>
                  <span class="badge-criticite" :style="{ backgroundColor: obtenirCouleurCriticite(vulnerabilite.criticality) }">
                    {{ obtenirLabelCriticite(vulnerabilite.criticality) }}
                  </span>
                </td>
                <td>{{ vulnerabilite.description || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="section-rapport">
        <h2>Niveau de risque global</h2>
        <div class="carte-risque">
          <div class="score-risque">
            <span class="label-score">Score de risque</span>
            <span class="valeur-score" :style="{ color: riskStore.getRiskLevelColor() }">
              {{ riskStore.riskScore }}/100
            </span>
          </div>
          <div class="niveau-risque">
            <span class="label-niveau">Niveau de risque</span>
            <span class="valeur-niveau" :style="{ backgroundColor: riskStore.getRiskLevelColor() }">
              {{ riskStore.getRiskLevelLabel() }}
            </span>
          </div>
        </div>
      </section>

      <section class="section-rapport">
        <h2>Recommandations de sécurité</h2>
        <div class="carte-recommandations">
          <ul>
            <li v-for="(recommandation, index) in riskStore.getRecommendations()" :key="index">
              {{ recommandation }}
            </li>
          </ul>
        </div>
      </section>
    </div>
    </template>
    
    <button class="btn-exporter" @click="imprimer">
      🖨️ Imprimer / Exporter en PDF
    </button>
  </div>
</template>

<style scoped>
.page-rapport {
  width: 100%;
}

.en-tete-rapport {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

h1 {
  color: var(--text-primary);
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.selecteur-entreprise {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.selecteur-entreprise label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

.selecteur-entreprise select {
  padding: 0.625rem 1rem;
  border: 1px solid var(--border-card);
  border-radius: 8px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.selecteur-entreprise select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.conteneur-rapport {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-rapport h2 {
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.carte-entreprise {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-card);
  transition: all var(--transition-normal);
}

.carte-entreprise:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

.ligne-info {
  display: flex;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--border-subtle);
}

.ligne-info:last-child {
  border-bottom: none;
}

.ligne-info .label {
  width: 150px;
  color: var(--text-muted);
  font-weight: 500;
}

.ligne-info .valeur {
  color: var(--text-secondary);
  flex: 1;
}

.tableau-actifs,
.tableau-vulnerabilites {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-card);
  overflow-x: auto;
  transition: all var(--transition-normal);
}

.tableau-actifs:hover,
.tableau-vulnerabilites:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--bg-secondary);
}

th {
  text-align: left;
  padding: 1rem 1.5rem;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-card);
}

td {
  padding: 1rem 1.5rem;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-subtle);
}

tr:last-child td {
  border-bottom: none;
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

.carte-risque {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-card);
  display: flex;
  gap: 2rem;
  transition: all var(--transition-normal);
}

.carte-risque:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

.score-risque,
.niveau-risque {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.label-score,
.label-niveau {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.valeur-score {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.valeur-niveau {
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
}

.carte-recommandations {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-card);
  transition: all var(--transition-normal);
}

.carte-recommandations:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

.carte-recommandations ul {
  margin: 0;
  padding-left: 1.5rem;
}

.carte-recommandations li {
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .carte-risque {
    flex-direction: column;
  }
  
  .ligne-info .label {
    width: 120px;
  }
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

.btn-exporter {
  margin-top: 2rem;
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

.btn-exporter:hover {
  background: var(--accent-secondary);
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
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

@media print {
  .sidebar,
  .btn-exporter {
    display: none;
  }
  
  .main-content {
    padding: 0;
  }
  
  .page-rapport {
    padding: 0;
  }
}
</style>
