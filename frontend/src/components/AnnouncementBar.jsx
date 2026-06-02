
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  return (
    <div className="announcement-bar">
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <p style={{ color: 'white', margin: 0, fontWeight: 500, textAlign: 'center', width: '100%' }}>Free Shipping over ₹1,999</p>
      </div>
    </div>
  );
};

export default AnnouncementBar;
