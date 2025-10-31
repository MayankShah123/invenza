import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductModal({ onClose, onSave, product }) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [sku, setSku] = useState(product?.sku || "");

  const title = product ? "Edit Product" : "Add New Product";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: product?._id, name, price: parseFloat(price), sku });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl dark:bg-gray-900"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {title}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
              >
                Product Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                >
                  Price
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., 1200.50"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="sku"
                  className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                >
                  SKU
                </label>
                <Input
                  id="sku"
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g., LAPTOP-001"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {product ? "Save Changes" : "Create Product"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
