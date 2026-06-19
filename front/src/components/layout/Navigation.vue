<script setup>
</script>

<template>
  <nav>
    <router-link to="/">Accueil</router-link>
    <router-link to="/entreprise">Entreprise</router-link>
    <router-link to="/actifs">Actifs</router-link>
    <router-link to="/vulnerabilites">Vulnérabilités</router-link>
    <router-link to="/dashboard">Tableau de bord</router-link>
    <router-link to="/rapport">Rapport</router-link>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
}

nav a {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

nav a:hover {
  background-color: #ddd;
}

nav a.router-link-active {
  background-color: #007bff;
  color: white;
}
</style>
