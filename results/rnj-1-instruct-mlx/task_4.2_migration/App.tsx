// App.tsx — React Router v6
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useLocation,
  useParams,
  Outlet,
  Link
} from 'react-router-dom';
import { useAuth } from './auth';

// Protected route (v6 pattern)
function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

// Dashboard with nested routes
function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // logout logic
    navigate('/login', { replace: true });
  };

  return (
    <div>
      <nav>
        <Link to="">Overview</Link>
        <Link to="analytics">Analytics</Link>
        <Link to="settings">Settings</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <Routes>
        <Route index element={<Overview />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

// Page with query parameters
function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get('q') || '';

  const handleSearch = (term: string) => {
    navigate({
      pathname: '/search',
      search: `?q=${encodeURIComponent(term)}`,
    });
  };

  return <div>Search: {searchTerm}</div>;
}

// Product page with params
function ProductPage() {
  const { categoryId, productId } = useParams<{ 
    categoryId: string; 
    productId: string; 
  }>();
  
  return (
    <div>
      Category: {categoryId}, Product: {productId}
    </div>
  );
}

// Main router
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
        </Route>
        
        <Route path="/search" element={<SearchPage />} />
        
        <Route path="/category/:categoryId/product/:productId" element={<ProductPage />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
