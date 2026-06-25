import { defineStore, acceptHMRUpdate } from 'pinia'
import { apiService } from '../services/apiService'

export const useCompanyStore = defineStore('company', {
  state: () => ({
    companies: [],
    companyData: null,
    chargement: false,
    erreur: null
  }),
  actions: {
    async chargerEntreprise() {
      this.chargement = true
      this.erreur = null

      try {
        const donnees = await apiService.obtenirEntreprise()
        this.companies = donnees
        if (!this.companyData && donnees.length > 0) {
          this.companyData = donnees[0]
        }
      } catch (erreur) {
        this.erreur = 'Impossible de charger les données des entreprises'
        console.error('Erreur chargement entreprises:', erreur)
      } finally {
        this.chargement = false
      }
    },

    selectionnerEntreprise(company) {
      this.companyData = company
    },

    async creerEntreprise(data) {
      try {
        const reponse = await apiService.creerEntreprise(data)
        const newCompany = { ...data, id_entreprise: reponse.id }
        this.companies.push(newCompany)
        this.companyData = newCompany
        return newCompany
      } catch (erreur) {
        console.error('Erreur création entreprise:', erreur)
        throw erreur
      }
    },

    async updateCompany(data) {
      try {
        if (!this.companyData || !this.companyData.id_entreprise) {
          throw new Error('Aucune entreprise sélectionnée')
        }
        await apiService.mettreAJourEntreprise(this.companyData.id_entreprise, data)
        const updated = { ...this.companyData, ...data }
        this.companyData = updated
        const idx = this.companies.findIndex(c => c.id_entreprise === updated.id_entreprise)
        if (idx !== -1) this.companies[idx] = updated
      } catch (erreur) {
        console.error('Erreur sauvegarde entreprise:', erreur)
        throw erreur
      }
    },

    resetCompany() {
      this.companyData = null
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCompanyStore, import.meta.hot))
}
