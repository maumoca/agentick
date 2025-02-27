import React, { createContext, useState, useContext, useEffect } from 'react';
import { useClient } from './ClientContext';

// Create context
const EditContext = createContext();

// Provider component
export const EditProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false);
  const [preferences, setPreferences] = useState({
    layout: "default",
    colorTheme: "dark",
    padding: "medium",
    fontSize: "medium"
  });
  
  const { selectedClient, updateClientPreferences } = useClient();

  // Load preferences from selected client
  useEffect(() => {
    if (selectedClient && selectedClient.uiPreferences) {
      setPreferences(selectedClient.uiPreferences);
    } else {
      // Reset to defaults if no client is selected
      setPreferences({
        layout: "default",
        colorTheme: "dark",
        padding: "medium",
        fontSize: "medium"
      });
    }
  }, [selectedClient]);

  // Toggle edit mode
  const toggleEditMode = () => setEditMode(!editMode);

  // Update preferences
  const updatePreferences = async (newPreferences) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    
    // Save to Firebase if a client is selected
    if (selectedClient) {
      await updateClientPreferences(selectedClient.id, updatedPreferences);
    }
  };

  // Get CSS variables based on preferences
  const getThemeVariables = () => {
    // Padding values in pixels
    const paddingValues = {
      small: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '24px'
      },
      medium: {
        xs: '12px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '40px'
      },
      large: {
        xs: '16px',
        sm: '24px',
        md: '32px',
        lg: '48px',
        xl: '56px'
      }
    };

    // Font size values in pixels
    const fontSizeValues = {
      small: {
        xs: '10px',
        sm: '12px',
        md: '14px',
        lg: '16px',
        xl: '18px'
      },
      medium: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px'
      },
      large: {
        xs: '14px',
        sm: '16px',
        md: '18px',
        lg: '20px',
        xl: '24px'
      }
    };

    // Color theme values
    const colorThemeValues = {
      dark: {
        background: '#0f1535',
        cardBg: '#111c44',
        primary: '#0075ff',
        secondary: '#2cd9ff',
        success: '#01b574',
        info: '#0075ff',
        warning: '#ffb547',
        error: '#fa3252',
        text: '#ffffff',
        textSecondary: '#a0aec0'
      },
      light: {
        background: '#f8f9fa',
        cardBg: '#ffffff',
        primary: '#0075ff',
        secondary: '#2cd9ff',
        success: '#01b574',
        info: '#0075ff',
        warning: '#ffb547',
        error: '#fa3252',
        text: '#2d3748',
        textSecondary: '#718096'
      },
      blue: {
        background: '#1a365d',
        cardBg: '#2a4365',
        primary: '#63b3ed',
        secondary: '#4fd1c5',
        success: '#48bb78',
        info: '#4299e1',
        warning: '#ecc94b',
        error: '#f56565',
        text: '#ffffff',
        textSecondary: '#cbd5e0'
      }
    };

    // Get values based on current preferences
    const padding = paddingValues[preferences.padding] || paddingValues.medium;
    const fontSize = fontSizeValues[preferences.fontSize] || fontSizeValues.medium;
    const colors = colorThemeValues[preferences.colorTheme] || colorThemeValues.dark;

    return {
      padding,
      fontSize,
      colors
    };
  };

  return (
    <EditContext.Provider
      value={{
        editMode,
        toggleEditMode,
        preferences,
        updatePreferences,
        getThemeVariables
      }}
    >
      {children}
    </EditContext.Provider>
  );
};

// Custom hook to use the edit context
export const useEdit = () => useContext(EditContext);

export default EditContext;
