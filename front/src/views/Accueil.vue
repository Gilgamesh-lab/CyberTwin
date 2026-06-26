<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const demarrerSimulation = () => {
  router.push('/entreprise')
}
</script>

<template>
  <div class="page-accueil">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Modélisez votre entreprise. Évaluez votre risque cyber.</h1>
        <p class="hero-subtitle">Un simulateur de risque cyber simple et automatique pour les PME</p>
        <button class="cta-button" @click="demarrerSimulation">
          Démarrer la simulation
        </button>
      </div>
    </section>

    <section class="fonctionnalites">
      <div class="fonctionnalites-grid">
        <div class="carte-fonctionnalite">
          <div class="icone-fonctionnalite">⚙️</div>
          <h3 class="titre-fonctionnalite">Configuration</h3>
        </div>

        <div class="carte-fonctionnalite">
          <div class="icone-fonctionnalite">🗺️</div>
          <h3 class="titre-fonctionnalite">Cartographie</h3>
        </div>

        <div class="carte-fonctionnalite">
          <div class="icone-fonctionnalite">📊</div>
          <h3 class="titre-fonctionnalite">Analyse</h3>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-accueil {
  width: 100%;
  min-height: 100vh;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  min-height: 60vh;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  border-bottom: 1px solid var(--border-subtle);
}

.hero-content {
  max-width: 800px;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.cta-button {
  padding: 1rem 2.5rem;
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-subtle);
}

.cta-button:hover {
  background: var(--accent-secondary);
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}

.fonctionnalites {
  padding: 6rem 2rem;
}

.fonctionnalites-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.carte-fonctionnalite {
  background: var(--bg-card);
  padding: 2.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-card);
  transition: all var(--transition-normal);
  text-align: center;
}

.carte-fonctionnalite:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
  transform: translateY(-4px);
}

.icone-fonctionnalite {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.titre-fonctionnalite {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.description-fonctionnalite {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .hero {
    padding: 4rem 1.5rem;
    min-height: 50vh;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .fonctionnalites {
    padding: 4rem 1.5rem;
  }

  .fonctionnalites-grid {
    grid-template-columns: 1fr;
  }

  .carte-fonctionnalite {
    padding: 2rem;
  }
}
</style>
