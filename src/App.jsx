import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainLayout from "./layout/Main"
import Dashboard from "./pages/Dashboard"
import PopertyPage from "./pages/poperty-management/Poperty"
import UnitPage from "./pages/poperty-management/Unit"
import RenterPage from "./pages/renter-management/Renter"
// import CustomerServicePage from "./pages/CustomerService"
import RentPage from "./pages/transaction/RentPage"
import SalesPage from "./pages/transaction/SalesPage"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="property-management"  >
            <Route path="property" element={<PopertyPage />} />
            <Route path="unit" element={<UnitPage />} />
          </Route>
          <Route path="renters-management"  >
            <Route path="renters" element={<RenterPage />} />
          </Route>
          <Route path="transaction"  >
            <Route path="rent" element={<RentPage />} />
            <Route path="sale" element={<SalesPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
)
}

export default App
