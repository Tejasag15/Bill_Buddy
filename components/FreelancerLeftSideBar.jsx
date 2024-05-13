import React from 'react';
import { Link } from 'react-router-dom';

const FreelancerLeftSideBar = ({ activeItem, handleItemClick, handleLogout }) => {
  return (
    <div className="sidebar">
      <h1>BILL BUDDY</h1>
      <SidebarItem
        icon={<i className="fas fa-chart-line"></i>}
        label="Dashboard"
        active={activeItem === 'dashboard'}
        onClick={() => handleItemClick('/freelancerdashboard')}
      />
      <SidebarItem
        icon={<i className="fas fa-file-alt"></i>}
        label="Create Invoice"
        active={activeItem === 'createInvoice'}
        onClick={() => handleItemClick('/create-invoice')}
      />
      <SidebarItem
        icon={<i className="fas fa-eye"></i>}
        label="View Invoice"
        active={activeItem === 'viewInvoice'}
        onClick={() => handleItemClick('/view-invoice')}
      />
      <SidebarItem
        icon={<i className="fas fa-cogs"></i>}
        label="Help"
        active={activeItem === 'help'}
        onClick={() => handleItemClick('/freelancer-help')}
      />
      <SidebarItem
        icon={<i className="fas fa-sign-out-alt"></i>}
        label="Logout"
        onClick={handleLogout}
      />
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => {
  return (
    <div className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
    </div>
  );
};

export default FreelancerLeftSideBar;
