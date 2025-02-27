import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import clientService from '../services/firebase/clientService';

// Create context
const ClientContext = createContext();

// Mock data for the dashboard
const mockClients = [
  {
    id: "client1",
    name: "Client 1",
    metrics: {
      successRate: {
        current: 82,
        previous: 75,
        change: 7,
        history: [75, 78, 76, 79, 80, 78, 82, 81, 84, 82, 85, 82]
      },
      revenue: {
        current: 82000,
        trend: "+15%",
        history: [65000, 68000, 70000, 72000, 75000, 73000, 78000, 80000, 79000, 82000, 84000, 82000]
      },
      callsBooked: {
        current: 187,
        trend: "+23%",
        history: [140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 187]
      },
      hoursSaved: {
        current: 342,
        trend: "+18%",
        history: [280, 290, 300, 310, 320, 330, 335, 340, 345, 342, 350, 342]
      },
      retentionRate: {
        current: "78%",
        trend: "-2%",
        history: [80, 81, 80, 79, 78, 77, 76, 77, 78, 79, 78, 78]
      }
    },
    uiPreferences: {
      layout: "default",
      colorTheme: "dark",
      padding: "medium",
      fontSize: "medium"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Provider component
export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState(mockClients);
  const [selectedClient, setSelectedClient] = useState(mockClients[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Ref to store unsubscribe function for real-time updates (not used with mock data)
  const unsubscribeRef = useRef(null);

  // Load clients on mount - using mock data
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Refresh all clients data
  const refreshClients = useCallback(async () => {
    try {
      setIsRefreshing(true);
      
      // Force fetch from Firestore
      const refreshedClients = await clientService.refreshAllClients();
      setClients(refreshedClients);
      
      // Update selected client if it exists in the refreshed data
      if (selectedClient) {
        const updatedSelectedClient = refreshedClients.find(
          client => client.id === selectedClient.id
        );
        
        if (updatedSelectedClient) {
          setSelectedClient(updatedSelectedClient);
        }
      }
      
      setError(null);
      return true;
    } catch (err) {
      console.error("Error refreshing clients:", err);
      setError(`Failed to refresh clients: ${err.message}`);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedClient]);

  // Refresh selected client data
  const refreshSelectedClient = useCallback(async () => {
    if (!selectedClient) return false;
    
    try {
      setIsRefreshing(true);
      
      // Force fetch from Firestore
      const refreshedClient = await clientService.refreshClient(selectedClient.id);
      
      // Update selected client
      setSelectedClient(refreshedClient);
      
      // Update client in the clients array
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === refreshedClient.id ? refreshedClient : client
        )
      );
      
      setError(null);
      return true;
    } catch (err) {
      console.error("Error refreshing selected client:", err);
      setError(`Failed to refresh client: ${err.message}`);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedClient]);

  // Add a new client
  const addClient = async (clientName) => {
    if (!clientName || typeof clientName !== 'string' || clientName.trim() === '') {
      setError("Client name is required");
      return null;
    }
    
    try {
      setLoading(true);
      const newClient = await clientService.addClient(clientName);
      
      // Update clients list
      setClients(prevClients => [...prevClients, newClient]);
      
      // If this is the first client, select it
      if (clients.length === 0) {
        setSelectedClient(newClient);
      }
      
      setError(null);
      return newClient;
    } catch (err) {
      console.error("Error adding client:", err);
      setError(`Failed to add client: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Remove a client
  const removeClient = async (clientId) => {
    if (!clientId) {
      setError("Client ID is required");
      return false;
    }
    
    try {
      setLoading(true);
      
      // Remove from Firestore
      await clientService.removeClient(clientId);
      
      // Update local state
      setClients(prevClients => prevClients.filter(client => client.id !== clientId));
      
      // If the removed client was selected, select another one
      if (selectedClient && selectedClient.id === clientId) {
        const remainingClients = clients.filter(client => client.id !== clientId);
        if (remainingClients.length > 0) {
          setSelectedClient(remainingClients[0]);
        } else {
          setSelectedClient(null);
        }
      }
      
      setError(null);
      return true;
    } catch (err) {
      console.error("Error removing client:", err);
      setError(`Failed to remove client: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update client preferences
  const updateClientPreferences = async (clientId, preferences) => {
    if (!clientId) {
      setError("Client ID is required");
      return false;
    }
    
    if (!preferences || typeof preferences !== 'object') {
      setError("Valid preferences object is required");
      return false;
    }
    
    try {
      setLoading(true);
      
      // Update in Firestore
      await clientService.updatePreferences(clientId, preferences);
      
      // Local state updates will happen via the real-time subscription
      // But we'll update it here too for immediate feedback
      
      // Update the client in the state
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId 
            ? { ...client, uiPreferences: preferences, updatedAt: new Date().toISOString() } 
            : client
        )
      );
      
      // Update selected client if it's the one being modified
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(prevClient => ({
          ...prevClient,
          uiPreferences: preferences,
          updatedAt: new Date().toISOString()
        }));
      }
      
      setError(null);
      return true;
    } catch (err) {
      console.error("Error updating client preferences:", err);
      setError(`Failed to update preferences: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Update client metrics
  const updateClientMetrics = async (clientId, metrics) => {
    if (!clientId) {
      setError("Client ID is required");
      return false;
    }
    
    if (!metrics || typeof metrics !== 'object') {
      setError("Valid metrics object is required");
      return false;
    }
    
    try {
      setLoading(true);
      
      // Update in Firestore
      await clientService.updateMetrics(clientId, metrics);
      
      // Local state updates will happen via the real-time subscription
      // But we'll update it here too for immediate feedback
      
      // Update the client in the state
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId 
            ? { ...client, metrics, updatedAt: new Date().toISOString() } 
            : client
        )
      );
      
      // Update selected client if it's the one being modified
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(prevClient => ({
          ...prevClient,
          metrics,
          updatedAt: new Date().toISOString()
        }));
      }
      
      setError(null);
      return true;
    } catch (err) {
      console.error("Error updating client metrics:", err);
      setError(`Failed to update metrics: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Select a client
  const selectClient = useCallback((clientId) => {
    if (!clientId) return false;
    
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setError(null);
      return true;
    }
    
    setError(`Client with ID ${clientId} not found`);
    return false;
  }, [clients]);
  
  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ClientContext.Provider
      value={{
        clients,
        selectedClient,
        loading,
        error,
        isRefreshing,
        addClient,
        removeClient,
        updateClientPreferences,
        updateClientMetrics,
        selectClient,
        refreshClients,
        refreshSelectedClient,
        clearError,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

// Custom hook to use the client context
export const useClient = () => useContext(ClientContext);

export default ClientContext;
