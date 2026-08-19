import { useEffect, useState } from 'react';

function Inventory() {
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    product_id: '',
    transaction_type: 'Stock In',
    quantity: '',
    notes: ''
  });

  const fetchStock = () => {
    fetch('https://agrivyn-backend.onrender.com/api/inventory/stock')
      .then(response => response.json())
      .then(data => {
        setStock(data);
      })
      .catch(error => {
        console.error('Failed to fetch stock:', error);
      });
  };

  const fetchProducts = () => {
    fetch('https://agrivyn-backend.onrender.com/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error('Failed to fetch products:', error);
      });
  };

  useEffect(() => {
    fetchStock();
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('https://agrivyn-backend.onrender.com/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: Number(formData.product_id),
        transaction_type: formData.transaction_type,
        quantity: Number(formData.quantity),
        notes: formData.notes
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          return;
        }

        alert('Inventory transaction added successfully!');

        setFormData({
          product_id: '',
          transaction_type: 'Stock In',
          quantity: '',
          notes: ''
        });

        setShowForm(false);
        fetchStock();
      })
      .catch(error => {
        console.error('Failed to add inventory transaction:', error);
      });
  };

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Inventory
          </h2>

          <p className="text-gray-500 mt-1">
            Manage stock and inventory transactions
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800"
        >
          + Add Transaction
        </button>

      </div>


      {/* Transaction Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <h3 className="text-xl font-semibold text-gray-800 mb-5">
            Add Inventory Transaction
          </h3>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Product */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>

                <select
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >

                  <option value="">
                    Select Product
                  </option>

                  {products.map(product => (
                    <option
                      key={product.product_id}
                      value={product.product_id}
                    >
                      {product.product_name}
                    </option>
                  ))}

                </select>

              </div>


              {/* Transaction Type */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>

                <select
                  name="transaction_type"
                  value={formData.transaction_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >

                  <option value="Stock In">
                    Stock In
                  </option>

                  <option value="Sale">
                    Sale
                  </option>

                  <option value="Adjustment">
                    Adjustment
                  </option>

                </select>

              </div>


              {/* Quantity */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter quantity"
                />

              </div>


              {/* Notes */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>

                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Optional notes"
                />

              </div>

            </div>


            {/* Buttons */}
            <div className="flex gap-3 mt-6">

              <button
                type="submit"
                className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800"
              >
                Save Transaction
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


      {/* Stock Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Product
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Unit
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Current Stock
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Stock Status
              </th>

            </tr>

          </thead>

          <tbody>

            {stock.map(item => (

              <tr
                key={item.product_id}
                className="border-t"
              >

                <td className="px-6 py-4 font-medium text-gray-800">
                  {item.product_name}
                </td>

                <td className="px-6 py-4">
                  {item.unit}
                </td>

                <td className="px-6 py-4">
                  {Number(item.current_stock).toFixed(2)}
                </td>

                <td className="px-6 py-4">

                  {Number(item.current_stock) <= 10 ? (
                    <span className="text-red-600 font-medium">
                      Low Stock
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">
                      In Stock
                    </span>
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Inventory;