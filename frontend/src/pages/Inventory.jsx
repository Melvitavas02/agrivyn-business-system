import { useEffect, useState } from 'react';
import {
  Boxes,
  Plus,
  X,
  Save,
  Search,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

function Inventory() {
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredStock = stock.filter(item => {
    const search = searchTerm.toLowerCase();

    return (
      item.product_name?.toLowerCase().includes(search) ||
      item.unit?.toLowerCase().includes(search)
    );
  });

  const lowStockCount = stock.filter(
    item => Number(item.current_stock) <= 10
  ).length;

  const totalProducts = stock.length;

  const getTransactionIcon = (type) => {
    if (type === 'Stock In') {
      return ArrowDownToLine;
    }

    if (type === 'Sale') {
      return ArrowUpFromLine;
    }

    return SlidersHorizontal;
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
                <Boxes className="w-5 h-5 text-emerald-600" />
              </div>

              <span className="text-sm font-semibold text-emerald-600">
                INVENTORY MANAGEMENT
              </span>

            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Inventory
            </h2>

            <p className="text-gray-500 mt-2 max-w-2xl">
              Record stock movements and monitor the current stock
              available for each product.
            </p>

          </div>


          <button
            onClick={() => setShowForm(!showForm)}
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
                Add Transaction
              </>
            )}

          </button>

        </div>

      </div>


      {/* =========================
          INVENTORY SUMMARY
      ========================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Products Tracked
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalProducts}
              </p>

            </div>

          </div>

        </div>


        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Low Stock Items
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {lowStockCount}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          TRANSACTION FORM
      ========================== */}

      {showForm && (

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-8 overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Plus className="w-5 h-5 text-emerald-600" />
              </div>

              <div>

                <h3 className="text-lg font-bold text-gray-900">
                  Add Inventory Transaction
                </h3>

                <p className="text-sm text-gray-500 mt-0.5">
                  Record a stock movement for a product.
                </p>

              </div>

            </div>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="p-5 sm:p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Product */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product
                  </label>

                  <select
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
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

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transaction Type
                  </label>

                  <select
                    name="transaction_type"
                    value={formData.transaction_type}
                    onChange={handleChange}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
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

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                    placeholder="Enter quantity"
                  />

                </div>


                {/* Notes */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes
                  </label>

                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                    placeholder="Optional notes"
                  />

                </div>

              </div>


              {/* Buttons */}

              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-gray-100">

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-sm"
                >

                  <Save className="w-4 h-4" />
                  Save Transaction

                </button>


                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
          STOCK DIRECTORY
      ========================== */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <div className="flex items-center gap-2">

                <h3 className="text-lg font-bold text-gray-900">
                  Stock Overview
                </h3>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  {stock.length}
                </span>

              </div>

              <p className="text-sm text-gray-500 mt-1">
                Monitor current stock levels across your products.
              </p>

            </div>


            {/* Search */}

            <div className="relative w-full lg:w-80">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search inventory..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
              />

            </div>

          </div>

        </div>


        {/* =========================
            STOCK TABLE
        ========================== */}

        {filteredStock.length > 0 ? (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>

                <tr className="bg-gray-50 border-b border-gray-100">

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {filteredStock.map(item => {

                  const currentStock = Number(item.current_stock);

                  const isLowStock = currentStock <= 10;

                  return (

                    <tr
                      key={item.product_id}
                      className="hover:bg-gray-50/70 transition"
                    >

                      {/* Product */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                              isLowStock
                                ? 'bg-red-50 text-red-600'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            <Package className="w-4 h-4" />
                          </div>

                          <div>

                            <p className="font-semibold text-gray-800">
                              {item.product_name}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              Product #{item.product_id}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Unit */}

                      <td className="px-6 py-4">

                        <span className="text-sm text-gray-600">
                          {item.unit}
                        </span>

                      </td>


                      {/* Current Stock */}

                      <td className="px-6 py-4">

                        <p
                          className={`font-bold ${
                            isLowStock
                              ? 'text-red-600'
                              : 'text-gray-800'
                          }`}
                        >
                          {currentStock.toFixed(2)}
                        </p>

                        <p className="text-xs text-gray-400 mt-0.5">
                          Available
                        </p>

                      </td>


                      {/* Status */}

                      <td className="px-6 py-4">

                        {isLowStock ? (

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-red-50 text-red-700 border-red-100 text-xs font-semibold">

                            <AlertTriangle className="w-3.5 h-3.5" />

                            Low Stock

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-100 text-xs font-semibold">

                            <CheckCircle2 className="w-3.5 h-3.5" />

                            In Stock

                          </span>

                        )}

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">

            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">

              {searchTerm ? (
                <Search className="w-7 h-7 text-emerald-500" />
              ) : (
                <Boxes className="w-7 h-7 text-emerald-500" />
              )}

            </div>

            <h4 className="text-lg font-bold text-gray-800">

              {searchTerm
                ? 'No inventory found'
                : 'No inventory data'}

            </h4>

            <p className="text-sm text-gray-400 mt-1 max-w-sm">

              {searchTerm
                ? 'Try changing your search.'
                : 'Inventory information will appear here when products are available.'}

            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default Inventory;