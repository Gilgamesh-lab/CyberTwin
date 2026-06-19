<script setup>
import { ref } from 'vue'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar" :class="{ 'collapsed': !isSidebarOpen }">
      <div class="sidebar-header">
        <h1 class="logo" v-if="isSidebarOpen">CyberTwin</h1>
        <button class="toggle-btn" @click="toggleSidebar" aria-label="Toggle sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline v-if="isSidebarOpen" points="15 18 9 12 15 6"></polyline>
            <polyline v-else points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      <nav class="nav-links" v-if="isSidebarOpen">
        <router-link to="/" class="nav-item">
          <span class="text">Accueil</span>
        </router-link>
        <router-link to="/entreprise" class="nav-item">
          <span class="text">Entreprise</span>
        </router-link>
        <router-link to="/actifs" class="nav-item">
          <span class="text">Actifs</span>
        </router-link>
        <router-link to="/vulnerabilites" class="nav-item">
          <span class="text">Vulnérabilités</span>
        </router-link>
        <router-link to="/dashboard" class="nav-item">
          <span class="text">Tableau de bord</span>
        </router-link>
        <router-link to="/rapport" class="nav-item">
          <span class="text">Rapport</span>
        </router-link>
      </nav>
    </aside>
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #1e293b;
  color: white;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #334155;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #334155;
  min-height: 60px;
}

.sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding: 1rem;
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: white;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-links {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.25rem;
}

.nav-item {
  padding: 0.75rem 1rem;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-item.router-link-active {
  background: #3b82f6;
  color: white;
}

.text {
  white-space: nowrap;
}

.sidebar.collapsed .text {
  display: none;
}

.main-content {
  flex: 1;
  background: #f8fafc;
  padding: 2rem;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>
