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

onMounted(() => {
  riskStore.calculateRisk()
})

const obtenirNomActif = (actifId) => {
  const actif = assetStore.obtenirParId(actifId)
  return actif ? actif.name : 'Actif inconnu'
}

const obtenirLabelCriticite = (valeur) => {
  const labels = {
    faible: 'Faible',
    moyen: 'Moyen',
    eleve: 'Élevé'
  }
  return labels[valeur] || valeur
}

const obtenirCouleurCriticite = (valeur) => {
  const couleurs = {
    faible: '#22c55e',
    moyen: '#f59e0b',
    eleve: '#ef4444'
  }
  return couleurs[valeur] || '#64748b'
}
</script>

<template>
  <div class="page-rapport">
    <h1>Rapport de Sécurité</h1>
    
    <div class="conteneur-rapport">
      <section class="section-rapport">
        <h2>Présentation de l'entreprise</h2>
        <div class="carte-entreprise">
          <div class="ligne-info">
            <span class="label">Nom :</span>
            <span class="valeur">{{ companyStore.companyData.name }}</span>
          </div>
          <div class="ligne-info">
            <span class="label">Secteur :</span>
            <span class="valeur">{{ companyStore.companyData.sector }}</span>
          </div>
          <div class="ligne-info">
            <span class="label">Effectif :</span>
            <span class="valeur">{{ companyStore.companyData.employees }} employés</span>
          </div>
          <div class="ligne-info">
            <span class="label">Services exposés :</span>
            <span class="valeur">{{ companyStore.companyData.exposedServices.join(', ') }}</span>
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
              <tr v-for="actif in assetStore.assets" :key="actif.id">
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
              <tr v-for="vulnerabilite in vulnerabilityStore.vulnerabilites" :key="vulnerabilite.id">
                <td>{{ obtenirNomActif(vulnerabilite.actifId) }}</td>
                <td>{{ vulnerabilite.nom }}</td>
                <td>
                  <span class="badge-criticite" :style="{ backgroundColor: obtenirCouleurCriticite(vulnerabilite.criticite) }">
                    {{ obtenirLabelCriticite(vulnerabilite.criticite) }}
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
  </div>
</template>

<style scoped>
.page-rapport {
  width: 100%;
}

h1 {
  color: #0f172a;
  margin-bottom: 2rem;
  font-size: 1.75rem;
  font-weight: 600;
}

.conteneur-rapport {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-rapport h2 {
  color: #1e293b;
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.carte-entreprise {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.ligne-info {
  display: flex;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.ligne-info:last-child {
  border-bottom: none;
}

.ligne-info .label {
  width: 150px;
  color: #64748b;
  font-weight: 500;
}

.ligne-info .valeur {
  color: #0f172a;
  flex: 1;
}

.tableau-actifs,
.tableau-vulnerabilites {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8fafc;
}

th {
  text-align: left;
  padding: 1rem;
  color: #475569;
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 1px solid #e2e8f0;
}

td {
  padding: 1rem;
  color: #0f172a;
  border-bottom: 1px solid #f1f5f9;
}

tr:last-child td {
  border-bottom: none;
}

.badge-criticite {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
}

.carte-risque {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  gap: 2rem;
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
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.valeur-score {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0f172a;
}

.valeur-niveau {
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
}

.carte-recommandations {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.carte-recommandations ul {
  margin: 0;
  padding-left: 1.5rem;
}

.carte-recommandations li {
  color: #475569;
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
</style>
