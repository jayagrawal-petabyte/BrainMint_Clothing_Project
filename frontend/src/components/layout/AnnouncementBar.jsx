import { useState, useEffect } from 'react';
import { fetchSettings } from '../../services/api';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  const [text, setText] = useState('Free Shipping over ₹2,500');
  const [enabled, setEnabled] = useState(true);

  const loadSettings = async () => {
    const res = await fetchSettings();
    if (res && res.success && res.data) {
      setEnabled(res.data.enableAnnouncement ?? true);
      if (res.data.announcementText) {
        setText(res.data.announcementText);
      }
    }
  };

  useEffect(() => {
    loadSettings();

    // Listen for live updates dispatched by AdminSettings after saving
    const handleUpdate = (e) => {
      if (e.detail) {
        setEnabled(e.detail.enableAnnouncement ?? true);
        if (e.detail.announcementText) setText(e.detail.announcementText);
      }
    };
    window.addEventListener('storeSettingsUpdated', handleUpdate);
    return () => window.removeEventListener('storeSettingsUpdated', handleUpdate);
  }, []);

  if (!enabled) return null;

  return (
    <div className="announcement-bar">
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <p style={{ color: 'white', margin: 0, fontWeight: 500, textAlign: 'center', width: '100%' }}>{text}</p>
      </div>
    </div>
  );
};

export default AnnouncementBar;
