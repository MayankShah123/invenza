import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import CustomerModal from '@/components/modals/CustomerModal';
import api from '@/lib/api';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (customer = null) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (customerData.id) {
        // Edit existing customer
        await api.put(`/customers/${customerData.id}`, customerData);
      } else {
        // Create new customer
        await api.post('/customers', customerData);
      }
      fetchCustomers(); // Re-fetch the list
    } catch (err) {
      console.error("Failed to save customer", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers(); // Re-fetch the list
      } catch (err) {
        console.error("Failed to delete customer", err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button onClick={() => handleOpenModal()}>Add New Customer</Button>
      </div>

      {/* Customer List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {customers.length === 0 ? (
            <li className="p-4 text-center text-gray-500">No customers found.</li>
          ) : (
            customers.map(customer => (
              <li key={customer._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => handleOpenModal(customer)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(customer._id)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {isModalOpen && (
        <CustomerModal
          onClose={handleCloseModal}
          onSave={handleSaveCustomer}
          customer={selectedCustomer}
        />
      )}
    </div>
  );
}

export default Customers;