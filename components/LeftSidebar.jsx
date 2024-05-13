import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const SidebarItem = ({ icon, label, active, onClick }) => {
  return (
    <div className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
    </div>
  );
};

  const LeftSidebar = ({ activeItem, handleItemClick, handleLogout }) => {
    return (
      <div className="sidebar">
        <h1>BILL BUDDY</h1>
        <SidebarItem
          icon={<i className="fas fa-chart-line"></i>}
          label="Dashboard"
          active={activeItem === 'dashboard'}
          onClick={() => handleItemClick('/dashboard')}
        />
        <SidebarItem
          icon={<i className="fas fa-upload"></i>}
          label="Upload Invoice"
          active={activeItem === 'uploadInvoice'}
          onClick={() => handleItemClick('/upload-invoice')}
        />

        <SidebarItem
          icon={<i className="fas fa-file-alt"></i>}
          label="Invoices"
          active={activeItem === 'invoices'}
          onClick={() => handleItemClick('/invoices')}
        />

        <SidebarItem
          icon={<i className="fas fa-cogs"></i>}
          label="Settings"
          active={activeItem === 'settings'}
          onClick={() => handleItemClick('/settings')}
        />

        <SidebarItem
          icon={<i className="fas fa-sign-out-alt"></i>}
          label="Logout"
          onClick={handleLogout}
        />

      </div>
    );
  };
  
  export default LeftSidebar;
