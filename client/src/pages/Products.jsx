import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import ProductModal from '@/components/modals/ProductModal';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (productData.id) {
        await api.put(`/products/${productData.id}`, productData);
      } else {
        await api.post('/products', productData);
      }
      fetchProducts();
    } catch (err) {
      console.error("Failed to save product", err.message);
      alert("Failed to save product: " + err.message); // Show error to user
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("Failed to delete product", err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => handleOpenModal()}>Add New Product</Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {products.length === 0 ? (
            <li className="p-4 text-center text-gray-500">No products found.</li>
          ) : (
            products.map(product => (
              <li key={product._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</p> {/* <-- Changed */}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">{formatCurrency(product.price)}</span>
                  <Button variant="outline" onClick={() => handleOpenModal(product)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(product._id)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {isModalOpen && (
        <ProductModal
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

export default Products;