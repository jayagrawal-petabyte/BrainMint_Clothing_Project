import React, { useState, useEffect } from 'react';
import { Save, Truck, Link as LinkIcon, Megaphone, Loader2, Check } from 'lucide-react';
import { fetchSettings, updateSettings } from '../../services/api';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    shippingCost: 99,
    freeShippingThreshold: 2500,
    socialLinks: {
      instagram: 'https://instagram.com/',
      facebook: 'https://facebook.com/',
      twitter: 'https://twitter.com/'
    },
    enableAnnouncement: true,
    announcementText: 'Free shipping on all orders over ₹999!'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' or null

  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchSettings();
      if (data && data.success && data.data) {
        setSettings({
          shippingCost: data.data.shippingCost || 99,
          freeShippingThreshold: data.data.freeShippingThreshold || 2500,
          socialLinks: data.data.socialLinks || { instagram: '', facebook: '', twitter: '' },
          enableAnnouncement: data.data.enableAnnouncement ?? true,
          announcementText: data.data.announcementText || ''
        });
      }
      setIsLoading(false);
    };
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSaveStatus(null);
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
    setSaveStatus(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    
    const token = localStorage.getItem('adminToken');
    const res = await updateSettings(settings, token);
    
    if (res && res.success) {
      setSaveStatus('success');
      window.dispatchEvent(new CustomEvent('storeSettingsUpdated', { detail: settings }));
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      alert(res?.message || 'Failed to save settings');
    }
    
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={32} className="animate-spin text-admin-accent" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 font-rubik pb-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Store Settings</h1>
          <p className="text-admin-text dark:text-admin-text-dark mt-1">Configure global store details and preferences</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-admin-heading dark:bg-admin-heading-dark text-white dark:text-admin-bg px-6 py-2.5 rounded-lg font-medium hover:bg-admin-accent hover:text-white transition-colors flex items-center justify-center gap-2 min-w-[140px]"
        >
          {isSaving ? (
            <><Loader2 size={18} className="animate-spin" /> Saving...</>
          ) : saveStatus === 'success' ? (
            <><Check size={18} /> Saved!</>
          ) : (
            <><Save size={18} /> Save Changes</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Configuration Section */}
          <section className="bg-admin-card dark:bg-admin-card-dark rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark overflow-hidden">
            <div className="p-6 border-b border-admin-border dark:border-admin-border-dark bg-admin-bg/30 dark:bg-[#111]/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                <Truck size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-admin-heading dark:text-admin-heading-dark font-montserrat">Shipping Configuration</h2>
                <p className="text-sm text-admin-text dark:text-admin-text-dark">Manage delivery charges and free shipping thresholds</p>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-1.5">Standard Delivery Charge (₹)</label>
                  <input 
                    type="number" 
                    name="shippingCost"
                    value={settings.shippingCost}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-admin-bg dark:bg-[#222] border border-admin-border dark:border-[#444] focus:border-admin-heading dark:focus:border-admin-heading-dark rounded-lg outline-none text-admin-heading dark:text-admin-heading-dark transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-1.5">Free Delivery Threshold (₹)</label>
                  <input 
                    type="number" 
                    name="freeShippingThreshold"
                    value={settings.freeShippingThreshold}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-admin-bg dark:bg-[#222] border border-admin-border dark:border-[#444] focus:border-admin-heading dark:focus:border-admin-heading-dark rounded-lg outline-none text-admin-heading dark:text-admin-heading-dark transition-colors"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Announcement Banner Section */}
          <section className="bg-admin-card dark:bg-admin-card-dark rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark overflow-hidden">
            <div className="p-6 border-b border-admin-border dark:border-admin-border-dark bg-admin-bg/30 dark:bg-[#111]/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center">
                <Megaphone size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-admin-heading dark:text-admin-heading-dark font-montserrat">Announcement Banner</h2>
                <p className="text-sm text-admin-text dark:text-admin-text-dark">Displayed at the top of the store</p>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="enableAnnouncement"
                    checked={settings.enableAnnouncement}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-admin-heading dark:peer-checked:bg-admin-heading-dark"></div>
                </label>
                <span className="text-sm font-medium text-admin-heading dark:text-admin-heading-dark">
                  Enable Top Banner
                </span>
              </div>
              
              <div className={`transition-opacity duration-300 ${!settings.enableAnnouncement ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-1.5">Banner Text</label>
                <input 
                  type="text" 
                  name="announcementText"
                  value={settings.announcementText}
                  onChange={handleChange}
                  placeholder="e.g. Free shipping on all orders over ₹999!"
                  className="w-full px-4 py-2.5 bg-admin-bg dark:bg-[#222] border border-admin-border dark:border-[#444] focus:border-admin-heading dark:focus:border-admin-heading-dark rounded-lg outline-none text-admin-heading dark:text-admin-heading-dark transition-colors"
                />
                <p className="text-xs text-admin-text dark:text-admin-text-dark mt-2">
                  Keep this short and clear to draw customer attention.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Social Links Section */}
          <section className="bg-admin-card dark:bg-admin-card-dark rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark overflow-hidden">
            <div className="p-6 border-b border-admin-border dark:border-admin-border-dark bg-admin-bg/30 dark:bg-[#111]/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-pink-50 dark:bg-pink-900/20 text-pink-500 flex items-center justify-center">
                <LinkIcon size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-admin-heading dark:text-admin-heading-dark font-montserrat">Social Links</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-1.5">Instagram URL</label>
                <input 
                  type="url" 
                  name="instagram"
                  value={settings.socialLinks.instagram}
                  onChange={handleSocialChange}
                  className="w-full px-4 py-2 bg-admin-bg dark:bg-[#222] border border-admin-border dark:border-[#444] focus:border-admin-heading dark:focus:border-admin-heading-dark rounded-lg outline-none text-sm text-admin-heading dark:text-admin-heading-dark transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-1.5">Facebook URL</label>
                <input 
                  type="url" 
                  name="facebook"
                  value={settings.socialLinks.facebook}
                  onChange={handleSocialChange}
                  className="w-full px-4 py-2 bg-admin-bg dark:bg-[#222] border border-admin-border dark:border-[#444] focus:border-admin-heading dark:focus:border-admin-heading-dark rounded-lg outline-none text-sm text-admin-heading dark:text-admin-heading-dark transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-1.5">Twitter/X URL</label>
                <input 
                  type="url" 
                  name="twitter"
                  value={settings.socialLinks.twitter}
                  onChange={handleSocialChange}
                  className="w-full px-4 py-2 bg-admin-bg dark:bg-[#222] border border-admin-border dark:border-[#444] focus:border-admin-heading dark:focus:border-admin-heading-dark rounded-lg outline-none text-sm text-admin-heading dark:text-admin-heading-dark transition-colors"
                />
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
