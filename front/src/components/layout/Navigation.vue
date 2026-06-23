<script setup>
import { ref, onMounted } from 'vue'

const isSidebarOpen = ref(true)
const isDarkMode = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar" :class="{ 'collapsed': !isSidebarOpen }">
      <div class="sidebar-header">
        <div class="logo" v-if="isSidebarOpen">
          <span class="logo-icon">🛡️</span>
          <span class="logo-text">CyberTwin</span>
        </div>
        <button class="toggle-btn" @click="toggleSidebar" aria-label="Toggle sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline v-if="isSidebarOpen" points="15 18 9 12 15 6"></polyline>
            <polyline v-else points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      <nav class="nav-links">
        <router-link to="/" class="nav-item">
          <span class="nav-icon">🏠</span>
          <span class="nav-text" v-if="isSidebarOpen">Accueil</span>
        </router-link>
        <router-link to="/entreprise" class="nav-item">
          <span class="nav-icon">🏢</span>
          <span class="nav-text" v-if="isSidebarOpen">Entreprise</span>
        </router-link>
        <router-link to="/actifs" class="nav-item">
          <span class="nav-icon">💻</span>
          <span class="nav-text" v-if="isSidebarOpen">Actifs</span>
        </router-link>
        <router-link to="/vulnerabilites" class="nav-item">
          <span class="nav-icon">⚠️</span>
          <span class="nav-text" v-if="isSidebarOpen">Vulnérabilités</span>
        </router-link>
        <router-link to="/dashboard" class="nav-item">
          <span class="nav-icon">📊</span>
          <span class="nav-text" v-if="isSidebarOpen">Tableau de bord</span>
        </router-link>
        <router-link to="/rapport" class="nav-item">
          <span class="nav-icon">📄</span>
          <span class="nav-text" v-if="isSidebarOpen">Rapport</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <button class="theme-toggle" @click="toggleTheme" :title="isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'">
          <span class="theme-icon">{{ isDarkMode ? '🌙' : '☀️' }}</span>
          <span class="theme-text">{{ isDarkMode ? 'Mode sombre' : 'Mode clair' }}</span>
        </button>
      </div>
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
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-normal);
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
  min-height: 70px;
}

.sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.toggle-btn {
  background: var(--bg-hover);
  border: 1px solid var(--border-card);
  border-radius: 8px;
  padding: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover {
  background: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--accent-primary);
}

.nav-links {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  padding: 0.875rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 8px;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 0.875rem;
  position: relative;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-item.router-link-active {
  background: var(--accent-primary);
  color: white;
  box-shadow: var(--shadow-glow);
}

.nav-item.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: white;
  border-radius: 0 4px 4px 0;
}

.nav-icon {
  font-size: 1.25rem;
  min-width: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-text {
  white-space: nowrap;
  font-weight: 500;
}

.sidebar.collapsed .nav-text {
  display: none;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: center;
}

.theme-toggle {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--bg-card);
  border: 2px solid var(--accent-primary);
  border-radius: 50px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-toggle:hover {
  background: var(--accent-primary);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
}

.theme-toggle .theme-icon {
  font-size: 1.25rem;
}

.theme-toggle .theme-text {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar.collapsed .theme-toggle {
  left: 1.5rem;
}

.main-content {
  flex: 1;
  background: var(--bg-primary);
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
