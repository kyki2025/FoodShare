import { HashRouter, Route, Routes } from 'react-router'
import FoodHome from './pages/FoodHome'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<FoodHome />} />
      </Routes>
    </HashRouter>
  )
}
