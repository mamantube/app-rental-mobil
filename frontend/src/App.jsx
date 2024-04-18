import { BrowserRouter, Routes, Route} from "react-router-dom";
import layoutDashboard from "./layouts/Dashboard";
import layoutLanding from "./layouts/Landing";
import Home from "./pages/Home";
import Admin from "./pages/admin/Index";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route Component={layoutDashboard}>
          <Route index path="/admin" Component={Admin} />
        </Route>
        <Route Component={layoutLanding}>
          <Route index path="/" Component={Home} />
        </Route>
        <Route path="/*" element={<h1>Page Not Found :( </h1>} />
      </Routes>
    </BrowserRouter>

  )
}