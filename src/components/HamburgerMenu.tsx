import React, { useState, useEffect } from 'react';
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

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  // Debug logging
  useEffect(() => {
    console.log('Hamburger menu state:', isOpen);
    console.log('User role:', user?.role);
    console.log('User object:', user);
  }, [isOpen, user?.role, user]);

  let menuItems = [];
  
  // Define menu items based on user role
  if (user?.role === 'manager') {
    // Only show these items for managers
    menuItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <Home size={20} />,
        path: '/manager/dashboard'
      },
      {
        id: 'team-management',
        label: 'Team Budget Management',
        icon: <Users size={20} />,
        path: '/manager/team-management'
      },
      {
        id: 'expense-approvals',
        label: 'Expense Approvals',
        icon: <CreditCard size={20} />,
        path: '/manager/expense-approvals'
      },
      {
        id: 'reports',
        label: 'Reports & Charts',
        icon: <BarChart3 size={20} />,
        path: '/manager/reports'
      }
    ];
  } else {
    // Show these items for employees
    menuItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <Home size={20} />,
        path: '/employee/dashboard'
      },
      {
        id: 'flight-booking',
        label: 'Flight Booking',
        icon: <Plane size={20} />,
        path: '/employee/book-flight'
      },
      {
        id: 'hotel-booking',
        label: 'Hotel Booking',
        icon: <Hotel size={20} />,
        path: '/employee/book-hotel'
      },
      {
        id: 'pickup-booking',
        label: 'Airport Pickup',
        icon: <Car size={20} />,
        path: '/employee/book-pickup'
      },
      {
        id: 'expense-report',
        label: 'Expense Reporting',
        icon: <TrendingUp size={20} />,
        path: '/employee/expense-report'
      },
      {
        id: 'booking-history',
        label: 'Booking History',
        icon: <History size={20} />,
        path: '/employee/booking-history'
      }
    ];
  }

  const handleMenuClick = (path: string) => {
    console.log('Menu item clicked:', path);
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    dispatch(logout());
    navigate('/');
    setIsOpen(false);
  };

  const toggleMenu = () => {
    console.log('Toggle menu clicked, current state:', isOpen);
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    console.log('Closing menu');
    setIsOpen(false);
  };

  // Debug: Log menu items
  useEffect(() => {
    console.log('Menu items to render:', menuItems);
    console.log('Number of menu items:', menuItems.length);
  }, [menuItems]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="hamburger-button manager-hamburger"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="menu-overlay" 
          onClick={closeMenu}
        />
      )}

      {/* Menu Sidebar */}
      <div className={`hamburger-menu ${isOpen ? 'open' : ''} manager-menu`}>
        <div className="menu-header">
          <h3>Navigation</h3>
          <button
            onClick={closeMenu}
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
              <span className="menu-icon">
                {item.icon}
              </span>
              <span className="menu-label">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="menu-footer">
          <button 
            onClick={handleLogout} 
            className="logout-menu-item"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;