import { defineStore } from 'pinia'

export const useCompanyStore = defineStore('company', {
  state: () => ({
    companyData: {
      name: 'Lunept',
      sector: 'Technologie',
      employees: 50,
      servers: 5,
      workstations: 45,
      exposedServices: ['Site Web', 'Email']
    }
  }),
  actions: {
    updateCompany(data) {
      this.companyData = { ...this.companyData, ...data }
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
