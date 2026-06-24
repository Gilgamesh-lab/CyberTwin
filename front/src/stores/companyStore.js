import { defineStore } from 'pinia'
import { apiService } from '../services/apiService'

export const useCompanyStore = defineStore('company', {
  state: () => ({
    companyData: {
      name: '',
      sector: '',
      employees: 0,
      servers: 0,
      workstations: 0,
      exposedServices: []
    },
    chargement: false,
    erreur: null
  }),
  actions: {
    async chargerEntreprise() {
      this.chargement = true
      this.erreur = null
      
      try {
        const donnees = await apiService.obtenirEntreprise()
        this.companyData = donnees
      } catch (erreur) {
        this.erreur = 'Impossible de charger les données de l\'entreprise'
        console.error('Erreur chargement entreprise:', erreur)
      } finally {
        this.chargement = false
      }
    },
    
    updateCompany(data) {
      this.companyData = { ...this.companyData, ...data }
      apiService.mettreAJourEntreprise(data)
    },
    
    resetCompany() {
      this.companyData = {
        name: '',
        sector: '',
        employees: 0,
        servers: 0,
        workstations: 0,
        exposedServices: []
      }
    }
  }
})
