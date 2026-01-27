import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useParams,
  useLocation,
} from 'react-router-dom';
import { useAuth } from './auth';

// Protected route (v6 pattern)
function PrivateRoute({ children }: any) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to={{ pathname: '/login', state: { from: location } }} replace />;
  }

  return children;
}

// Dashboard with nested routes
function Dashboard() {
  const { path, url } = useRouteMatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // logout logic
    navigate('/login');
  };

  return (
    <div>
      <nav>
        <Link to={`${url}`}>Overview</Link>
        <Link to={`${url}/analytics`}>Analytics</Link>
        <Link to={`${url}/settings`}>Settings</Link>
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
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('q') || '';

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
        <Route exact path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/login">
          <LoginPage />
        </Route>
        
        <Route path="/register">
          <RegisterPage />
        </Route>
        
        <PrivateRoute path="/dashboard" element={<Dashboard />} />
        
        <Route path="/search">
          <SearchPage />
        </Route>
        
        <Route path="/category/:categoryId/product/:productId">
          <ProductPage />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
