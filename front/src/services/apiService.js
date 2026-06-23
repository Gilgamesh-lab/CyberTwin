const API_BASE_URL = 'http://localhost:3000/api'

async function requeteAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const reponse = await fetch(url, config)
    
    if (!reponse.ok) {
      throw new Error(`Erreur HTTP: ${reponse.status}`)
    }
    
    return await reponse.json()
  } catch (erreur) {
    console.error('Erreur API:', erreur)
    throw erreur
  }
}

export const apiService = {
  async obtenirEntreprise() {
    return requeteAPI('/company')
  },

  async obtenirActifs() {
    return requeteAPI('/assets')
  },

  async creerActif(donnees) {
    return requeteAPI('/assets', {
      method: 'POST',
      body: JSON.stringify(donnees)
    })
  },

  async modifierActif(id, donnees) {
    return requeteAPI(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(donnees)
    })
  },

  async supprimerActif(id) {
    return requeteAPI(`/assets/${id}`, {
      method: 'DELETE'
    })
  },

  async obtenirVulnerabilites() {
    return requeteAPI('/vulnerabilities')
  },

  async creerVulnerabilite(donnees) {
    return requeteAPI('/vulnerabilities', {
      method: 'POST',
      body: JSON.stringify(donnees)
    })
  },

  async modifierVulnerabilite(id, donnees) {
    return requeteAPI(`/vulnerabilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(donnees)
    })
  },

  async supprimerVulnerabilite(id) {
    return requeteAPI(`/vulnerabilities/${id}`, {
      method: 'DELETE'
    })
  },

  async mettreAJourEntreprise(donnees) {
    return requeteAPI('/company', {
      method: 'PUT',
      body: JSON.stringify(donnees)
    })
  },

  async calculerRisque(donnees) {
    return requeteAPI('/risk/calculate', {
      method: 'POST',
      body: JSON.stringify(donnees)
    })
  }
}
