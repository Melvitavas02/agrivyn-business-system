import { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  MapPin,
  Phone,
  X,
  Save,
  UserRound
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = () => {
    fetch('https://agrivyn-backend.onrender.com/api/customers')
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

    fetch(`https://agrivyn-backend.onrender.com/api/customers/${customerId}`, {
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
      ? `https://agrivyn-backend.onrender.com/api/customers/${editingCustomerId}`
      : 'https://agrivyn-backend.onrender.com/api/customers';

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

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomerId(null);

    setFormData({
      name: '',
      phone: '',
      address: '',
      location: ''
    });
  };

  const filteredCustomers = customers.filter(customer => {
    const search = searchTerm.toLowerCase();

    return (
      customer.name?.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search) ||
      customer.address?.toLowerCase().includes(search) ||
      customer.location?.toLowerCase().includes(search)
    );
  });

  const getInitials = (name) => {
    if (!name) return 'C';

    const words = name.trim().split(' ');

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <div className="min-h-full bg-gray-50">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="mb-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 mb-2">

              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>

              <span className="text-sm font-semibold text-emerald-600">
                CUSTOMER MANAGEMENT
              </span>

            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Customers
            </h2>

            <p className="text-gray-500 mt-2 max-w-2xl">
              Add new customers and manage their contact and location
              details from one place.
            </p>

          </div>


          {/* Add Customer */}

          <button
            onClick={() => {
              if (showForm && editingCustomerId) {
                handleCancel();
              } else {
                setShowForm(!showForm);
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold shadow-sm hover:bg-emerald-700 hover:shadow-md transition"
          >

            {showForm ? (
              <>
                <X className="w-4 h-4" />
                Close Form
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Add Customer
              </>
            )}

          </button>

        </div>

      </div>


      {/* =========================
          CUSTOMER FORM
      ========================== */}

      {showForm && (

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-8 overflow-hidden">

          {/* Form Header */}

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">

                {editingCustomerId ? (
                  <Pencil className="w-5 h-5 text-emerald-600" />
                ) : (
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                )}

              </div>

              <div>

                <h3 className="text-lg font-bold text-gray-900">
                  {editingCustomerId
                    ? 'Edit Customer'
                    : 'Add New Customer'}
                </h3>

                <p className="text-sm text-gray-500 mt-0.5">
                  {editingCustomerId
                    ? 'Update the customer information below.'
                    : 'Enter the customer details to add them to Agrivyn.'}
                </p>

              </div>

            </div>

          </div>


          {/* Form */}

          <form onSubmit={handleSubmit}>

            <div className="p-5 sm:p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Name */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Name
                  </label>

                  <div className="relative">

                    <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      placeholder="Enter customer name"
                    />

                  </div>

                </div>


                {/* Phone */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>

                  <div className="relative">

                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      placeholder="Enter phone number"
                    />

                  </div>

                </div>


                {/* Address */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>

                  <div className="relative">

                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      placeholder="Enter address"
                    />

                  </div>

                </div>


                {/* Location */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>

                  <div className="relative">

                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      placeholder="Enter location"
                    />

                  </div>

                </div>

              </div>


              {/* Buttons */}

              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-gray-100">

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-sm"
                >

                  <Save className="w-4 h-4" />

                  {editingCustomerId
                    ? 'Update Customer'
                    : 'Save Customer'}

                </button>


                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >

                  <X className="w-4 h-4" />

                  Cancel

                </button>

              </div>

            </div>

          </form>

        </div>

      )}


      {/* =========================
          CUSTOMER LIST HEADER
      ========================== */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <div className="flex items-center gap-2">

                <h3 className="text-lg font-bold text-gray-900">
                  Customer Directory
                </h3>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  {customers.length}
                </span>

              </div>

              <p className="text-sm text-gray-500 mt-1">
                View and manage all registered customers.
              </p>

            </div>


            {/* Search */}

            <div className="relative w-full lg:w-80">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search customers..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
              />

            </div>

          </div>

        </div>


        {/* =========================
            CUSTOMER TABLE
        ========================== */}

        {filteredCustomers.length > 0 ? (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="bg-gray-50 border-b border-gray-100">

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Address
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Location
                  </th>

                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {filteredCustomers.map(customer => (

                  <tr
                    key={customer.customer_id}
                    className="hover:bg-gray-50/70 transition"
                  >

                    {/* Customer */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {getInitials(customer.name)}
                        </div>

                        <div>

                          <p className="font-semibold text-gray-800">
                            {customer.name}
                          </p>

                          <p className="text-xs text-gray-400 mt-0.5">
                            Customer #{customer.customer_id}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Phone */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2 text-sm text-gray-600">

                        <Phone className="w-4 h-4 text-gray-400" />

                        {customer.phone}

                      </div>

                    </td>


                    {/* Address */}

                    <td className="px-6 py-4">

                      <p className="text-sm text-gray-600 max-w-xs truncate">
                        {customer.address || '—'}
                      </p>

                    </td>


                    {/* Location */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2 text-sm text-gray-600">

                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />

                        {customer.location || '—'}

                      </div>

                    </td>


                    {/* Actions */}

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => handleEdit(customer)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-sm transition"
                        >

                          <Pencil className="w-3.5 h-3.5" />

                          Edit

                        </button>


                        <button
                          onClick={() => handleDelete(customer.customer_id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition"
                        >

                          <Trash2 className="w-3.5 h-3.5" />

                          Delete

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          /* =========================
             EMPTY STATE
          ========================== */

          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">

            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">

              {searchTerm ? (
                <Search className="w-7 h-7 text-emerald-500" />
              ) : (
                <Users className="w-7 h-7 text-emerald-500" />
              )}

            </div>


            <h4 className="text-lg font-bold text-gray-800">

              {searchTerm
                ? 'No customers found'
                : 'No customers yet'}

            </h4>


            <p className="text-sm text-gray-400 mt-1 max-w-sm">

              {searchTerm
                ? 'Try changing your search to find the customer you are looking for.'
                : 'Add your first customer to start managing your customer directory.'}

            </p>


            {!searchTerm && (

              <button
                onClick={() => setShowForm(true)}
                className="mt-5 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
              >

                <UserPlus className="w-4 h-4" />

                Add Customer

              </button>

            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Customers;