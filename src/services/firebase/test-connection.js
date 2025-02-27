import { db } from "./config";
import { collection, getDocs } from "firebase/firestore";

// Simple function to test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log("Testing Firebase connection...");
    // Try to fetch clients collection
    const clientsCol = collection(db, 'clients');
    const snapshot = await getDocs(clientsCol);
    console.log(`Connection successful! Found ${snapshot.docs.length} documents.`);
    return {
      success: true,
      message: `Connection successful! Found ${snapshot.docs.length} documents.`
    };
  } catch (error) {
    console.error("Firebase connection error:", error);
    return {
      success: false,
      message: `Connection failed: ${error.message}`,
      error
    };
  }
};

// Export for use in other files
export default testFirebaseConnection;
