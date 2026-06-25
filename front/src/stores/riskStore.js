import { defineStore } from 'pinia'
import { useAssetStore } from './assetStore'
import { useVulnerabilityStore } from './vulnerabilityStore'
import { useCompanyStore } from './companyStore'
import { apiService } from '../services/apiService'

export const useRiskStore = defineStore('risk', {
  state: () => ({
    riskScore: 0,
    riskLevel: 'faible',
    metrics: {
      totalAssets: 0,
      totalVulnerabilities: 0,
      criticalVulnerabilities: 0,
      highVulnerabilities: 0,
      mediumVulnerabilities: 0,
      lowVulnerabilities: 0,
      exposedServices: 0
    },
    chargement: false,
    erreur: null,
    recommandations: []
  }),
  actions: {
    async calculerRisque() {
      this.chargement = true
      this.erreur = null
      
      // Utiliser directement le calcul local (pas d'API backend)
      this.calculateRiskLocal()
      this.chargement = false
    },

    calculateRiskLocal() {
      const assetStore = useAssetStore()
      const vulnerabilityStore = useVulnerabilityStore()
      const companyStore = useCompanyStore()

      const assets = assetStore.assets
      const vulnerabilites = vulnerabilityStore.vulnerabilites
      const company = companyStore.companyData || {}

      const criticiteEleve = vulnerabilites.filter(v => v.criticality === 'eleve' || v.criticality === 'Élevé' || v.criticality === 'Critique').length
      const criticiteMoyen = vulnerabilites.filter(v => v.criticality === 'moyen' || v.criticality === 'Moyen').length
      const criticiteFaible = vulnerabilites.filter(v => v.criticality === 'faible' || v.criticality === 'Faible').length

      let riskScore = 0

      // Base sur le nombre d'actifs
      riskScore += Math.min(assets.length * 5, 20)

      // Base sur le nombre total de vulnérabilités
      riskScore += Math.min(vulnerabilites.length * 8, 30)

      // Pondération par criticité
      riskScore += criticiteEleve * 15
      riskScore += criticiteMoyen * 5
      riskScore += criticiteFaible * 2

      // Exposition sur Internet
      const exposedServices = company.exposedServices || []
      const exposedServicesCount = Array.isArray(exposedServices) ? exposedServices.length : 0
      riskScore += Math.min(exposedServicesCount * 5, 15)

      // Plafonner à 100
      riskScore = Math.min(riskScore, 100)

      let riskLevel = 'faible'
      if (riskScore >= 70) {
        riskLevel = 'eleve'
      } else if (riskScore >= 40) {
        riskLevel = 'moyen'
      }

      this.riskScore = riskScore
      this.riskLevel = riskLevel
      this.metrics = {
        totalAssets: assets.length,
        totalVulnerabilities: vulnerabilites.length,
        criticalVulnerabilities: criticiteEleve,
        highVulnerabilities: criticiteEleve,
        mediumVulnerabilities: criticiteMoyen,
        lowVulnerabilities: criticiteFaible,
        exposedServices: exposedServicesCount
      }
      this.recommandations = this.getRecommendations()
    },

    getRiskLevelLabel() {
      const labels = {
        faible: 'Faible',
        moyen: 'Moyen',
        eleve: 'Élevé'
      }
      return labels[this.riskLevel] || this.riskLevel
    },

    getRiskLevelColor() {
      const colors = {
        faible: '#22c55e',
        moyen: '#f59e0b',
        eleve: '#ef4444'
      }
      return colors[this.riskLevel] || '#64748b'
    },

    getRecommendations() {
      if (this.recommandations.length > 0) {
        return this.recommandations
      }

      const recommendations = []
      const metrics = this.metrics

      if (metrics.criticalVulnerabilities > 0) {
        recommendations.push('Priorité absolue : Corriger les vulnérabilités critiques immédiatement')
      }

      if (metrics.totalVulnerabilities > 5) {
        recommendations.push('Réduire le nombre total de vulnérabilités détectées')
      }

      if (metrics.exposedServices > 2) {
        recommendations.push('Limiter l\'exposition des services sur Internet')
      }

      if (metrics.totalAssets > 10) {
        recommendations.push('Renforcer la surveillance des actifs critiques')
      }

      if (recommendations.length === 0) {
        recommendations.push('Maintenir les bonnes pratiques de sécurité actuelles')
      }

      return recommendations
    }
  }
})
