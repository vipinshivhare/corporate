import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { 
  Menu, 
  X, 
  Home, 
  Plane, 
  Hotel, 
  Car, 
  TrendingUp, 
  History, 
  Users, 
  CreditCard, 
  BarChart3,
  LogOut
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  role: 'employee' | 'manager' | 'both';
}

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const employeeMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home size={20} />,
      path: '/employee/dashboard',
      role: 'employee'
    },
    {
      id: 'flight-booking',
      label: 'Flight Booking',
      icon: <Plane size={20} />,
      path: '/employee/book-flight',
      role: 'employee'
    },
    {
      id: 'hotel-booking',
      label: 'Hotel Booking',
      icon: <Hotel size={20} />,
      path: '/employee/book-hotel',
      role: 'employee'
    },
    {
      id: 'pickup-booking',
      label: 'Airport Pickup',
      icon: <Car size={20} />,
      path: '/employee/book-pickup',
      role: 'employee'
    },
    {
      id: 'expense-report',
      label: 'Expense Reporting',
      icon: <TrendingUp size={20} />,
      path: '/employee/expense-report',
      role: 'employee'
    },
    {
      id: 'booking-history',
      label: 'Booking History',
      icon: <History size={20} />,
      path: '/employee/booking-history',
      role: 'employee'
    }
  ];

  const managerMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home size={20} />,
      path: '/manager/dashboard',
      role: 'manager'
    },
    {
      id: 'team-management',
      label: 'Team Budget Management',
      icon: <Users size={20} />,
      path: '/manager/team-management',
      role: 'manager'
    },
    {
      id: 'expense-approvals',
      label: 'Expense Approvals',
      icon: <CreditCard size={20} />,
      path: '/manager/expense-approvals',
      role: 'manager'
    },
    {
      id: 'reports',
      label: 'Reports & Charts',
      icon: <BarChart3 size={20} />,
      path: '/manager/reports',
      role: 'manager'
    }
  ];

  const menuItems = user?.role === 'manager' ? managerMenuItems : employeeMenuItems;

  const handleMenuClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsOpen(false);
  };

  return (
    <>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hamburger-button"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        )}


      {/* Overlay */}
      {isOpen && (
        <div className="menu-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* Menu Sidebar */}
      <div className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h3>Navigation</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="close-button"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="menu-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.path)}
              className="menu-item"
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="menu-footer">
          <button onClick={handleLogout} className="logout-menu-item">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu; 