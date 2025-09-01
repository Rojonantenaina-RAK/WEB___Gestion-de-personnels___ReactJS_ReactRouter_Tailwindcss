import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout/Layout'
import Accueil from './components/Accueil/Accueil'
import Presence from './components/Presence/Presence'
import Personnel from './components/Personnel/Personnel'
import ProjetsTaches from './components/ProjetsTaches/ProjetsTaches'
import Apropos from './components/Apropos/Apropos'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Accueil */}
          <Route index element={<Accueil />} />

          {/* Présence */}
          <Route path="presence" element={<Presence />} />

          {/* Personnel */}
          <Route path="personnel" element={<Personnel />} />

          {/* Projets et tâches */}
          <Route path="projet" element={<ProjetsTaches />} />

          {/* A propos */}
          <Route path="apropos" element={<Apropos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
