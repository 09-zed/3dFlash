import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { VehicleProvider } from './context/VehicleContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CartDrawer from './components/cart/CartDrawer'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <VehicleProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogue" element={<CatalogPage />} />
              <Route path="/produit/:id" element={<ProductPage />} />
              <Route path="/panier" element={<CartPage />} />
              <Route path="/commande" element={<CheckoutPage />} />
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <p className="text-6xl font-extrabold text-gray-200">404</p>
                  <p className="text-xl font-semibold text-gray-600">Page introuvable</p>
                  <a href="/" className="btn-primary mt-2">Retour à l'accueil</a>
                </div>
              } />
            </Routes>
          </Layout>
        </CartProvider>
      </VehicleProvider>
    </BrowserRouter>
  )
}
