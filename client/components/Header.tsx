import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const destinations = ['Kerala', 'Tamil Nadu', 'Karnataka', 'Puducherry', 'Rajasthan', 'Goa', 'Himachal Pradesh', 'West Bengal', 'Uttarakhand'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.hash = `#/explore?q=${searchQuery}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
              <path d="M14.288 8.339l-4.14 4.14-1.358-1.358a1 1 0 00-1.414 1.414l2.065 2.065a1 1 0 001.414 0L15.702 9.753a1 1 0 10-1.414-1.414z" />
            </svg>
            <span>TravelX</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={({isActive}) => `text-gray-600 hover:text-primary transition-colors ${isActive ? 'text-primary font-semibold' : ''}`}>Home</NavLink>
            <NavLink to="/explore" className={({isActive}) => `text-gray-600 hover:text-primary transition-colors ${isActive ? 'text-primary font-semibold' : ''}`}>Explore</NavLink>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-gray-600 hover:text-primary transition-colors flex items-center"
              >
                Destinations
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  {destinations.map((dest) => (
                    <Link
                      key={dest}
                      to={`/explore?state=${dest}`}
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {dest}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {user && (
              <>
                <NavLink to="/wishlist" className={({isActive}) => `text-gray-600 hover:text-primary transition-colors ${isActive ? 'text-primary font-semibold' : ''}`}>Wishlist</NavLink>
                <NavLink to="/my-bookings" className={({isActive}) => `text-gray-600 hover:text-primary transition-colors ${isActive ? 'text-primary font-semibold' : ''}`}>My Bookings</NavLink>
              </>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={({isActive}) => `text-gray-600 hover:text-primary transition-colors ${isActive ? 'text-primary font-semibold' : ''}`}>Admin</NavLink>
            )}
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Search tours..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-dark/50" 
              />
              <button type="submit" className="absolute right-0 top-0 mt-1 mr-1 bg-primary text-white rounded-full p-2 hover:bg-primary-dark">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </form>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile" className="font-semibold text-gray-700">{user.name}</Link>
                <button onClick={logout} className="px-4 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors">Logout</button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors">Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;