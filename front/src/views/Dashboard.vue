<script setup>
import { onMounted, ref } from 'vue'
import { useRiskStore } from '../stores/riskStore'
import { useVulnerabilityStore } from '../stores/vulnerabilityStore'
import { useAssetStore } from '../stores/assetStore'
import Chart from 'chart.js/auto'

const riskStore = useRiskStore()
const vulnerabilityStore = useVulnerabilityStore()
const assetStore = useAssetStore()

const chartCanvas = ref(null)
let chartInstance = null

onMounted(async () => {
  await assetStore.chargerActifs()
  await vulnerabilityStore.chargerVulnerabilites()
  await companyStore.chargerEntreprise()
  await riskStore.calculerRisque()
  creerGraphique()
})

const creerGraphique = () => {
  const ctx = chartCanvas.value.getContext('2d')
  
  const criticiteFaible = vulnerabilityStore.vulnerabilites.filter(v => v.criticite === 'faible').length
  const criticiteMoyen = vulnerabilityStore.vulnerabilites.filter(v => v.criticite === 'moyen').length
  const criticiteEleve = vulnerabilityStore.vulnerabilites.filter(v => v.criticite === 'eleve').length

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Faible', 'Moyen', 'Élevé'],
      datasets: [{
        data: [criticiteFaible, criticiteMoyen, criticiteEleve],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#d1d5db',
            font: {
              size: 14
            },
            padding: 20
          }
        }
      }
    }
  })
}
</script>

<template>
  <div class="page-dashboard">
    <div v-if="riskStore.chargement" class="conteneur-chargement">
      <div class="spinner"></div>
      <p>Chargement du tableau de bord...</p>
    </div>
    
    <div v-else-if="riskStore.erreur" class="conteneur-erreur">
      <p>{{ riskStore.erreur }}</p>
    </div>
    
    <template v-else>
      <h1>Tableau de bord</h1>
    
      <div class="grille-metriques">
        <div class="carte-metrique">
          <div class="label-metrique">Total Actifs</div>
          <div class="valeur-metrique">{{ riskStore.metrics.totalAssets }}</div>
        </div>
        <div class="carte-metrique">
          <div class="label-metrique">Total Vulnérabilités</div>
          <div class="valeur-metrique">{{ riskStore.metrics.totalVulnerabilities }}</div>
        </div>
        <div class="carte-metrique">
          <div class="label-metrique">Score de Risque</div>
          <div class="valeur-metrique" :style="{ color: riskStore.getRiskLevelColor() }">
            {{ riskStore.riskScore }}/100
          </div>
        </div>
        <div class="carte-metrique">
          <div class="label-metrique">Niveau de Risque</div>
          <div class="valeur-metrique" :style="{ color: riskStore.getRiskLevelColor() }">
            {{ riskStore.getRiskLevelLabel() }}
          </div>
        </div>
      </div>

    <div class="grille-graphiques">
      <div class="carte-graphique">
        <h3>Répartition des vulnérabilités par criticité</h3>
        <div class="conteneur-graphique">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>
    </div>

    <div class="carte-recommandations">
      <h3>Recommandations</h3>
      <ul>
        <li v-for="(recommandation, index) in riskStore.getRecommendations()" :key="index">
          {{ recommandation }}
        </li>
      </ul>
    </div>
    </template>
  </div>
</template>

<style scoped>
.page-dashboard {
  width: 100%;
}

h1 {
  color: var(--text-primary);
  margin-bottom: 2.5rem;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.grille-metriques {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.carte-metrique {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-card);
  transition: all var(--transition-normal);
}

.carte-metrique:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}

.label-metrique {
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.valeur-metrique {
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.grille-graphiques {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.carte-graphique {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-card);
  transition: all var(--transition-normal);
}

.carte-graphique:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

.carte-graphique h3 {
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.conteneur-graphique {
  position: relative;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carte-recommandations {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-card);
}

.carte-recommandations h3 {
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
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
  .grille-metriques {
    grid-template-columns: 1fr;
  }
  
  .grille-graphiques {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .valeur-metrique {
    font-size: 2rem;
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

.conteneur-chargement p {
  color: var(--text-secondary);
}

.conteneur-erreur {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--risk-high);
  border-radius: 12px;
  padding: 2rem;
  color: var(--risk-high);
  text-align: center;
}
</style>
