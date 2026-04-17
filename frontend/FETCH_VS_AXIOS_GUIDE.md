# Fetch vs Axios: Which Should You Use?

## Quick Comparison Table

| Feature | Fetch | Axios |
|---------|-------|-------|
| **Installation** | Built-in (no install) | `npm install axios` |
| **Bundle Size** | ~1KB | ~13KB |
| **Setup** | Direct calls | Create instance (optional) |
| **Request Interceptors** | No built-in | Yes |
| **Response Interceptors** | No built-in | Yes |
| **Timeout** | Via AbortController | Built-in |
| **Cancel Request** | AbortController | CancelToken |
| **JSON Transform** | Manual `.json()` | Automatic |
| **Error Handling** | Only network errors | Network + HTTP status |
| **Parallel Requests** | `Promise.all()` | `axios.all()` |
| **Default Headers** | Manual | Can set defaults |
| **Retry Logic** | Manual implementation | Requires plugin |

## Current Implementation (Fetch)

### Current BookList.jsx Code
```jsx
const fetchBooks = async () => {
  try {
    setLoading(true)
    const response = await fetch('/api/books')
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    if (!data.success) throw new Error(data.error || 'Failed to fetch books')
    // ...
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}
```

**Pros:**
- ✅ No additional dependencies
- ✅ Built into modern browsers
- ✅ Lightweight for simple requests
- ✅ Works with Vite proxy

**Cons:**
- ❌ Must call `.json()` on response
- ❌ Must check `response.ok` manually
- ❌ Limited error info (network errors only)
- ❌ No automatic timeout
- ❌ No built-in interceptors

## Alternative Implementation (Axios)

### Example Code (BookList.axios.example.jsx)
```jsx
const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
})

const fetchBooks = async () => {
  try {
    setLoading(true)
    const { data } = await apiClient.get('/api/books')
    if (!data.success) throw new Error(data.error)
    // ...
  } catch (error) {
    setError(error.response?.data?.error || error.message)
  }
}
```

**Pros:**
- ✅ Automatic JSON transformation
- ✅ Better error handling
- ✅ Built-in timeout support
- ✅ Request/response interceptors
- ✅ Better DX with defaults

**Cons:**
- ❌ Additional 13KB dependency
- ❌ Slightly slower to learn
- ❌ Overkill for simple projects

## When to Use Each

### Use **Fetch** If:
- ✅ Building a lightweight project
- ✅ Want zero dependencies
- ✅ Only making simple API calls
- ✅ Bundle size is critical
- ✅ Supporting older browsers (use polyfill)
- ✅ Learning HTTP fundamentals

### Use **Axios** If:
- ✅ Making complex API calls
- ✅ Need interceptors (auth, logging, etc.)
- ✅ Want built-in request cancellation
- ✅ Need timeout handling
- ✅ Project already uses Axios elsewhere
- ✅ Working in a team with Axios standard

## Migration Guide: Fetch → Axios

### Step 1: Install Axios

```bash
npm install axios
```

### Step 2: Replace BookList.jsx

Use the example provided in `BookList.axios.example.jsx`:
```bash
cp src/components/BookList.axios.example.jsx src/components/BookList.jsx
```

Or manually update:

**Before (Fetch):**
```jsx
const response = await fetch('/api/books')
if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
const data = await response.json()
```

**After (Axios):**
```jsx
const { data } = await apiClient.get('/api/books')
```

### Step 3: Update Custom Hook (useBooks)

**Before (Fetch):**
```jsx
export const useBooks = (category) => {
  // ...
  const response = await fetch(
    category ? `/api/books?category=${category}` : '/api/books'
  )
  const json = await response.json()
  return json.data
}
```

**After (Axios):**
```jsx
import axios from 'axios'

export const useBooks = (category) => {
  // ...
  const { data } = await axios.get('/api/books', {
    params: category ? { category } : {}
  })
  return data.data
}
```

## Advanced Patterns

### Axios Interceptors for Authentication

```jsx
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage and redirect
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

### Fetch Equivalent (More Verbose)

```jsx
// No built-in interceptor support
// Must wrap fetch calls or use custom function

const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return response
}
```

## Real-World Recommendations

### For LearnTales Project (Your Current Project)

**Current Setup: ✅ Fetch is Fine**
- Simple CRUD operations
- No authentication yet
- Small bundle size matters
- Currently working well

**Future Upgrade Path:**
If you add:
- 🔐 JWT authentication → Use Axios interceptors
- 📊 Analytics/logging → Use Axios interceptors  
- ⚡ Request cancellation → Consider Axios
- 🔄 Retry logic → Consider Axios

## Testing Comparison

### Fetch Mock Testing

```jsx
// jest.mock('fetch')
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: [] }),
  })
)
```

### Axios Mock Testing

```jsx
// npm install axios-mock-adapter
import MockAdapter from 'axios-mock-adapter'
const mock = new MockAdapter(apiClient)
mock.onGet('/api/books').reply(200, { success: true, data: [] })
```

## Decision Matrix for Your Project

| Scenario | Recommendation | Reason |
|----------|---|---|
| MVP/Testing only | **Fetch** | Zero setup, already working |
| Adding auth soon | **Axios** | Interceptors save code |
| Want learning experience | **Fetch** | Better HTTP understanding |
| Team preference Axios | **Axios** | Consistency matters |
| Lightweight focus | **Fetch** | Bundle size advantage |
| Complex features | **Axios** | Better tooling |

## Current Status in LearnTales

Your project is currently using **Fetch** and it's working great! 

- ✅ All API calls functional
- ✅ Error handling in place
- ✅ Loading states working
- ✅ No additional dependencies

You can keep using Fetch unless you have specific needs for Axios features.

## Next Steps

1. **If staying with Fetch:** Your current setup is optimal ✅
2. **If switching to Axios:**
   - Run: `npm install axios`
   - Replace BookList.jsx with the axios example
   - Update useBooks.js custom hook
   - Test all functionality
3. **If adding authentication:** Plan for Axios interception pattern

---

**Need help deciding?** Consider your project's future needs:
- Simple CRUD app → **Fetch is perfect**
- Growing app with auth → **Axios is better**
- Enterprise features → **Axios + Redux/Context**
