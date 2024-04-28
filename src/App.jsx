
// react router dom
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

// css
import './App.css'

// layouts
import RootLayout from './layout/RootLayout'
// pages
import Home from './pages/Home'

function App() {

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />} />
      </Route>
    )
  )

  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  )
}

export default App