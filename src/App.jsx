import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login/Login';
import DashboardLayout from './components/Layout/DashboardLayout';
import Students from './pages/Students/Students';
import Payments from './pages/Payments/Payments';
import Parents from './pages/Parents/Parents';
import Class from './pages/Class/Class';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes wrapped in DashboardLayout */}
                    <Route element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
                        <Route path="/dashboard" element={<Navigate to="/students" replace />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/payments" element={<Payments />} />
                        <Route path="/parents" element={<Parents />} />
                        <Route path="/class" element={<Class />} />
                    </Route>

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/students" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
