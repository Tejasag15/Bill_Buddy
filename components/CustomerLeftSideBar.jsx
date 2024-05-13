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
          active={activeItem === 'customerdashboard'}
          onClick={() => handleItemClick('/customerdashboard')}
        />
        

        <SidebarItem
          icon={<i className="fas fa-file-alt"></i>}
          label="Invoices"
          active={activeItem === 'invoicedashboard'}
          onClick={() => handleItemClick('/invoicedashboard')}
        />
        <SidebarItem
           icon={<i className="fas fa-question"></i>}
           label="Help"
           active={activeItem === 'help'}
           onClick={() => handleItemClick('/help')}
        />

        <SidebarItem
          icon={<i className="fas fa-cogs"></i>}
          label="Settings"
          active={activeItem === 'settings'}
          onClick={() => handleItemClick('/customer-settings')}
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
