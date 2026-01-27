// App.tsx — React Router v6
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useLocation,
  useParams,
  Link
} from 'react-router-dom';
import { useAuth } from './auth';

// Protected route (v6 pattern)
function PrivateRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Route
      {...rest}
      element={
        isAuthenticated ? (
          <Component />
        ) : (
          <Navigate
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

// Dashboard with nested routes
function Dashboard() {
  const path = '/dashboard';
  const navigate = useNavigate();

  const handleLogout = () => {
    // logout logic
    navigate('/login');
  };

  return (
    <div>
      <nav>
        <Link to={path}>Overview</Link>
        <Link to={`${path}/analytics`}>Analytics</Link>
        <Link to={`${path}/settings`}>Settings</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <Routes>
        <Route path="" element={<Overview />} />
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
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
        
        <Route path="/search" element={<SearchPage />} />
        
        <Route path="/category/:categoryId/product/:productId" element={<ProductPage />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
