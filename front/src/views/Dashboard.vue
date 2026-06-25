<script setup>
import { onMounted, ref } from 'vue'
import { useRiskStore } from '../stores/riskStore'
import { useVulnerabilityStore } from '../stores/vulnerabilityStore'
import { useAssetStore } from '../stores/assetStore'
import { useCompanyStore } from '../stores/companyStore'
import Chart from 'chart.js/auto'

const riskStore = useRiskStore()
const vulnerabilityStore = useVulnerabilityStore()
const assetStore = useAssetStore()
const companyStore = useCompanyStore()

const chartCanvas = ref(null)
let chartInstance = null

onMounted(async () => {
  await assetStore.chargerActifs()
  await vulnerabilityStore.chargerVulnerabilites()
  await companyStore.chargerEntreprise()
  await riskStore.calculerRisque()
  
  // Attendre que le DOM soit mis à jour avant de créer le graphique
  setTimeout(() => {
    creerGraphique()
  }, 100)
})

const creerGraphique = () => {
  if (!chartCanvas.value) {
    console.error('Canvas non disponible')
    return
  }
  
  const ctx = chartCanvas.value.getContext('2d')
  const isDarkMode = document.documentElement.classList.contains('dark')
  
  const criticiteFaible = vulnerabilityStore.vulnerabilites.filter(v => v.criticality === 'faible' || v.criticality === 'Faible').length
  const criticiteMoyen = vulnerabilityStore.vulnerabilites.filter(v => v.criticality === 'moyen' || v.criticality === 'Moyen').length
  const criticiteEleve = vulnerabilityStore.vulnerabilites.filter(v => v.criticality === 'eleve' || v.criticality === 'Élevé' || v.criticality === 'Critique').length

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
            color: isDarkMode ? '#ffffff' : '#1f2937',
            font: {
              size: 14,
              weight: 'bold'
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
          <div class="icone-metrique">💻</div>
          <div class="label-metrique">Total Actifs</div>
          <div class="valeur-metrique">{{ riskStore.metrics.totalAssets }}</div>
        </div>
        <div class="carte-metrique">
          <div class="icone-metrique">⚠️</div>
          <div class="label-metrique">Total Vulnérabilités</div>
          <div class="valeur-metrique">{{ riskStore.metrics.totalVulnerabilities }}</div>
        </div>
        <div class="carte-metrique">
          <div class="icone-metrique" :style="{ color: riskStore.getRiskLevelColor() }">
            {{ riskStore.riskLevel === 'eleve' ? '💯' : riskStore.riskLevel === 'moyen' ? '⚡' : '✅' }}
          </div>
          <div class="label-metrique">Score de Risque</div>
          <div class="valeur-metrique" :style="{ color: riskStore.getRiskLevelColor() }">
            {{ riskStore.riskScore }}/100
          </div>
        </div>
        <div class="carte-metrique">
          <div class="icone-metrique">🚨</div>
          <div class="label-metrique">Niveau de Risque</div>
          <div class="valeur-metrique" :style="{ color: riskStore.getRiskLevelColor() }">
            {{ riskStore.getRiskLevelLabel() }}
          </div>
        </div>
      </div>

    <div class="grille-graphiques">
      <div class="carte-graphique">
        <h3>📈 Répartition des vulnérabilités par criticité</h3>
        <div class="conteneur-graphique">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>
      <div class="carte-graphique">
        <h3>📊 Détail par niveau</h3>
        <div class="conteneur-stats">
          <div class="stat-item stat-faible">
            <div class="stat-header">
              <span class="stat-label">Faible</span>
              <span class="stat-value">{{ riskStore.metrics.lowVulnerabilities }}</span>
            </div>
            <div class="stat-bar">
              <div class="stat-progress" :style="{ width: (riskStore.metrics.lowVulnerabilities / Math.max(riskStore.metrics.totalVulnerabilities, 1) * 100) + '%' }"></div>
            </div>
          </div>
          <div class="stat-item stat-moyen">
            <div class="stat-header">
              <span class="stat-label">Moyen</span>
              <span class="stat-value">{{ riskStore.metrics.mediumVulnerabilities }}</span>
            </div>
            <div class="stat-bar">
              <div class="stat-progress" :style="{ width: (riskStore.metrics.mediumVulnerabilities / Math.max(riskStore.metrics.totalVulnerabilities, 1) * 100) + '%' }"></div>
            </div>
          </div>
          <div class="stat-item stat-eleve">
            <div class="stat-header">
              <span class="stat-label">Élevé</span>
              <span class="stat-value">{{ riskStore.metrics.highVulnerabilities }}</span>
            </div>
            <div class="stat-bar">
              <div class="stat-progress" :style="{ width: (riskStore.metrics.highVulnerabilities / Math.max(riskStore.metrics.totalVulnerabilities, 1) * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="carte-recommandations">
      <h3>💡 Recommandations</h3>
      <ul v-if="riskStore.getRecommendations().length > 0">
        <li v-for="(recommandation, index) in riskStore.getRecommendations()" :key="index">
          {{ recommandation }}
        </li>
      </ul>
      <p v-else class="aucune-recommandation">Aucune recommandation pour le moment</p>
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.carte-metrique {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-card);
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.carte-metrique:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}

.icone-metrique {
  font-size: 2rem;
  margin-bottom: 0.5rem;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

.conteneur-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--border-card);
  background: var(--bg-secondary);
  transition: all var(--transition-fast);
}

.stat-item:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-subtle);
}

.stat-faible {
  border-left: 4px solid #22c55e;
}

.stat-moyen {
  border-left: 4px solid #f59e0b;
}

.stat-eleve {
  border-left: 4px solid #ef4444;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.stat-label {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.95rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-faible .stat-value {
  color: #22c55e;
}

.stat-moyen .stat-value {
  color: #f59e0b;
}

.stat-eleve .stat-value {
  color: #ef4444;
}

.stat-bar {
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.stat-progress {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.stat-faible .stat-progress {
  background: linear-gradient(90deg, #22c55e, #4ade80);
}

.stat-moyen .stat-progress {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.stat-eleve .stat-progress {
  background: linear-gradient(90deg, #ef4444, #f87171);
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
  padding-left: 0.5rem;
}

.carte-recommandations li::marker {
  color: var(--accent-primary);
}

.aucune-recommandation {
  color: var(--text-muted);
  text-align: center;
  padding: 1rem;
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
