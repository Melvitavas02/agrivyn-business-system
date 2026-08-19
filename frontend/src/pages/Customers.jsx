import { useEffect, useState } from 'react';

function Customers() {
  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    location: ''
  });

  const [showForm, setShowForm] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  const fetchCustomers = () => {
    fetch('http://localhost:5000/api/customers')
      .then(response => response.json())
      .then(data => {
        setCustomers(data);
      })
      .catch(error => {
        console.error('Failed to fetch customers:', error);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };
const handleEdit = (customer) => {
  setFormData({
    name: customer.name,
    phone: customer.phone,
    address: customer.address,
    location: customer.location
  });

  setEditingCustomerId(customer.customer_id);
  setShowForm(true);
};
const handleDelete = (customerId) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this customer?'
  );

  if (!confirmed) {
    return;
  }

  fetch(`http://localhost:5000/api/customers/${customerId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      fetchCustomers();
    })
    .catch(error => {
      console.error('Failed to delete customer:', error);
    });
};
  const handleSubmit = (event) => {
  event.preventDefault();

  const url = editingCustomerId
    ? `http://localhost:5000/api/customers/${editingCustomerId}`
    : 'http://localhost:5000/api/customers';

  const method = editingCustomerId ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      setFormData({
        name: '',
        phone: '',
        address: '',
        location: ''
      });

      setEditingCustomerId(null);
      setShowForm(false);

      fetchCustomers();
    })
    .catch(error => {
      console.error('Failed to save customer:', error);
    });
};

  return (
    <div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Customers
          </h2>

          <p className="text-gray-500 mt-1">
            Manage your business customers
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800"
        >
          + Add Customer
        </button>

      </div>


      {/* Add Customer Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <h3 className="text-xl font-semibold text-gray-800 mb-5">
  {editingCustomerId ? 'Edit Customer' : 'Add New Customer'}
</h3>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter customer name"
                />
              </div>


              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter phone number"
                />
              </div>


              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter address"
                />
              </div>


              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter location"
                />
              </div>
              

            </div>


            {/* Buttons */}
            <div className="flex gap-3 mt-6">

              <button
                type="submit"
                className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800"
              >
               {editingCustomerId ? 'Update Customer' : 'Save Customer'}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}


      {/* Customer Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                ID
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Name
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Phone
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Address
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Location
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
  Actions
</th>

            </tr>

          </thead>


          <tbody>

            {customers.map(customer => (
              <tr
                key={customer.customer_id}
                className="border-t"
              >

                <td className="px-6 py-4">
                  {customer.customer_id}
                </td>

                <td className="px-6 py-4 font-medium text-gray-800">
                  {customer.name}
                </td>

                <td className="px-6 py-4">
                  {customer.phone}
                </td>

                <td className="px-6 py-4">
                  {customer.address}
                </td>

                <td className="px-6 py-4">
                  {customer.location}
                </td>
                <td className="px-6 py-4">
  <div className="flex gap-4">

    <button
      onClick={() => handleEdit(customer)}
      className="text-blue-600 hover:text-blue-800 font-medium"
    >
      Edit
    </button>

    <button
      onClick={() => handleDelete(customer.customer_id)}
      className="text-red-600 hover:text-red-800 font-medium"
    >
      Delete
    </button>

  </div>
</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Customers;