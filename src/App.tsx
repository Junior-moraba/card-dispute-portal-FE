
import './App.css';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import DisputeList from './components/DisputeList';

function App() {
 return (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/disputes" element={<DisputeList />} />
    </Route>
    
  </Routes>
 )
}

export default App;
