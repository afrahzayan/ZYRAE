// Navbar.jsx
import React, { useState } from 'react';

// Professional SVG Icons
const ProfileIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const WishlistIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#', id: 'home' },
    { name: 'Products', href: '#', id: 'products' },
    { name: 'Categories', href: '#', id: 'categories' },
    { name: 'Philosophy', href: '#', id: 'philosophy' },
  ];

  const iconItems = [
    { 
      name: 'profile', 
      icon: ProfileIcon, 
      label: 'User Profile',
      mobileLabel: 'Profile'
    },
    { 
      name: 'cart', 
      icon: CartIcon, 
      label: 'Shopping Cart',
      mobileLabel: 'Cart',
      badge: 3 // Example badge count
    },
    { 
      name: 'wishlist', 
      icon: WishlistIcon, 
      label: 'Wishlist',
      mobileLabel: 'Wishlist',
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-[#A79277] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Name - Left */}
          <div className="flex-shrink-0">
            <a 
              href="#" 
              className="text-2xl font-bold text-[#FFF2E1] hover:text-[#EAD8C0] transition-colors duration-300 tracking-wide"
            >
              Zyraé
            </a>
          </div>

          {/* Navigation Links - Center (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="text-[#FFF2E1] hover:text-[#EAD8C0] px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#EAD8C0] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Icons - Right (Desktop) */}
          <div className="hidden md:flex items-center space-x-2">
            {iconItems.map((item) => (
              <button
                key={item.name}
                className="relative text-[#FFF2E1] hover:text-[#EAD8C0] p-2 rounded-md transition-all duration-300 hover:bg-[#8B7355] group"
                aria-label={item.label}
              >
                <item.icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-[#5A4638] text-[#FFF2E1] text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                )}
                {/* Tooltip */}
                <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-[#8B7355] text-[#FFF2E1] px-2 py-1 rounded text-xs whitespace-nowrap">
                  {item.label}
                </div>
              </button>
            ))}
          </div>

          {/* Mobile menu button and icons */}
          <div className="md:hidden flex items-center space-x-1">
            {/* Mobile Icons - Only cart and wishlist visible */}
            {iconItems.slice(1).map((item) => (
              <button
                key={item.name}
                className="relative text-[#FFF2E1] hover:text-[#EAD8C0] p-2 transition-colors duration-300"
                aria-label={item.mobileLabel}
              >
                <item.icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-[#5A4638] text-[#FFF2E1] text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="text-[#FFF2E1] hover:text-[#EAD8C0] p-2 rounded-md transition-colors duration-300"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <div className="w-6 h-6 flex flex-col justify-between transition-transform duration-300">
                <span 
                  className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-2.5' : ''
                  }`}
                />
                <span 
                  className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span 
                  className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-96 opacity-100 visible' 
              : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="px-2 pt-2 pb-4 space-y-2 bg-[#8B7355] rounded-lg mt-2 border border-[#D1BB9E]">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="flex items-center text-[#FFF2E1] hover:text-[#EAD8C0] hover:bg-[#A79277] px-4 py-3 rounded-md text-base font-medium transition-all duration-300"
                onClick={closeMenu}
              >
                {link.name}
              </a>
            ))}
            
            {/* Mobile Profile Link */}
            <button
              className="flex items-center w-full text-[#FFF2E1] hover:text-[#EAD8C0] hover:bg-[#A79277] px-4 py-3 rounded-md text-base font-medium transition-all duration-300 text-left"
              onClick={closeMenu}
            >
              <ProfileIcon className="w-5 h-5 mr-3" />
              Profile
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;