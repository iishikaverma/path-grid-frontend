import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { AppProvider } from './context/AppContext'
import About from './pages/About'
import FindRoute from './pages/FindRoute'
import Home from './pages/Home'
import Locations from './pages/Locations'
import NearbyPlaces from './pages/NearbyPlaces'
import Visualizer from './pages/Visualizer'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/find-route" element={<FindRoute />} />
          <Route path="/visualizer" element={<Visualizer />} />
          <Route path="/nearby" element={<NearbyPlaces />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AppProvider>
  )
}
