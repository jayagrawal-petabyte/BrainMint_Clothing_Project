import React, { useState } from 'react';
import { Eye, Edit2, Check, X } from 'lucide-react';

const OrderTable = ({ orders, statusFilter, onUpdateStatus }) => {
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
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
                    ${order.status === 'Processing' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : ''}
                    ${order.status === 'Shipped' ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' : ''}
                    ${order.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' : ''}
                    ${order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800' : ''}
                  `}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                  <button className="text-admin-text hover:text-blue-500 dark:text-admin-text-dark dark:hover:text-blue-400 transition-colors inline-block" title="View Details">
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
                        <option value="Processing">Processing</option>
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
    </div>
  );
};

export default OrderTable;
