import { useEffect, useState } from 'react';
import {
  Truck,
  Plus,
  X,
  Save,
  Search,
  CalendarDays,
  Package,
  Clock3,
  CheckCircle2,
  XCircle,
  MapPin
} from 'lucide-react';

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [orders, setOrders] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    order_id: '',
    delivery_date: '',
    status: 'Pending',
    notes: ''
  });

  const fetchDeliveries = () => {
    fetch('https://agrivyn-backend.onrender.com/api/deliveries')
      .then(response => response.json())
      .then(data => {
        setDeliveries(data);
      })
      .catch(error => {
        console.error('Failed to fetch deliveries:', error);
      });
  };

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

  useEffect(() => {
    fetchDeliveries();
    fetchOrders();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('https://agrivyn-backend.onrender.com/api/deliveries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_id: Number(formData.order_id),
        delivery_date: formData.delivery_date,
        status: formData.status,
        notes: formData.notes
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          return;
        }

        alert('Delivery created successfully!');

        setFormData({
          order_id: '',
          delivery_date: '',
          status: 'Pending',
          notes: ''
        });

        setShowForm(false);
        fetchDeliveries();
      })
      .catch(error => {
        console.error('Failed to create delivery:', error);
        alert('Failed to create delivery.');
      });
  };

  const updateDeliveryStatus = (deliveryId, newStatus, delivery) => {
    const deliveryDate = delivery.delivery_date
      ? delivery.delivery_date.substring(0, 10)
      : '';

    fetch(`https://agrivyn-backend.onrender.com/api/deliveries/${deliveryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        delivery_date: deliveryDate,
        status: newStatus,
        notes: delivery.notes || ''
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          return;
        }

        fetchDeliveries();
      })
      .catch(error => {
        console.error('Failed to update delivery status:', error);
        alert('Failed to update delivery status.');
      });
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const search = searchTerm.toLowerCase();

    return (
      String(delivery.delivery_id).includes(search) ||
      String(delivery.order_id).includes(search) ||
      delivery.status?.toLowerCase().includes(search) ||
      delivery.notes?.toLowerCase().includes(search)
    );
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return {
          className: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          icon: CheckCircle2
        };

      case 'Out for Delivery':
        return {
          className: 'bg-blue-50 text-blue-700 border-blue-100',
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

  const pendingCount = deliveries.filter(
    delivery => delivery.status === 'Pending'
  ).length;

  const outForDeliveryCount = deliveries.filter(
    delivery => delivery.status === 'Out for Delivery'
  ).length;

  const deliveredCount = deliveries.filter(
    delivery => delivery.status === 'Delivered'
  ).length;

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
                <Truck className="w-5 h-5 text-emerald-600" />
              </div>

              <span className="text-sm font-semibold text-emerald-600">
                DELIVERY MANAGEMENT
              </span>

            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Deliveries
            </h2>

            <p className="text-gray-500 mt-2 max-w-2xl">
              Create deliveries for orders and track delivery dates,
              progress and status.
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
                Create Delivery
              </>
            )}

          </button>

        </div>

      </div>


      {/* =========================
          DELIVERY SUMMARY
      ========================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        {/* Pending */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock3 className="w-5 h-5 text-amber-500" />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Pending
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {pendingCount}
              </p>

            </div>

          </div>

        </div>


        {/* Out for Delivery */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-500" />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Out for Delivery
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {outForDeliveryCount}
              </p>

            </div>

          </div>

        </div>


        {/* Delivered */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Delivered
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {deliveredCount}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          CREATE DELIVERY FORM
      ========================== */}

      {showForm && (

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-8 overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Truck className="w-5 h-5 text-emerald-600" />
              </div>

              <div>

                <h3 className="text-lg font-bold text-gray-900">
                  Create Delivery
                </h3>

                <p className="text-sm text-gray-500 mt-0.5">
                  Schedule a delivery and assign its current status.
                </p>

              </div>

            </div>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="p-5 sm:p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Order */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Order
                  </label>

                  <div className="relative">

                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                    <select
                      name="order_id"
                      value={formData.order_id}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                    >

                      <option value="">
                        Select Order
                      </option>

                      {orders.map(order => (

                        <option
                          key={order.order_id}
                          value={order.order_id}
                        >
                          Order #{order.order_id} - ₹
                          {order.total_amount} - {order.status}
                        </option>

                      ))}

                    </select>

                  </div>

                </div>


                {/* Delivery Date */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Date
                  </label>

                  <div className="relative">

                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                    <input
                      type="date"
                      name="delivery_date"
                      value={formData.delivery_date}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                    />

                  </div>

                </div>


                {/* Status */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Out for Delivery">
                      Out for Delivery
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>


                {/* Notes */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes
                  </label>

                  <div className="relative">

                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                      placeholder="Optional delivery notes"
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
                  Save Delivery

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
          DELIVERY DIRECTORY
      ========================== */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <div className="flex items-center gap-2">

                <h3 className="text-lg font-bold text-gray-900">
                  Delivery Schedule
                </h3>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  {deliveries.length}
                </span>

              </div>

              <p className="text-sm text-gray-500 mt-1">
                Track delivery dates and update delivery progress.
              </p>

            </div>


            {/* Search */}

            <div className="relative w-full lg:w-80">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search deliveries..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
              />

            </div>

          </div>

        </div>


        {/* =========================
            DELIVERY TABLE
        ========================== */}

        {filteredDeliveries.length > 0 ? (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>

                <tr className="bg-gray-50 border-b border-gray-100">

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Delivery Date
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {filteredDeliveries.map(delivery => {

                  const statusStyle = getStatusStyle(delivery.status);
                  const StatusIcon = statusStyle.icon;

                  return (

                    <tr
                      key={delivery.delivery_id}
                      className="hover:bg-gray-50/70 transition"
                    >

                      {/* Delivery */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <Truck className="w-4 h-4" />
                          </div>

                          <div>

                            <p className="font-semibold text-gray-800">
                              Delivery #{delivery.delivery_id}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              Scheduled delivery
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Order */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">

                          <Package className="w-4 h-4 text-gray-400" />

                          Order #{delivery.order_id}

                        </div>

                      </td>


                      {/* Date */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <CalendarDays className="w-4 h-4 text-gray-400" />

                          {formatDate(delivery.delivery_date)}

                        </div>

                      </td>


                      {/* Status */}

                      <td className="px-6 py-4">

                        <div className="flex flex-col gap-2">

                          <span
                            className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${statusStyle.className}`}
                          >

                            <StatusIcon className="w-3.5 h-3.5" />

                            {delivery.status}

                          </span>

                          <select
                            value={delivery.status}
                            onChange={(event) =>
                              updateDeliveryStatus(
                                delivery.delivery_id,
                                event.target.value,
                                delivery
                              )
                            }
                            className="w-fit border border-gray-200 bg-white rounded-lg px-2.5 py-2 text-xs font-medium text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          >

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Out for Delivery">
                              Out for Delivery
                            </option>

                            <option value="Delivered">
                              Delivered
                            </option>

                            <option value="Cancelled">
                              Cancelled
                            </option>

                          </select>

                        </div>

                      </td>


                      {/* Notes */}

                      <td className="px-6 py-4">

                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {delivery.notes || '—'}
                        </p>

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
                <Truck className="w-7 h-7 text-emerald-500" />
              )}

            </div>

            <h4 className="text-lg font-bold text-gray-800">

              {searchTerm
                ? 'No deliveries found'
                : 'No deliveries yet'}

            </h4>

            <p className="text-sm text-gray-400 mt-1 max-w-sm">

              {searchTerm
                ? 'Try changing your search.'
                : 'Create your first delivery to start tracking order fulfilment.'}

            </p>

            {!searchTerm && (

              <button
                onClick={() => setShowForm(true)}
                className="mt-5 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
              >

                <Plus className="w-4 h-4" />

                Create Delivery

              </button>

            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Deliveries;