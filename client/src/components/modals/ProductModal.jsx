import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ProductModal({ onClose, onSave, product }) {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price || 0);
  const [sku, setSku] = useState(product?.sku || ''); // <-- Changed from 'stock'
  
  const title = product ? 'Edit Product' : 'Add New Product';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: product?._id, name, price: parseFloat(price), sku }); // <-- Changed from 'stock'
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-m
edium mb-1">Product Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">Price</label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="sku" className="block text-sm font-medium mb-1">SKU</label> {/* <-- Changed */}
                <Input
                  id="sku"
                  type="text" // <-- Changed from 'number'
                  value={sku}
                  onChange={(e) => setSku(e.target.value)} // <-- Changed
                  required
                  placeholder="e.g., LAPTOP-001"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}