import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// `customer` prop will be null for "new" or an object for "edit"
export default function CustomerModal({ onClose, onSave, customer }) {
  const [name, setName] = useState(customer?.name || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  
  const title = customer ? 'Edit Customer' : 'Add New Customer';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: customer?._id, name, email, phone });
    onClose();
  };

  return (
    // Backdrop
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
      onClick={onClose}
    >
      {/* Modal Panel */}
      <div
        className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()} // Prevent click-through
      >
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone (Optional)</label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {customer ? 'Save Changes' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}