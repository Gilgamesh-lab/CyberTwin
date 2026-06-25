import { defineStore, acceptHMRUpdate } from 'pinia'
import { apiService } from '../services/apiService'

export const useAssetStore = defineStore('asset', {
  state: () => ({
    assets: [],
    chargement: false,
    erreur: null
  }),
  actions: {
    async chargerActifs(companyId = null) {
      this.chargement = true
      this.erreur = null

      try {
        const donnees = companyId
          ? await apiService.obtenirActifsParEntreprise(companyId)
          : await apiService.obtenirActifs()
        this.assets = donnees
      } catch (erreur) {
        this.erreur = 'Impossible de charger les actifs'
        console.error('Erreur chargement actifs:', erreur)
      } finally {
        this.chargement = false
      }
    },

    async ajouterActif(actif) {
      this.chargement = true
      this.erreur = null

      try {
        const reponse = await apiService.creerActif(actif)
        const nouvelActif = { ...actif, id_actif: reponse.id }
        this.assets.push(nouvelActif)
      } catch (erreur) {
        this.erreur = 'Impossible d\'ajouter l\'actif'
        console.error('Erreur ajout actif:', erreur)
        throw erreur
      } finally {
        this.chargement = false
      }
    },

    async modifierActif(id, donnees) {
      this.chargement = true
      this.erreur = null

      try {
        await apiService.modifierActif(id, donnees)
        const index = this.assets.findIndex(a => a.id_actif === id)
        if (index !== -1) {
          this.assets[index] = { ...this.assets[index], ...donnees }
        }
      } catch (erreur) {
        this.erreur = 'Impossible de modifier l\'actif'
        console.error('Erreur modification actif:', erreur)
        throw erreur
      } finally {
        this.chargement = false
      }
    },

    async supprimerActif(id) {
      this.chargement = true
      this.erreur = null

      try {
        await apiService.supprimerActif(id)
        this.assets = this.assets.filter(a => a.id_actif !== id)
      } catch (erreur) {
        this.erreur = 'Impossible de supprimer l\'actif'
        console.error('Erreur suppression actif:', erreur)
        throw erreur
      } finally {
        this.chargement = false
      }
    },

    obtenirParId(id) {
      return this.assets.find(a => a.id_actif === id)
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAssetStore, import.meta.hot))
}
