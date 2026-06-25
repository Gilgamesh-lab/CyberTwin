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
    return requeteAPI('/company/getCompanies')
  },

  async creerEntreprise(donnees) {
    return requeteAPI('/company/addCompany', {
      method: 'POST',
      body: JSON.stringify(donnees)
    })
  },

  async mettreAJourEntreprise(id, donnees) {
    return requeteAPI(`/company/updateCompany/${id}`, {
      method: 'PUT',
      body: JSON.stringify(donnees)
    })
  },

  async obtenirActifs() {
    return requeteAPI('/actifs/getActifs')
  },

  async obtenirActifsParEntreprise(id) {
    return requeteAPI(`/company/getCompanyActifs/${id}`)
  },

  async creerActif(donnees) {
    return requeteAPI('/actifs/addActif', {
      method: 'POST',
      body: JSON.stringify(donnees)
    })
  },

  async modifierActif(id, donnees) {
    return requeteAPI(`/actifs/modifierActif/${id}`, {
      method: 'PUT',
      body: JSON.stringify(donnees)
    })
  },

  async supprimerActif(id) {
    return requeteAPI(`/actifs/supprimerActif/${id}`, {
      method: 'DELETE'
    })
  },

  async obtenirVulnerabilites() {
    return requeteAPI('/vulnerabilite/getVulnerabilite')
  },

  async obtenirVulnerabilitesByEntreprise(id) {
    return requeteAPI(`/vulnerabilite/getVulnerabilitesByEntreprise/${id}`)
  },

  async creerVulnerabilite(donnees) {
    return requeteAPI('/vulnerabilite/addVulnerabilite', {
      method: 'POST',
      body: JSON.stringify(donnees)
    })
  },

  async modifierVulnerabilite(id, donnees) {
    return requeteAPI(`/vulnerabilite/modifierVulnerabilite/${id}`, {
      method: 'PUT',
      body: JSON.stringify(donnees)
    })
  },

  async supprimerVulnerabilite(id) {
    return requeteAPI(`/vulnerabilite/supprimerVulnerabilite/${id}`, {
      method: 'DELETE'
    })
  }
}
