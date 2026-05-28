import React from 'react';
import { X } from 'lucide-react';
import './SizeGuideModal.css';

const SIZE_DATA = [
  { size: 'XS', chest: '76–81',  waist: '61–66',  hip: '84–89'  },
  { size: 'S',  chest: '84–89',  waist: '69–74',  hip: '91–97'  },
  { size: 'M',  chest: '91–97',  waist: '76–81',  hip: '99–104' },
  { size: 'L',  chest: '99–104', waist: '84–89',  hip: '107–112'},
  { size: 'XL', chest: '107–112',waist: '91–97',  hip: '114–119'},
];

const SizeGuideModal = ({ onClose }) => {
  return (
    <div className="size-modal-backdrop" onClick={onClose}>
      <div className="size-modal" onClick={e => e.stopPropagation()}>
        <div className="size-modal-header">
          <h3>Size Guide</h3>
          <button className="size-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <p className="size-modal-note">All measurements are in centimetres (cm).</p>
        <div className="size-modal-table-wrap">
          <table className="size-guide-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest</th>
                <th>Waist</th>
                <th>Hip</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_DATA.map(row => (
                <tr key={row.size}>
                  <td>{row.size}</td>
                  <td>{row.chest}</td>
                  <td>{row.waist}</td>
                  <td>{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="size-modal-tip">
          <strong>Tip:</strong> If you are between sizes, we recommend sizing up for a more comfortable fit.
        </p>
      </div>
    </div>
  );
};

export default SizeGuideModal;
