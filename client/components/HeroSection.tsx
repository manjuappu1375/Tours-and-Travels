
import React, { useState } from 'react';

const HeroSection: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.hash = `#/explore?q=${searchQuery}`;
    };

    return (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="container mx-auto px-6 py-24 text-center">
                <h1 className="text-5xl font-extrabold mb-4 leading-tight">
                    <span className="inline-block mr-4">🌍</span>
                    Discover Your Next Adventure
                </h1>
                <p className="text-xl mb-8 text-blue-100">
                    Explore unique destinations around the world with TravelX
                </p>
                <form onSubmit={handleSearch} className="max-w-xl mx-auto bg-white rounded-full p-2 flex items-center shadow-lg">
                    <input
                        type="text"
                        placeholder="Search tours or places..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent px-6 py-3 text-gray-700 focus:outline-none"
                    />
                    <button type="submit" className="bg-primary text-white rounded-full px-8 py-3 font-semibold hover:bg-primary-dark transition-colors">
                        Search
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HeroSection;