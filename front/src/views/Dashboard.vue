<script setup>
import { onMounted } from 'vue'
import { useRiskStore } from '../stores/riskStore'

const riskStore = useRiskStore()

onMounted(() => {
  riskStore.calculateRisk()
})
</script>

<template>
  <div class="page-dashboard">
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

    <div class="carte-recommandations">
      <h3>Recommandations</h3>
      <ul>
        <li v-for="(recommandation, index) in riskStore.getRecommendations()" :key="index">
          {{ recommandation }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.page-dashboard {
  width: 100%;
}

h1 {
  color: #0f172a;
  margin-bottom: 2rem;
  font-size: 1.75rem;
  font-weight: 600;
}

.grille-metriques {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.carte-metrique {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.label-metrique {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.valeur-metrique {
  color: #0f172a;
  font-size: 2rem;
  font-weight: 700;
}

.carte-recommandations {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.carte-recommandations h3 {
  color: #1e293b;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.carte-recommandations ul {
  margin: 0;
  padding-left: 1.5rem;
}

.carte-recommandations li {
  color: #475569;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .grille-metriques {
    grid-template-columns: 1fr;
  }
}
</style>
