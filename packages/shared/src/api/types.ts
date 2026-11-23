export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface GetProductsParams {
  category?: string;
  search?: string;
  page: number;
  limit: number;
}

export interface ProductsPage {
  items: Product[];
  total: number;
}

export type MockApiMethodName =
  | 'getProducts'
  | 'getProductById'
  | 'addToCart'
  | 'updateCartQuantity'
  | 'checkout';
