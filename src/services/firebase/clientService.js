import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  getDoc, 
  setDoc,
  onSnapshot,
  writeBatch,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./config";

// Cache for client data to improve performance
const clientCache = {
  data: new Map(),
  timestamp: null,
  ttl: 5 * 60 * 1000, // 5 minutes cache TTL
  
  // Get client from cache
  get: (clientId) => {
    if (!clientCache.timestamp || Date.now() - clientCache.timestamp > clientCache.ttl) {
      return null; // Cache expired
    }
    return clientCache.data.get(clientId) || null;
  },
  
  // Get all clients from cache
  getAll: () => {
    if (!clientCache.timestamp || Date.now() - clientCache.timestamp > clientCache.ttl) {
      return null; // Cache expired
    }
    return Array.from(clientCache.data.values());
  },
  
  // Set client in cache
  set: (client) => {
    clientCache.data.set(client.id, client);
    clientCache.timestamp = Date.now();
  },
  
  // Set multiple clients in cache
  setAll: (clients) => {
    clients.forEach(client => clientCache.data.set(client.id, client));
    clientCache.timestamp = Date.now();
  },
  
  // Remove client from cache
  remove: (clientId) => {
    clientCache.data.delete(clientId);
  },
  
  // Clear cache
  clear: () => {
    clientCache.data.clear();
    clientCache.timestamp = null;
  }
};

// Validate client data
const validateClient = (clientData) => {
  // Check required fields
  if (!clientData.name || typeof clientData.name !== 'string') {
    throw new Error('Client name is required and must be a string');
  }
  
  // Validate metrics if present
  if (clientData.metrics) {
    // Ensure all required metric objects exist
    const requiredMetrics = ['successRate', 'revenue', 'callsBooked', 'hoursSaved', 'retentionRate'];
    for (const metric of requiredMetrics) {
      if (!clientData.metrics[metric]) {
        throw new Error(`Metric ${metric} is required`);
      }
    }
  }
  
  // Validate UI preferences if present
  if (clientData.uiPreferences) {
    const validLayouts = ['default', 'compact', 'expanded'];
    const validColorThemes = ['dark', 'light', 'blue'];
    const validSizes = ['small', 'medium', 'large'];
    
    if (clientData.uiPreferences.layout && !validLayouts.includes(clientData.uiPreferences.layout)) {
      throw new Error(`Invalid layout: ${clientData.uiPreferences.layout}`);
    }
    
    if (clientData.uiPreferences.colorTheme && !validColorThemes.includes(clientData.uiPreferences.colorTheme)) {
      throw new Error(`Invalid color theme: ${clientData.uiPreferences.colorTheme}`);
    }
    
    if (clientData.uiPreferences.padding && !validSizes.includes(clientData.uiPreferences.padding)) {
      throw new Error(`Invalid padding: ${clientData.uiPreferences.padding}`);
    }
    
    if (clientData.uiPreferences.fontSize && !validSizes.includes(clientData.uiPreferences.fontSize)) {
      throw new Error(`Invalid font size: ${clientData.uiPreferences.fontSize}`);
    }
  }
  
  return true;
};

// Helper function to generate random performance data
const generateRandomPerformanceData = () => {
  // Generate random success rate between 75-95%
  const successRate = {
    current: Math.floor(Math.random() * 20) + 75,
    previous: Math.floor(Math.random() * 20) + 70,
    history: Array.from({ length: 12 }, () => Math.floor(Math.random() * 20) + 75)
  };

  // Calculate change
  successRate.change = successRate.current - successRate.previous;

  // Generate random revenue data (50k-100k)
  const revenue = {
    current: Math.floor(Math.random() * 50000) + 50000,
    trend: `+${Math.floor(Math.random() * 20) + 5}%`,
    history: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50000) + 50000)
  };

  // Generate random calls booked (100-300)
  const callsBooked = {
    current: Math.floor(Math.random() * 200) + 100,
    trend: `+${Math.floor(Math.random() * 30) + 10}%`,
    history: Array.from({ length: 12 }, () => Math.floor(Math.random() * 200) + 100)
  };

  // Generate random hours saved (200-500)
  const hoursSaved = {
    current: Math.floor(Math.random() * 300) + 200,
    trend: `+${Math.floor(Math.random() * 25) + 5}%`,
    history: Array.from({ length: 12 }, () => Math.floor(Math.random() * 300) + 200)
  };

  // Generate random retention rate (70-90%)
  const retentionRate = {
    current: `${Math.floor(Math.random() * 20) + 70}%`,
    trend: Math.random() > 0.8 ? `-${Math.floor(Math.random() * 5) + 1}%` : `+${Math.floor(Math.random() * 5) + 1}%`,
    history: Array.from({ length: 12 }, () => Math.floor(Math.random() * 20) + 70)
  };

  return {
    successRate,
    revenue,
    callsBooked,
    hoursSaved,
    retentionRate
  };
};

// Client data service
export const clientService = {
  // Get all clients with caching
  getClients: async (skipCache = false) => {
    try {
      // Check cache first if not skipping
      if (!skipCache) {
        const cachedClients = clientCache.getAll();
        if (cachedClients) {
          return cachedClients;
        }
      }
      
      // Fetch from Firestore
      const clientsCol = collection(db, 'clients');
      const clientSnapshot = await getDocs(clientsCol);
      const clients = clientSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Update cache
      clientCache.setAll(clients);
      
      return clients;
    } catch (error) {
      console.error("Error getting clients:", error);
      throw new Error(`Failed to get clients: ${error.message}`);
    }
  },
  
  // Get a specific client with caching
  getClient: async (clientId, skipCache = false) => {
    if (!clientId) {
      throw new Error("Client ID is required");
    }
    
    try {
      // Check cache first if not skipping
      if (!skipCache) {
        const cachedClient = clientCache.get(clientId);
        if (cachedClient) {
          return cachedClient;
        }
      }
      
      // Fetch from Firestore
      const clientDoc = await getDoc(doc(db, 'clients', clientId));
      if (clientDoc.exists()) {
        const client = {
          id: clientDoc.id,
          ...clientDoc.data()
        };
        
        // Update cache
        clientCache.set(client);
        
        return client;
      } else {
        throw new Error(`Client with ID ${clientId} not found`);
      }
    } catch (error) {
      console.error("Error getting client:", error);
      throw new Error(`Failed to get client: ${error.message}`);
    }
  },
  
  // Add a new client
  addClient: async (clientName) => {
    if (!clientName || typeof clientName !== 'string' || clientName.trim() === '') {
      throw new Error("Valid client name is required");
    }
    
    try {
      // Generate random performance data
      const performanceData = generateRandomPerformanceData();
      
      const clientData = {
        name: clientName.trim(),
        metrics: performanceData,
        uiPreferences: {
          layout: "default",
          colorTheme: "dark",
          padding: "medium",
          fontSize: "medium"
        },
        createdAt: new Date().toISOString(),
        updatedAt: serverTimestamp()
      };
      
      // Validate client data
      validateClient(clientData);
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, 'clients'), clientData);
      
      const newClient = {
        id: docRef.id,
        ...clientData
      };
      
      // Update cache
      clientCache.set(newClient);
      
      return newClient;
    } catch (error) {
      console.error("Error adding client:", error);
      throw new Error(`Failed to add client: ${error.message}`);
    }
  },
  
  // Remove a client
  removeClient: async (clientId) => {
    if (!clientId) {
      throw new Error("Client ID is required");
    }
    
    try {
      // Check if client exists
      const clientRef = doc(db, 'clients', clientId);
      const clientDoc = await getDoc(clientRef);
      
      if (!clientDoc.exists()) {
        throw new Error(`Client with ID ${clientId} not found`);
      }
      
      // Delete from Firestore
      await deleteDoc(clientRef);
      
      // Remove from cache
      clientCache.remove(clientId);
      
      return true;
    } catch (error) {
      console.error("Error removing client:", error);
      throw new Error(`Failed to remove client: ${error.message}`);
    }
  },
  
  // Update client preferences
  updatePreferences: async (clientId, preferences) => {
    if (!clientId) {
      throw new Error("Client ID is required");
    }
    
    if (!preferences || typeof preferences !== 'object') {
      throw new Error("Valid preferences object is required");
    }
    
    try {
      // Validate preferences
      validateClient({ uiPreferences: preferences });
      
      // Get current client data
      const clientRef = doc(db, 'clients', clientId);
      const clientDoc = await getDoc(clientRef);
      
      if (!clientDoc.exists()) {
        throw new Error(`Client with ID ${clientId} not found`);
      }
      
      // Update in Firestore
      await updateDoc(clientRef, {
        uiPreferences: preferences,
        updatedAt: serverTimestamp()
      });
      
      // Update cache
      const cachedClient = clientCache.get(clientId);
      if (cachedClient) {
        cachedClient.uiPreferences = preferences;
        cachedClient.updatedAt = new Date().toISOString();
        clientCache.set(cachedClient);
      }
      
      return true;
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw new Error(`Failed to update preferences: ${error.message}`);
    }
  },
  
  // Update client metrics
  updateMetrics: async (clientId, metrics) => {
    if (!clientId) {
      throw new Error("Client ID is required");
    }
    
    if (!metrics || typeof metrics !== 'object') {
      throw new Error("Valid metrics object is required");
    }
    
    try {
      // Validate metrics
      validateClient({ metrics });
      
      // Get current client data
      const clientRef = doc(db, 'clients', clientId);
      const clientDoc = await getDoc(clientRef);
      
      if (!clientDoc.exists()) {
        throw new Error(`Client with ID ${clientId} not found`);
      }
      
      // Update in Firestore
      await updateDoc(clientRef, {
        metrics,
        updatedAt: serverTimestamp()
      });
      
      // Update cache
      const cachedClient = clientCache.get(clientId);
      if (cachedClient) {
        cachedClient.metrics = metrics;
        cachedClient.updatedAt = new Date().toISOString();
        clientCache.set(cachedClient);
      }
      
      return true;
    } catch (error) {
      console.error("Error updating metrics:", error);
      throw new Error(`Failed to update metrics: ${error.message}`);
    }
  },
  
  // Refresh client data (force fetch from Firestore)
  refreshClient: async (clientId) => {
    if (!clientId) {
      throw new Error("Client ID is required");
    }
    
    try {
      return await clientService.getClient(clientId, true);
    } catch (error) {
      console.error("Error refreshing client:", error);
      throw new Error(`Failed to refresh client: ${error.message}`);
    }
  },
  
  // Refresh all clients data (force fetch from Firestore)
  refreshAllClients: async () => {
    try {
      return await clientService.getClients(true);
    } catch (error) {
      console.error("Error refreshing clients:", error);
      throw new Error(`Failed to refresh clients: ${error.message}`);
    }
  },
  
  // Clear client cache
  clearCache: () => {
    clientCache.clear();
    return true;
  },
  
  // Subscribe to real-time updates for a client
  subscribeToClient: (clientId, callback) => {
    if (!clientId) {
      throw new Error("Client ID is required");
    }
    
    if (typeof callback !== 'function') {
      throw new Error("Callback must be a function");
    }
    
    const clientRef = doc(db, 'clients', clientId);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(clientRef, (doc) => {
      if (doc.exists()) {
        const client = {
          id: doc.id,
          ...doc.data()
        };
        
        // Update cache
        clientCache.set(client);
        
        // Call callback with updated data
        callback(client);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error("Error subscribing to client:", error);
      callback(null, error);
    });
    
    // Return unsubscribe function
    return unsubscribe;
  },
  
  // Batch update multiple clients
  batchUpdateClients: async (updates) => {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error("Updates must be a non-empty array");
    }
    
    try {
      const batch = writeBatch(db);
      
      // Add each update to batch
      for (const update of updates) {
        if (!update.id || !update.data) {
          throw new Error("Each update must have an id and data");
        }
        
        const clientRef = doc(db, 'clients', update.id);
        batch.update(clientRef, {
          ...update.data,
          updatedAt: serverTimestamp()
        });
      }
      
      // Commit batch
      await batch.commit();
      
      // Clear cache to ensure fresh data on next fetch
      clientCache.clear();
      
      return true;
    } catch (error) {
      console.error("Error batch updating clients:", error);
      throw new Error(`Failed to batch update clients: ${error.message}`);
    }
  },

  // Initialize with default client if none exist
  initializeDefaultClient: async () => {
    try {
      const clients = await clientService.getClients();
      
      if (clients.length === 0) {
        // Create a default client
        await clientService.addClient("Client 1");
      }
      
      return true;
    } catch (error) {
      console.error("Error initializing default client:", error);
      // Don't throw here to prevent app from crashing on startup
      return false;
    }
  }
};

export default clientService;
