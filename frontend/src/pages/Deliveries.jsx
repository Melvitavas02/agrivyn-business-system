import { useEffect, useState } from 'react';

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [orders, setOrders] = useState([]);

  const [showForm, setShowForm] = useState(false);

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

  // Update delivery status
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

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Deliveries
          </h2>

          <p className="text-gray-500 mt-1">
            Manage order deliveries
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800"
        >
          + Create Delivery
        </button>

      </div>


      {/* Create Delivery Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <h3 className="text-xl font-semibold text-gray-800 mb-5">
            Create Delivery
          </h3>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

             

              {/* Order */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Order
  </label>

  <select
    name="order_id"
    value={formData.order_id}
    onChange={handleChange}
    required
    className="w-full border border-gray-300 rounded-lg px-3 py-2"
  >
    <option value="">
      Select Order
    </option>

    {orders.map(order => (
      <option
        key={order.order_id}
        value={order.order_id}
      >
        Order #{order.order_id} - ₹{order.total_amount} - {order.status}
      </option>
    ))}
  </select>
</div>
              </div>


              {/* Delivery Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date
                </label>

                <input
                  type="date"
                  name="delivery_date"
                  value={formData.delivery_date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>


              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
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
                Save Delivery
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


      {/* Deliveries Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Delivery ID
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Order ID
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Delivery Date
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Status
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Notes
              </th>

            </tr>

          </thead>


          <tbody>

            {deliveries.map(delivery => (

              <tr
                key={delivery.delivery_id}
                className="border-t"
              >

                <td className="px-6 py-4">
                  {delivery.delivery_id}
                </td>

                <td className="px-6 py-4 font-medium">
                  #{delivery.order_id}
                </td>

                <td className="px-6 py-4">
                  {delivery.delivery_date}
                </td>

                <td className="px-6 py-4">

                  <select
                    value={delivery.status}
                    onChange={(event) =>
                      updateDeliveryStatus(
                        delivery.delivery_id,
                        event.target.value,
                        delivery
                      )
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
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

                </td>

                <td className="px-6 py-4">
                  {delivery.notes || '-'}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Deliveries;