import { useEffect, useState } from 'react';
import {
  ShoppingCart,
  Plus,
  X,
  Save,
  Search,
  Eye,
  Trash2,
  User,
  CalendarDays,
  Package,
  IndianRupee,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle
} from 'lucide-react';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    customer_id: '',
    order_date: ''
  });

  const [items, setItems] = useState([
    {
      product_id: '',
      quantity: ''
    }
  ]);

  const fetchOrders = () => {
    fetch('https://agrivyn-backend.onrender.com/api/orders')
      .then(response => response.json())
      .then(data => {
        setOrders(data);
      })
      .catch(error => {
        console.error('Failed to fetch orders:', error);
      });
  };

  const fetchOrderDetails = (orderId) => {
    fetch(`https://agrivyn-backend.onrender.com/api/orders/${orderId}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          return;
        }

        setSelectedOrder(data);
      })
      .catch(error => {
        console.error('Failed to fetch order details:', error);
      });
  };

  const updateOrderStatus = (orderId, status) => {
    fetch(`https://agrivyn-backend.onrender.com/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          return;
        }

        fetchOrders();

        if (selectedOrder) {
          fetchOrderDetails(orderId);
        }
      })
      .catch(error => {
        console.error('Failed to update order status:', error);
      });
  };

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
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleItemChange = (index, event) => {
    const updatedItems = [...items];

    updatedItems[index][event.target.name] = event.target.value;

    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: '',
        quantity: ''
      }
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) {
      return;
    }

    const updatedItems = items.filter(
      (_, itemIndex) => itemIndex !== index
    );

    setItems(updatedItems);
  };

  const totalAmount = items.reduce((total, item) => {
    const product = products.find(
      product => product.product_id === Number(item.product_id)
    );

    if (!product || !item.quantity) {
      return total;
    }

    return total + Number(item.quantity) * Number(product.price);
  }, 0);

  const handleSubmit = (event) => {
    event.preventDefault();

    const validItems = items.filter(
      item => item.product_id && Number(item.quantity) > 0
    );

    if (validItems.length === 0) {
      alert('Please add at least one product.');
      return;
    }

    const orderData = {
      customer_id: Number(formData.customer_id),
      order_date: formData.order_date,
      items: validItems.map(item => {
        const product = products.find(
          product => product.product_id === Number(item.product_id)
        );

        return {
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          unit_price: Number(product.price)
        };
      })
    };

    fetch('https://agrivyn-backend.onrender.com/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          return;
        }

        alert('Order created successfully!');

        setFormData({
          customer_id: '',
          order_date: ''
        });

        setItems([
          {
            product_id: '',
            quantity: ''
          }
        ]);

        setShowForm(false);
        fetchOrders();
      })
      .catch(error => {
        console.error('Failed to create order:', error);
        alert('Failed to create order.');
      });
  };

  const filteredOrders = orders.filter(order => {
    const search = searchTerm.toLowerCase();

    return (
      String(order.order_id).includes(search) ||
      String(order.customer_id).includes(search) ||
      order.status?.toLowerCase().includes(search) ||
      order.order_date?.toLowerCase().includes(search)
    );
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed':
        return {
          className: 'bg-blue-50 text-blue-700 border-blue-100',
          icon: CheckCircle2
        };

      case 'Delivered':
        return {
          className: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          icon: Truck
        };

      case 'Cancelled':
        return {
          className: 'bg-red-50 text-red-700 border-red-100',
          icon: XCircle
        };

      case 'Pending':
      default:
        return {
          className: 'bg-amber-50 text-amber-700 border-amber-100',
          icon: Clock3
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
              </div>

              <span className="text-sm font-semibold text-emerald-600">
                ORDER MANAGEMENT
              </span>

            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Orders
            </h2>

            <p className="text-gray-500 mt-2 max-w-2xl">
              Create customer orders, manage order status and view
              detailed order information.
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
                Create Order
              </>
            )}

          </button>

        </div>

      </div>


      {/* =========================
          CREATE ORDER FORM
      ========================== */}

      {showForm && (

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-8 overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
              </div>

              <div>

                <h3 className="text-lg font-bold text-gray-900">
                  Create New Order
                </h3>

                <p className="text-sm text-gray-500 mt-0.5">
                  Select a customer and add one or more products.
                </p>

              </div>

            </div>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="p-5 sm:p-6">

              {/* Customer + Date */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer
                  </label>

                  <div className="relative">

                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                    <select
                      name="customer_id"
                      value={formData.customer_id}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                    >

                      <option value="">
                        Select Customer
                      </option>

                      {customers.map(customer => (
                        <option
                          key={customer.customer_id}
                          value={customer.customer_id}
                        >
                          {customer.name}
                        </option>
                      ))}

                    </select>

                  </div>

                </div>


                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Order Date
                  </label>

                  <div className="relative">

                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                    <input
                      type="date"
                      name="order_date"
                      value={formData.order_date}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                    />

                  </div>

                </div>

              </div>


              {/* Order Items */}

              <div className="mt-7">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

                  <div>

                    <h4 className="text-base font-bold text-gray-900">
                      Order Items
                    </h4>

                    <p className="text-xs text-gray-500 mt-1">
                      Add the products and quantities included in this order.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={addItem}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>

                </div>


                <div className="space-y-3">

                  {items.map((item, index) => {

                    const selectedProduct = products.find(
                      product =>
                        product.product_id === Number(item.product_id)
                    );

                    const itemTotal =
                      selectedProduct && item.quantity
                        ? Number(item.quantity) *
                          Number(selectedProduct.price)
                        : 0;

                    return (

                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                      >

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

                          {/* Product */}

                          <div className="md:col-span-6">

                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                              Product
                            </label>

                            <select
                              name="product_id"
                              value={item.product_id}
                              onChange={(event) =>
                                handleItemChange(index, event)
                              }
                              required
                              className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                            >

                              <option value="">
                                Select Product
                              </option>

                              {products.map(product => (
                                <option
                                  key={product.product_id}
                                  value={product.product_id}
                                >
                                  {product.product_name} — ₹
                                  {product.price}/{product.unit}
                                </option>
                              ))}

                            </select>

                          </div>


                          {/* Quantity */}

                          <div className="md:col-span-2">

                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                              Quantity
                            </label>

                            <input
                              type="number"
                              name="quantity"
                              value={item.quantity}
                              onChange={(event) =>
                                handleItemChange(index, event)
                              }
                              min="1"
                              required
                              className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                              placeholder="Qty"
                            />

                          </div>


                          {/* Item Total */}

                          <div className="md:col-span-3">

                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                              Item Total
                            </label>

                            <div className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2.5">

                              <span className="font-semibold text-gray-800">
                                ₹{itemTotal.toFixed(2)}
                              </span>

                              {items.length > 1 && (

                                <button
                                  type="button"
                                  onClick={() => removeItem(index)}
                                  className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-semibold"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Remove
                                </button>

                              )}

                            </div>

                          </div>

                        </div>

                      </div>

                    );
                  })}

                </div>

              </div>


              {/* Total */}

              <div className="mt-6 flex justify-end">

                <div className="w-full sm:w-80 bg-emerald-50 border border-emerald-100 rounded-xl p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-emerald-700 font-medium">
                        Estimated Total
                      </p>

                      <p className="text-xs text-emerald-600 mt-1">
                        Based on selected products and quantities
                      </p>

                    </div>

                    <IndianRupee className="w-6 h-6 text-emerald-500" />

                  </div>

                  <p className="text-2xl font-bold text-emerald-800 mt-3">
                    ₹{totalAmount.toFixed(2)}
                  </p>

                </div>

              </div>


              {/* Buttons */}

              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-gray-100">

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-sm"
                >

                  <Save className="w-4 h-4" />
                  Create Order

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
          ORDERS DIRECTORY
      ========================== */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <div className="flex items-center gap-2">

                <h3 className="text-lg font-bold text-gray-900">
                  Order Directory
                </h3>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  {orders.length}
                </span>

              </div>

              <p className="text-sm text-gray-500 mt-1">
                View, update and inspect customer orders.
              </p>

            </div>


            {/* Search */}

            <div className="relative w-full lg:w-80">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search orders..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
              />

            </div>

          </div>

        </div>


        {/* =========================
            ORDER TABLE
        ========================== */}

        {filteredOrders.length > 0 ? (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="bg-gray-50 border-b border-gray-100">

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total
                  </th>

                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {filteredOrders.map(order => {

                  const statusStyle = getStatusStyle(order.status);
                  const StatusIcon = statusStyle.icon;

                  return (

                    <tr
                      key={order.order_id}
                      className="hover:bg-gray-50/70 transition"
                    >

                      {/* Order */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <ShoppingCart className="w-4 h-4" />
                          </div>

                          <div>

                            <p className="font-semibold text-gray-800">
                              Order #{order.order_id}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              Sales order
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Customer */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <User className="w-4 h-4 text-gray-400" />

                          Customer #{order.customer_id}

                        </div>

                      </td>


                      {/* Date */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <CalendarDays className="w-4 h-4 text-gray-400" />

                          {formatDate(order.order_date)}

                        </div>

                      </td>


                      {/* Status */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2">

                          <select
                            value={order.status}
                            onChange={(event) =>
                              updateOrderStatus(
                                order.order_id,
                                event.target.value
                              )
                            }
                            className="border border-gray-200 bg-white rounded-lg px-2.5 py-2 text-xs font-medium text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <span
                            className={`hidden xl:inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[11px] font-semibold ${statusStyle.className}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {order.status}
                          </span>

                        </div>

                      </td>


                      {/* Total */}

                      <td className="px-6 py-4">

                        <p className="font-bold text-gray-800">
                          ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
                        </p>

                      </td>


                      {/* Actions */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end">

                          <button
                            onClick={() =>
                              fetchOrderDetails(order.order_id)
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-sm transition"
                          >

                            <Eye className="w-3.5 h-3.5" />

                            View Details

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

          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">

            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">

              {searchTerm ? (
                <Search className="w-7 h-7 text-emerald-500" />
              ) : (
                <ShoppingCart className="w-7 h-7 text-emerald-500" />
              )}

            </div>

            <h4 className="text-lg font-bold text-gray-800">

              {searchTerm
                ? 'No orders found'
                : 'No orders yet'}

            </h4>

            <p className="text-sm text-gray-400 mt-1 max-w-sm">

              {searchTerm
                ? 'Try changing your search to find the order you are looking for.'
                : 'Create your first order to start tracking sales.'}

            </p>

            {!searchTerm && (

              <button
                onClick={() => setShowForm(true)}
                className="mt-5 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
              >

                <Plus className="w-4 h-4" />

                Create Order

              </button>

            )}

          </div>

        )}

      </div>


      {/* =========================
          ORDER DETAILS
      ========================== */}

      {selectedOrder && (

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mt-8 overflow-hidden">

          {/* Details Header */}

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Package className="w-5 h-5 text-emerald-600" />
                </div>

                <div>

                  <h3 className="text-lg font-bold text-gray-900">
                    Order #{selectedOrder.order.order_id}
                  </h3>

                  <p className="text-sm text-gray-500 mt-0.5">
                    Complete order information
                  </p>

                </div>

              </div>


              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition"
              >

                <X className="w-4 h-4" />
                Close

              </button>

            </div>

          </div>


          <div className="p-5 sm:p-6">

            {/* Customer Information */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">

                <div className="flex items-center gap-2 mb-3">

                  <User className="w-4 h-4 text-emerald-600" />

                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Customer
                  </p>

                </div>

                <p className="font-bold text-gray-800">
                  {selectedOrder.order.customer_name}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedOrder.order.customer_phone}
                </p>

              </div>


              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">

                <div className="flex items-center gap-2 mb-3">

                  <Clock3 className="w-4 h-4 text-emerald-600" />

                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Order Status
                  </p>

                </div>

                <div className="flex flex-wrap items-center gap-3">

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${
                      getStatusStyle(selectedOrder.order.status).className
                    }`}
                  >

                    {selectedOrder.order.status}

                  </span>

                  <span className="text-sm text-gray-500">
                    {formatDate(selectedOrder.order.order_date)}
                  </span>

                </div>

              </div>

            </div>


            {/* Products */}

            <div>

              <div className="flex items-center gap-2 mb-4">

                <Package className="w-5 h-5 text-emerald-600" />

                <h4 className="text-lg font-bold text-gray-900">
                  Products
                </h4>

              </div>


              <div className="border border-gray-200 rounded-xl overflow-hidden">

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[650px]">

                    <thead>

                      <tr className="bg-gray-50 border-b border-gray-100">

                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Product
                        </th>

                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Quantity
                        </th>

                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Unit Price
                        </th>

                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Total
                        </th>

                      </tr>

                    </thead>


                    <tbody className="divide-y divide-gray-100">

                      {selectedOrder.items.map(item => (

                        <tr key={item.order_item_id}>

                          <td className="px-4 py-4">

                            <div className="flex items-center gap-3">

                              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <Package className="w-4 h-4 text-emerald-600" />
                              </div>

                              <span className="font-semibold text-gray-800">
                                {item.product_name}
                              </span>

                            </div>

                          </td>

                          <td className="px-4 py-4 text-sm text-gray-600">
                            {item.quantity} {item.unit}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-600">
                            ₹{item.unit_price}
                          </td>

                          <td className="px-4 py-4 text-right font-semibold text-gray-800">
                            ₹{item.item_total}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>


            {/* Grand Total */}

            <div className="flex justify-end mt-6">

              <div className="w-full sm:w-72 bg-emerald-50 border border-emerald-100 rounded-xl p-5">

                <div className="flex items-center justify-between">

                  <p className="text-sm font-medium text-emerald-700">
                    Grand Total
                  </p>

                  <IndianRupee className="w-5 h-5 text-emerald-500" />

                </div>

                <p className="text-2xl font-bold text-emerald-800 mt-2">
                  ₹{Number(selectedOrder.order.total_amount || 0).toLocaleString('en-IN')}
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Orders;