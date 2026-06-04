import React, { useState } from 'react';
import { Eye, Edit2, Check, X } from 'lucide-react';
import { getColorName } from '../../../utils/helpers';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;
  const original = order._original || {};
  const shipping = original.shippingAddress || {};
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-admin-card-dark rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-admin-border-dark">
          <h2 className="text-xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">
            Order Details
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 font-rubik space-y-6 text-sm text-admin-text dark:text-admin-text-dark">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-admin-heading dark:text-admin-heading-dark mb-1">Order ID</p>
              <p>{order.id}</p>
            </div>
            <div>
              <p className="font-semibold text-admin-heading dark:text-admin-heading-dark mb-1">Date</p>
              <p>{order.date}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-admin-heading dark:text-admin-heading-dark mb-2">Customer & Contact</p>
              <p>{shipping.fullName || order.customer}</p>
              <p>{order.email}</p>
              <p>{shipping.phone}</p>
            </div>
            <div>
              <p className="font-semibold text-admin-heading dark:text-admin-heading-dark mb-2">Shipping Address</p>
              <p>{shipping.address}</p>
              <p>{shipping.city}, {shipping.state} {shipping.pincode}</p>
            </div>
          </div>
          
          <div>
            <p className="font-semibold text-admin-heading dark:text-admin-heading-dark mb-3">Items Ordered</p>
            <div className="border border-gray-100 dark:border-admin-border-dark rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-[#222]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium text-center">Qty</th>
                    <th className="px-4 py-3 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-admin-border-dark">
                  {(original.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 flex items-center space-x-3">
                        <img 
                          src={item.product?.images?.[0]?.url || 'https://placehold.co/100x100?text=No+Image'} 
                          alt="product" 
                          className="w-10 h-10 object-cover rounded bg-gray-100"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{item.product?.name || 'Unknown Product'}</span>
                          {item.size && item.color && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {item.size} / {item.color.startsWith('#') ? getColorName(item.color) : item.color}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">₹{(item.price || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-admin-border-dark">
            <span className="font-semibold text-admin-heading dark:text-admin-heading-dark">Total Amount</span>
            <span className="text-xl font-bold text-admin-accent">{order.amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderTable = ({ orders, statusFilter, onUpdateStatus }) => {
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [viewOrderId, setViewOrderId] = useState(null);
  const filteredOrders = statusFilter === 'All' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  return (
    <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark overflow-hidden font-rubik">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-admin-bg dark:bg-[#222] text-admin-text dark:text-admin-text-dark text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Total Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border dark:divide-admin-border-dark">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-admin-bg/50 dark:hover:bg-[#222]/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-admin-heading dark:text-admin-heading-dark">{order.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-admin-heading dark:text-admin-heading-dark">{order.customer}</div>
                  <div className="text-xs text-admin-text dark:text-admin-text-dark">{order.email}</div>
                </td>
                <td className="px-6 py-4 text-admin-text dark:text-admin-text-dark">{order.date}</td>
                <td className="px-6 py-4 font-semibold text-admin-heading dark:text-admin-heading-dark">{order.amount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                    ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : ''}
                    ${order.status === 'Confirmed' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : ''}
                    ${order.status === 'Shipped' ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' : ''}
                    ${order.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' : ''}
                    ${order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800' : ''}
                  `}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                  <button 
                    onClick={() => setViewOrderId(order.id)}
                    className="text-admin-text hover:text-blue-500 dark:text-admin-text-dark dark:hover:text-blue-400 transition-colors inline-block" 
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  
                  {editingId === order.id ? (
                    <div className="inline-flex items-center space-x-1 bg-white dark:bg-[#333] p-1 rounded border border-gray-200 dark:border-gray-700">
                      <select 
                        value={editStatus} 
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="text-xs bg-transparent outline-none text-admin-heading dark:text-admin-heading-dark"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button 
                        onClick={() => {
                          if (onUpdateStatus && editStatus !== order.status) {
                            onUpdateStatus(order.id, editStatus);
                          }
                          setEditingId(null);
                        }}
                        className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 p-1 rounded"
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setEditingId(order.id);
                        setEditStatus(order.status);
                      }}
                      className="text-admin-text hover:text-emerald-500 dark:text-admin-text-dark dark:hover:text-emerald-400 transition-colors inline-block" 
                      title="Update Status"
                    >
                      <Edit2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-admin-text dark:text-admin-text-dark">
                  No orders found for the selected status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewOrderId && (
        <OrderDetailsModal 
          order={orders.find(o => o.id === viewOrderId)} 
          onClose={() => setViewOrderId(null)} 
        />
      )}
    </div>
  );
};

export default OrderTable;
