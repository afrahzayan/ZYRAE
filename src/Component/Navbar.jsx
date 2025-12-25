import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';

// Icons
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

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// Badge Component
const Badge = ({ count, className = "" }) => {
  if (!count || count <= 0) return null;
  
  return (
    <span className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] text-xs font-bold text-black bg-red-100 rounded-full ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { user } = useAuth();
  const { cartItems, getTotalItems } = useCart();
  const { wishlistItems } = useWishlist();
  
  // Count items
  const cartItemCount = getTotalItems();
  const wishlistItemCount = wishlistItems.length;
  
  // Categories
  const categories = [
    { name: 'Floral Perfumes', href: '/collections/floral' },
    { name: 'Woody Scents', href: '/collections/woody' },
    { name: 'Citrus Fragrances', href: '/collections/citrus' },
    { name: 'Oriental Blends', href: '/collections/oriental' }
  ];

  const navLinks = [
    { name: 'Home', href: '/', id: 'home' },
    { name: 'Products', href: '/products', id: 'products' },
    { name: 'Collections', href: '#', id: 'categories', hasDropdown: true },
    { name: 'Philosophy', href: '/philosophy', id: 'philosophy' },
  ];

  const iconItems = [
    { 
      name: 'profile', 
      icon: ProfileIcon, 
      label: user ? `Hi, ${user.fname}` : 'Login',
      mobileLabel: 'Profile',
      href: user ? '/profile' : '/login',
      badgeCount: 0
    },
    { 
      name: 'wishlist', 
      icon: WishlistIcon, 
      label: 'Wishlist',
      mobileLabel: 'Wishlist',
      href: '/wishlist',
      badgeCount: wishlistItemCount
    },
    { 
      name: 'cart', 
      icon: CartIcon, 
      label: 'Shopping Cart',
      mobileLabel: 'Cart',
      href: '/cart',
      badgeCount: cartItemCount
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeCategories = () => {
    setIsCategoriesOpen(false);
  };

  return (
    <nav className="bg-[#A79277] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold text-[#FFF2E1] hover:text-[#EAD8C0] transition-colors duration-300 tracking-wide"
            >
              Zyraé
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                link.hasDropdown ? (
                  // Categories Dropdown
                  <div 
                    key={link.id}
                    className="relative"
                    onMouseEnter={() => setIsCategoriesOpen(true)}
                    onMouseLeave={() => setIsCategoriesOpen(false)}
                  >
                    <button
                      className="text-[#FFF2E1] hover:text-[#EAD8C0] px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center group"
                    >
                      {link.name}
                      <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                        isCategoriesOpen ? 'rotate-180' : ''
                      }`} />
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#EAD8C0] transition-all duration-300 group-hover:w-full"></span>
                    </button>

                    {/* Dropdown Menu */}
                    {isCategoriesOpen && (
                      <div className="absolute top-full left-0 mt-1 w-56 rounded-lg shadow-lg z-50">
                        <div className="rounded-md shadow-xs bg-[#FFF2E1] border border-[#D1BB9E] overflow-hidden">
                          <div className="py-1">
                            {categories.map((category, index) => (
                              <Link
                                key={category.name}
                                to={category.href}
                                className="flex items-center px-4 py-3 text-sm transition-all duration-200 hover:bg-[#F5E6D3] group/category"
                                onClick={closeCategories}
                              >
                                <span className="flex-1 font-medium" style={{ color: '#5A4638' }}>
                                  {category.name}
                                </span>
                                <span className="text-xs opacity-0 group-hover/category:opacity-100 transition-opacity duration-200" style={{ color: '#A79277' }}>
                                  →
                                </span>
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-[#D1BB9E] px-4 py-3 bg-[#FFF9F0]">
                            <p className="text-xs" style={{ color: '#8B7355' }}>
                              Discover our curated collection of premium fragrances
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular Links
                  <Link
                    key={link.id}
                    to={link.href}
                    className="text-[#FFF2E1] hover:text-[#EAD8C0] px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 relative group"
                    onClick={closeMenu}
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#EAD8C0] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-2">
            {iconItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="relative text-[#FFF2E1] hover:text-[#EAD8C0] p-2 rounded-md transition-all duration-300 hover:bg-[#8B7355] group"
                aria-label={item.label}
              >
                <item.icon className="w-5 h-5" />
                
                {item.badgeCount > 0 && (
                  <Badge count={item.badgeCount} />
                )}
                
                <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-[#8B7355] text-[#FFF2E1] px-2 py-1 rounded text-xs whitespace-nowrap z-50">
                  {item.label}
                </div>
              </Link>
            ))}
            
            {/* Orders Link for Desktop - Only show if user is logged in */}
            {user && (
              <Link
                to="/orders"
                className="relative text-[#FFF2E1] hover:text-[#EAD8C0] p-2 rounded-md transition-all duration-300 hover:bg-[#8B7355] group"
                aria-label="My Orders"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                
                <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-[#8B7355] text-[#FFF2E1] px-2 py-1 rounded text-xs whitespace-nowrap z-50">
                  My Orders
                </div>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-1">
            
            {/* Mobile Icons */}
            {iconItems.slice(1).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="relative text-[#FFF2E1] hover:text-[#EAD8C0] p-2 transition-colors duration-300"
                aria-label={item.mobileLabel}
              >
                <item.icon className="w-5 h-5" />
                
                {item.badgeCount > 0 && (
                  <Badge count={item.badgeCount} className="-top-0.5 -right-0.5" />
                )}
              </Link>
            ))}
            
            {/* Mobile Menu Button */}
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
            
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              link.hasDropdown ? (
                // Mobile Categories Dropdown
                <div key={link.id} className="space-y-1">
                  <button
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="flex items-center justify-between w-full text-[#FFF2E1] hover:text-[#EAD8C0] hover:bg-[#A79277] px-4 py-3 rounded-md text-base font-medium transition-all duration-300"
                  >
                    <span>{link.name}</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${
                      isCategoriesOpen ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {/* Mobile Categories Submenu */}
                  {isCategoriesOpen && (
                    <div className="ml-4 space-y-1">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          to={category.href}
                          className="flex items-center text-[#FFF2E1] hover:text-[#EAD8C0] hover:bg-[#A79277] px-4 py-3 rounded-md text-sm font-medium transition-all duration-300"
                          onClick={() => {
                            closeMenu();
                            closeCategories();
                          }}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.id}
                  to={link.href}
                  className="flex items-center text-[#FFF2E1] hover:text-[#EAD8C0] hover:bg-[#A79277] px-4 py-3 rounded-md text-base font-medium transition-all duration-300"
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              )
            ))}
            
            {/* Profile Link */}
            <Link
              to={user ? '/profile' : '/login'}
              className="flex items-center w-full text-[#FFF2E1] hover:text-[#EAD8C0] hover:bg-[#A79277] px-4 py-3 rounded-md text-base font-medium transition-all duration-300"
              onClick={closeMenu}
            >
              <ProfileIcon className="w-5 h-5 mr-3" />
              {user ? `Hi, ${user.fname}` : 'Login'}
            </Link>

            {/* Orders Link - Only show if user is logged in */}
            {user && (
              <Link
                to="/orders"
                className="flex items-center w-full text-[#FFF2E1] hover:text-[#EAD8C0] hover:bg-[#A79277] px-4 py-3 rounded-md text-base font-medium transition-all duration-300"
                onClick={closeMenu}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Orders
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;