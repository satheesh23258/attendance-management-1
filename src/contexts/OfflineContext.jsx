import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState(() => {
    const saved = localStorage.getItem('offlineQueue');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('System is back online. Syncing data...');
      syncData();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Working offline. Actions will be synced later.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncData = async () => {
    const queue = [...offlineQueue];
    if (queue.length === 0) return;

    // Implementation would go here - for now just clear local
    console.log('[PWA] Syncing queue...', queue);
    // In real app, we would loop through and call the APIs
    localStorage.removeItem('offlineQueue');
    setOfflineQueue([]);
  };

  const queueAction = (type, data) => {
    const newQueue = [...offlineQueue, { type, data, timestamp: new Date() }];
    setOfflineQueue(newQueue);
    localStorage.setItem('offlineQueue', JSON.stringify(newQueue));
  };

  return (
    <OfflineContext.Provider value={{ isOnline, offlineQueue, queueAction }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);
