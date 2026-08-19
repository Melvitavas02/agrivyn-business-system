import { useEffect, useState } from 'react';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const updatedItems = items.filter((_, itemIndex) => itemIndex !== index);

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

  return (
    <div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Orders
          </h2>

          <p className="text-gray-500 mt-1">
            Manage customer orders
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto bg-green-700 text-white px-5 py-3 rounded-lg hover:bg-green-800"
        >
          + Create Order
        </button>

      </div>


      {/* Create Order Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6">

          <h3 className="text-xl font-semibold text-gray-800 mb-5">
            Create New Order
          </h3>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Customer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>

                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-3"
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


              {/* Order Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Date
                </label>

                <input
                  type="date"
                  name="order_date"
                  value={formData.order_date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>


              {/* Order Items */}

<div className="md:col-span-2">

  <h4 className="text-lg font-semibold text-gray-800 mb-4">
    Order Items
  </h4>

  {items.map((item, index) => {

    const selectedProduct = products.find(
      product => product.product_id === Number(item.product_id)
    );

    const itemTotal = selectedProduct && item.quantity
      ? Number(item.quantity) * Number(selectedProduct.price)
      : 0;

    return (
      <div
        key={index}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end"
      >

        {/* Product */}
        <div className="md:col-span-2">

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product
          </label>

          <select
            name="product_id"
            value={item.product_id}
            onChange={(event) => handleItemChange(index, event)}
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
                {product.product_name} - ₹{product.price}/{product.unit}
              </option>
            ))}

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
            value={item.quantity}
            onChange={(event) => handleItemChange(index, event)}
            min="1"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Quantity"
          />

        </div>


        {/* Item Total */}
        <div>

          <p className="text-sm text-gray-500">
            Item Total
          </p>

          <p className="font-semibold text-gray-800">
            ₹{itemTotal.toFixed(2)}
          </p>

          {items.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-600 text-sm mt-1"
            >
              Remove
            </button>
          )}

        </div>


      </div>
    );
  })}


  {/* Add Product */}
  <button
    type="button"
    onClick={addItem}
    className="text-green-700 font-medium mt-2"
  >
    + Add Another Product
  </button>

</div>

            {/* Total */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6">

              <p className="text-gray-500 text-sm">
                Estimated Total
              </p>

              <p className="text-2xl font-bold text-gray-800 mt-1">
                ₹{totalAmount.toFixed(2)}
              </p>

            </div>


            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">

              <button
                type="submit"
               className="w-full sm:w-auto bg-green-700 text-white px-5 py-3 rounded-lg hover:bg-green-800"
              >
                Create Order
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
               className="w-full sm:w-auto bg-gray-200 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

            </div>
          </div>

          </form>

        </div>
      )}


      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

  <div className="overflow-x-auto">

    <table className="w-full min-w-[800px]">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Order ID
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Customer ID
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Order Date
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Status
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Total Amount
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
  Actions
</th>

            </tr>

          </thead>


          <tbody>

            {orders.map(order => (
              <tr
                key={order.order_id}
                className="border-t"
              >

                <td className="px-6 py-4">
                  {order.order_id}
                </td>

                <td className="px-6 py-4">
                  {order.customer_id}
                </td>

                <td className="px-6 py-4">
                  {order.order_date}
                </td>

               <td className="px-6 py-4">

  <select
    value={order.status}
    onChange={(event) =>
      updateOrderStatus(order.order_id, event.target.value)
    }
    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
  >
    <option value="Pending">Pending</option>
    <option value="Confirmed">Confirmed</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
  </select>

</td>

                <td className="px-6 py-4 font-medium">
                  ₹{order.total_amount}
                </td>
                <td className="px-6 py-4">
  <button
    onClick={() => fetchOrderDetails(order.order_id)}
    className="text-blue-600 hover:text-blue-800 font-medium"
  >
    View Details
  </button>
</td>

              </tr>
            ))}

          </tbody>

                </table>

      </div>

    </div>
            


      {/* Order Details */}
      {selectedOrder && (
        <div className="bg-white rounded-xl shadow p-6 mt-6">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Order #{selectedOrder.order.order_id}
              </h3>

              <p className="text-gray-500 mt-1">
                Order Details
              </p>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>

          </div>


          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

            <div className="bg-gray-50 rounded-lg p-4">

              <p className="text-sm text-gray-500">
                Customer
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {selectedOrder.order.customer_name}
              </p>

              <p className="text-gray-600 mt-1">
                {selectedOrder.order.customer_phone}
              </p>

            </div>


            <div className="bg-gray-50 rounded-lg p-4">

              <p className="text-sm text-gray-500">
                Order Status
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {selectedOrder.order.status}
              </p>

              <p className="text-gray-600 mt-1">
                {selectedOrder.order.order_date}
              </p>

            </div>

          </div>


          {/* Products */}
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            Products
          </h4>

         <div className="overflow-hidden border rounded-lg">

  <div className="overflow-x-auto">

    <table className="w-full min-w-[600px]">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                    Product
                  </th>

                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                    Quantity
                  </th>

                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                    Unit Price
                  </th>

                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                    Total
                  </th>

                </tr>

              </thead>

              <tbody>

                {selectedOrder.items.map(item => (

                  <tr
                    key={item.order_item_id}
                    className="border-t"
                  >

                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.product_name}
                    </td>

                    <td className="px-4 py-3">
                      {item.quantity} {item.unit}
                    </td>

                    <td className="px-4 py-3">
                      ₹{item.unit_price}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      ₹{item.item_total}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
          </div>


          {/* Grand Total */}
          <div className="flex justify-end mt-6">

            <div className="text-right">

              <p className="text-gray-500">
                Grand Total
              </p>

              <p className="text-2xl font-bold text-gray-800">
                ₹{selectedOrder.order.total_amount}
              </p>

            </div>

          </div>

        </div>
      )}


    </div>
  );
}

export default Orders;

    