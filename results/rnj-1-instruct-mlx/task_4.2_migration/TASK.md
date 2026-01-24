# Task 4.2: React Router v5 to v6 Migration

Migrate the following code from React Router v5 to v6. Preserve all functionality.

## Source code (React Router v5)

```tsx
// App.tsx — React Router v5
import { 
  BrowserRouter, 
  Switch, 
  Route, 
  Redirect, 
  useHistory, 
  useLocation,
  useParams,
  useRouteMatch,
  Link
} from 'react-router-dom';
import { useAuth } from './auth';

// Protected route (v5 pattern)
function PrivateRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
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
  const { path, url } = useRouteMatch();
  const history = useHistory();

  const handleLogout = () => {
    // logout logic
    history.push('/login');
  };

  return (
    <div>
      <nav>
        <Link to={`${url}`}>Overview</Link>
        <Link to={`${url}/analytics`}>Analytics</Link>
        <Link to={`${url}/settings`}>Settings</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <Switch>
        <Route exact path={path}>
          <Overview />
        </Route>
        <Route path={`${path}/analytics`}>
          <Analytics />
        </Route>
        <Route path={`${path}/settings`}>
          <Settings />
        </Route>
      </Switch>
    </div>
  );
}

// Page with query parameters
function SearchPage() {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get('q') || '';

  const handleSearch = (term: string) => {
    history.push({
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
      <Switch>
        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>
        
        <Route path="/login">
          <LoginPage />
        </Route>
        
        <Route path="/register">
          <RegisterPage />
        </Route>
        
        <PrivateRoute path="/dashboard" component={Dashboard} />
        
        <Route path="/search">
          <SearchPage />
        </Route>
        
        <Route path="/category/:categoryId/product/:productId">
          <ProductPage />
        </Route>
        
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
```

## Key changes needed
- `Switch` → `Routes`
- `<Route component={X}>` → `<Route element={<X />}>`
- `<Redirect>` → `<Navigate>`
- `useHistory` → `useNavigate`
- `useRouteMatch` → relative paths
- `render` prop is removed
- Nested routes use `<Outlet />`

## Expected file
Create migrated `App.tsx` in this directory.

> Note: This is an intentionally difficult task to test model limits.
