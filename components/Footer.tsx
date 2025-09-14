
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const destinations = ['Kerala', 'Rajasthan', 'Goa', 'Himachal Pradesh', 'Uttarakhand', 'West Bengal'];

  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 text-2xl font-bold text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                <path d="M14.288 8.339l-4.14 4.14-1.358-1.358a1 1 0 00-1.414 1.414l2.065 2.065a1 1 0 001.414 0L15.702 9.753a1 1 0 10-1.414-1.414z" />
              </svg>
              <span>TravelX</span>
            </div>
            <p className="text-gray-500 max-w-sm">Explore unique destinations around the world with TravelX, your trusted partner in creating unforgettable travel experiences.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Destinations</h3>
            <ul className="space-y-2">
              {destinations.map(dest => (
                <li key={dest}>
                  <Link to={`/explore?state=${dest}`} className="text-gray-600 hover:text-primary">{dest} Tours</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-600">
                <li><Link to="#" className="hover:text-primary">About Us</Link></li>
                <li><Link to="#" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-gray-500">
          <p>© {new Date().getFullYear()} TravelX. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Social Icons */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;