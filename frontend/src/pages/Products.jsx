import { useEffect, useState } from 'react';

function Products() {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    price: '',
    unit: '',
    stock_quantity: '',
    low_stock_limit: ''
  });

  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

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
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleEdit = (product) => {
    setFormData({
      product_name: product.product_name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      stock_quantity: product.stock_quantity,
      low_stock_limit: product.low_stock_limit
    });

    setEditingProductId(product.product_id);
    setShowForm(true);
  };

  const handleDelete = (productId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    );

    if (!confirmed) {
      return;
    }

    fetch(`https://agrivyn-backend.onrender.com/api/products/${productId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        fetchProducts();
      })
      .catch(error => {
        console.error('Failed to delete product:', error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const url = editingProductId
      ? `https://agrivyn-backend.onrender.com/api/products/${editingProductId}`
      : 'https://agrivyn-backend.onrender.com/api/products';

    const method = editingProductId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formData,
        price: Number(formData.price),
        stock_quantity: Number(formData.stock_quantity),
        low_stock_limit: Number(formData.low_stock_limit)
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);

        setFormData({
          product_name: '',
          category: '',
          price: '',
          unit: '',
          stock_quantity: '',
          low_stock_limit: ''
        });

        setEditingProductId(null);
        setShowForm(false);

        fetchProducts();
      })
      .catch(error => {
        console.error('Failed to save product:', error);
      });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProductId(null);

    setFormData({
      product_name: '',
      category: '',
      price: '',
      unit: '',
      stock_quantity: '',
      low_stock_limit: ''
    });
  };

  return (
    <div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Products
          </h2>

          <p className="text-gray-500 mt-1">
            Manage your products and stock
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto bg-green-700 text-white px-5 py-3 rounded-lg hover:bg-green-800"
        >
          + Add Product
        </button>

      </div>


      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6">

          <h3 className="text-xl font-semibold text-gray-800 mb-5">
            {editingProductId ? 'Edit Product' : 'Add New Product'}
          </h3>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>

                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-3"
                  placeholder="Enter product name"
                />
              </div>


              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3"
                  placeholder="Enter category"
                />
              </div>


              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-3"
                  placeholder="Enter price"
                />
              </div>


              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>

                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-3"
                  placeholder="e.g. kg"
                />
              </div>


              {/* Stock Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Stock
                </label>

                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-3"
                  placeholder="Enter initial stock"
                />
              </div>


              {/* Low Stock Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Low Stock Limit
                </label>

                <input
                  type="number"
                  name="low_stock_limit"
                  value={formData.low_stock_limit}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-3"
                  placeholder="Enter low stock limit"
                />
              </div>

            </div>


            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">

              <button
                type="submit"
                className="w-full sm:w-auto bg-green-700 text-white px-5 py-3 rounded-lg hover:bg-green-800"
              >
                {editingProductId ? 'Update Product' : 'Save Product'}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto bg-gray-200 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}


      {/* Products Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {/* Horizontal scrolling on mobile */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  ID
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Product
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Category
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Price
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Unit
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Stock
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {products.map(product => (

                <tr
                  key={product.product_id}
                  className="border-t"
                >

                  <td className="px-6 py-4">
                    {product.product_id}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-800">
                    {product.product_name}
                  </td>

                  <td className="px-6 py-4">
                    {product.category}
                  </td>

                  <td className="px-6 py-4">
                    ₹{product.price}
                  </td>

                  <td className="px-6 py-4">
                    {product.unit}
                  </td>

                  <td className="px-6 py-4">
                    {product.stock_quantity} {product.unit}
                  </td>

                  <td className="px-6 py-4">
                    {product.status}
                  </td>

                  <td className="px-6 py-4">

                    <div className="flex gap-4">

                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product.product_id)}
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

    </div>
  );
}

export default Products;