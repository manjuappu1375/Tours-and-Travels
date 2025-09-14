import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface TravelTipProps {
  tourTitle: string;
  tourLocation: string;
}

const TravelTip: React.FC<TravelTipProps> = ({ tourTitle, tourLocation }) => {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTip = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.post('/tours/tip', { tourTitle, tourLocation });
        setTip(data.tip);
      } catch (err) {
        console.error('Failed to generate travel tip:', err);
        setError('Could not generate a travel tip at this time.');
      } finally {
        setLoading(false);
      }
    };
    fetchTip();
  }, [tourTitle, tourLocation]);

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg my-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl">💡</span>
        </div>
        <div className="ml-3">
          <p className="text-sm font-bold text-blue-800">Pro Travel Tip</p>
          {loading && (
            <p className="text-sm text-blue-700 animate-pulse">
              Generating a special tip for your trip...
            </p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {tip && <p className="text-sm text-blue-700 mt-1">{tip}</p>}
        </div>
      </div>
    </div>
  );
};

export default TravelTip;