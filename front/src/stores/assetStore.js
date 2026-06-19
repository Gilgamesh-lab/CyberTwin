import { defineStore } from 'pinia'

export const useAssetStore = defineStore('asset', {
  state: () => ({
    assets: [
      {
        id: 1,
        name: 'Serveur Web',
        type: 'Serveur Web',
        ipAddress: '192.168.1.10',
        criticality: 'critical',
        description: 'Serveur web public'
      },
      {
        id: 2,
        name: 'Base de données',
        type: 'Base de données',
        ipAddress: '192.168.1.20',
        criticality: 'critical',
        description: 'Base de données principale'
      },
      {
        id: 3,
        name: 'Poste Directeur',
        type: 'Poste utilisateur',
        ipAddress: '192.168.1.100',
        criticality: 'high',
        description: 'Station de travail du directeur'
      }
    ]
  }),
  actions: {
    addAsset(asset) {
      const newAsset = {
        id: Date.now(),
        ...asset
      }
      this.assets.push(newAsset)
    },
    updateAsset(id, updatedData) {
      const index = this.assets.findIndex(a => a.id === id)
      if (index !== -1) {
        this.assets[index] = { ...this.assets[index], ...updatedData }
      }
    },
    deleteAsset(id) {
      this.assets = this.assets.filter(a => a.id !== id)
    },
    obtenirParId(id) {
      return this.assets.find(a => a.id === id)
    }
  }
})
