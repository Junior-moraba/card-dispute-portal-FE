
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import MainLayout from './layouts/MainLayout';
import DisputeList from './components/DisputeList';

function App() {
  return (
    <AuthProvider>
      <Routes>   
        <Route path="/login" element={<Login />} /> 
        <Route element={<MainLayout />}>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/disputes" element={<ProtectedRoute><DisputeList /></ProtectedRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
