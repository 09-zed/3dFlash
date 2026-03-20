import { products } from '../data/products'
import { categories } from '../data/categories'
import type { Product, Category, ProductFilters } from '../types'

/**
 * ProductService — abstraction layer over product & category data.
 * Replace mock implementations with real API calls when backend is ready.
 */
export const productService = {
  async getCategories(): Promise<Category[]> {
    // TODO: replace with: return api.get('/categories')
    return Promise.resolve(categories)
  },

  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    // TODO: replace with: return api.get('/products', { params: filters })
    let result = [...products]

    if (filters?.categoryId) {
      result = result.filter(p => p.categoryId === filters.categoryId)
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.reference.toLowerCase().includes(q) ||
          p.tags.some(t => t.includes(q))
      )
    }
    if (filters?.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!)
    }
    if (filters?.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!)
    }
    if (filters?.brands?.length) {
      result = result.filter(p => filters.brands!.includes(p.brand))
    }
    if (filters?.inStock) {
      result = result.filter(p => p.stock > 0)
    }
    if (filters?.isPromo) {
      result = result.filter(p => p.isPromo)
    }

    return Promise.resolve(result)
  },

  async getProductById(id: string): Promise<Product | null> {
    // TODO: replace with: return api.get(`/products/${id}`)
    const product = products.find(p => p.id === id) ?? null
    return Promise.resolve(product)
  },

  async getCompatibleProducts(vehicleModelId: string, categoryId?: string): Promise<Product[]> {
    // TODO: replace with: return api.get('/products/compatible', { params: { vehicleModelId, categoryId } })
    let result = products.filter(p => p.compatibleVehicles.includes(vehicleModelId))
    if (categoryId) {
      result = result.filter(p => p.categoryId === categoryId)
    }
    return Promise.resolve(result)
  },

  async getBestSellers(): Promise<Product[]> {
    // TODO: replace with: return api.get('/products/best-sellers')
    return Promise.resolve(products.filter(p => p.isBestSeller))
  },

  async getPromos(): Promise<Product[]> {
    // TODO: replace with: return api.get('/products/promos')
    return Promise.resolve(products.filter(p => p.isPromo))
  },
}
