import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, Calendar, User, AlignLeft } from 'lucide-react';
import { fetchContactMessages } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ContactMessages = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMessages();
  }, [token]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetchContactMessages(token);
      if (res && res.success) {
        setMessages(res.data || []);
        setError(null);
      } else {
        setError('Failed to fetch messages.');
      }
    } catch (err) {
      setError('An error occurred while fetching messages.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark flex items-center gap-2">
            <Mail className="text-admin-accent" size={28} />
            Contact Messages
          </h1>
          <p className="text-admin-text dark:text-admin-text-dark font-rubik mt-1">
            View messages submitted by users through the Contact Us form.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-admin-accent" />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl p-12 text-center border border-admin-border dark:border-admin-border-dark shadow-sm">
          <Mail className="w-12 h-12 text-admin-text/50 mx-auto mb-4" />
          <h3 className="text-lg font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark mb-2">No Messages</h3>
          <p className="text-admin-text dark:text-admin-text-dark font-rubik">
            Your inbox is empty. New contact messages will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4 font-rubik">
          {messages.map((msg, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={msg._id}
              className="bg-admin-card dark:bg-admin-card-dark rounded-2xl p-6 shadow-sm border border-admin-border dark:border-admin-border-dark hover:border-admin-accent/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-admin-heading dark:text-admin-heading-dark flex items-center gap-2">
                    <AlignLeft size={18} className="text-admin-accent" />
                    {msg.subject || 'No Subject'}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-admin-text dark:text-admin-text-dark">
                    <span className="flex items-center gap-1.5 font-medium">
                      <User size={14} />
                      {msg.name} ({msg.email})
                    </span>
                  </div>
                </div>
                <div className="text-sm font-medium text-admin-text dark:text-admin-text-dark bg-admin-bg dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-admin-border dark:border-[#444] whitespace-nowrap">
                  <Calendar size={14} />
                  {formatDate(msg.createdAt)}
                </div>
              </div>
              <div className="bg-admin-bg dark:bg-[#1A1A1A] p-4 rounded-xl text-admin-heading dark:text-admin-heading-dark text-sm leading-relaxed border border-admin-border dark:border-[#444] whitespace-pre-wrap">
                {msg.message}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
