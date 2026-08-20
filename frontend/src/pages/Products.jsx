import { useEffect, useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  Tag,
  IndianRupee,
  Boxes,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredProducts = products.filter(product => {
    const search = searchTerm.toLowerCase();

    return (
      product.product_name?.toLowerCase().includes(search) ||
      product.category?.toLowerCase().includes(search) ||
      product.unit?.toLowerCase().includes(search)
    );
  });

  const getProductInitial = (name) => {
    if (!name) return 'P';

    return name.charAt(0).toUpperCase();
  };

  const getStockStatus = (product) => {
    const stock = Number(product.stock_quantity || 0);
    const limit = Number(product.low_stock_limit || 0);

    if (stock <= limit) {
      return {
        label: 'Low Stock',
        className: 'bg-red-50 text-red-700 border-red-100',
        icon: AlertTriangle
      };
    }

    return {
      label: 'In Stock',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      icon: CheckCircle2
    };
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
                <Package className="w-5 h-5 text-emerald-600" />
              </div>

              <span className="text-sm font-semibold text-emerald-600">
                PRODUCT MANAGEMENT
              </span>

            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Products
            </h2>

            <p className="text-gray-500 mt-2 max-w-2xl">
              Add and manage the products your business sells, including
              pricing, units and stock information.
            </p>

          </div>


          <button
            onClick={() => {
              if (showForm && editingProductId) {
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
                <Plus className="w-4 h-4" />
                Add Product
              </>
            )}

          </button>

        </div>

      </div>


      {/* =========================
          PRODUCT FORM
      ========================== */}

      {showForm && (

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-8 overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">

                {editingProductId ? (
                  <Pencil className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Plus className="w-5 h-5 text-emerald-600" />
                )}

              </div>

              <div>

                <h3 className="text-lg font-bold text-gray-900">
                  {editingProductId ? 'Edit Product' : 'Add New Product'}
                </h3>

                <p className="text-sm text-gray-500 mt-0.5">
                  {editingProductId
                    ? 'Update the product information below.'
                    : 'Enter the product details to add it to your catalogue.'}
                </p>

              </div>

            </div>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="p-5 sm:p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Product Name */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name
                  </label>

                  <div className="relative">

                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <input
                      type="text"
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      placeholder="Enter product name"
                    />

                  </div>

                </div>


                {/* Category */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>

                  <div className="relative">

                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      placeholder="Enter category"
                    />

                  </div>

                </div>


                {/* Price */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price
                  </label>

                  <div className="relative">

                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      placeholder="Enter price"
                    />

                  </div>

                </div>


                {/* Unit */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unit
                  </label>

                  <div className="relative">

                    <Boxes className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      placeholder="e.g. kg"
                    />

                  </div>

                </div>


                {/* Initial Stock */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Initial Stock
                  </label>

                  <div className="relative">

                    <Boxes className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      placeholder="Enter initial stock"
                    />

                  </div>

                </div>


                {/* Low Stock Limit */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Low Stock Limit
                  </label>

                  <div className="relative">

                    <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <input
                      type="number"
                      name="low_stock_limit"
                      value={formData.low_stock_limit}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      placeholder="Enter low stock limit"
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

                  {editingProductId ? 'Update Product' : 'Save Product'}

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
          PRODUCT DIRECTORY
      ========================== */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <div className="flex items-center gap-2">

                <h3 className="text-lg font-bold text-gray-900">
                  Product Catalogue
                </h3>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  {products.length}
                </span>

              </div>

              <p className="text-sm text-gray-500 mt-1">
                View and manage all products in your catalogue.
              </p>

            </div>


            {/* Search */}

            <div className="relative w-full lg:w-80">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
              />

            </div>

          </div>

        </div>


        {/* =========================
            PRODUCT TABLE
        ========================== */}

        {filteredProducts.length > 0 ? (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead>

                <tr className="bg-gray-50 border-b border-gray-100">

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {filteredProducts.map(product => {

                  const stockStatus = getStockStatus(product);
                  const StatusIcon = stockStatus.icon;

                  return (

                    <tr
                      key={product.product_id}
                      className="hover:bg-gray-50/70 transition"
                    >

                      {/* Product */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                            {getProductInitial(product.product_name)}
                          </div>

                          <div>

                            <p className="font-semibold text-gray-800">
                              {product.product_name}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              Product #{product.product_id}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Category */}

                      <td className="px-6 py-4">

                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                          {product.category || 'Uncategorized'}
                        </span>

                      </td>


                      {/* Price */}

                      <td className="px-6 py-4">

                        <p className="font-semibold text-gray-800">
                          ₹{Number(product.price || 0).toLocaleString('en-IN')}
                        </p>

                      </td>


                      {/* Unit */}

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.unit}
                      </td>


                      {/* Stock */}

                      <td className="px-6 py-4">

                        <p className="font-semibold text-gray-800">
                          {product.stock_quantity} {product.unit}
                        </p>

                        <p className="text-xs text-gray-400 mt-0.5">
                          Limit: {product.low_stock_limit}
                        </p>

                      </td>


                      {/* Status */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${stockStatus.className}`}
                        >

                          <StatusIcon className="w-3.5 h-3.5" />

                          {stockStatus.label}

                        </span>

                      </td>


                      {/* Actions */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() => handleEdit(product)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-sm transition"
                          >

                            <Pencil className="w-3.5 h-3.5" />

                            Edit

                          </button>


                          <button
                            onClick={() => handleDelete(product.product_id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition"
                          >

                            <Trash2 className="w-3.5 h-3.5" />

                            Delete

                          </button>

                        </div>

                      </td>

                    </tr>

                  );

                })}

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
                <Package className="w-7 h-7 text-emerald-500" />
              )}

            </div>


            <h4 className="text-lg font-bold text-gray-800">

              {searchTerm
                ? 'No products found'
                : 'No products yet'}

            </h4>


            <p className="text-sm text-gray-400 mt-1 max-w-sm">

              {searchTerm
                ? 'Try changing your search to find the product you are looking for.'
                : 'Add your first product to start building your catalogue.'}

            </p>


            {!searchTerm && (

              <button
                onClick={() => setShowForm(true)}
                className="mt-5 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
              >

                <Plus className="w-4 h-4" />

                Add Product

              </button>

            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Products;