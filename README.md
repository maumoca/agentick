# Agentick Dashboard

A modern, responsive dashboard for Agentick built with React, Material UI, and Firebase.

## Features

- **Real-time Data**: Connected to Firebase for real-time data updates
- **Mobile Optimized**: Fully responsive design with iOS/Safari specific optimizations
- **Modern UI**: Built with Material UI and Vision UI components
- **Secure**: Environment variables for sensitive credentials
- **Easy Deployment**: Simple deployment with Genezio

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account (for data storage)
- Genezio account (for deployment)

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd vision-ui-dashboard-react
npm install --legacy-peer-deps
```

### Configuration

1. Create a `.env` file in the root directory with your Firebase credentials:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### Running Locally

Start the development server:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Mobile Optimization

This dashboard is optimized for mobile devices, with special attention to iOS/Safari compatibility:

- Safe area insets for notched devices
- Touch-friendly UI elements (minimum 44x44px touch targets)
- Responsive layouts that adapt to different screen sizes
- iOS-specific fixes for scrolling, rendering, and input handling
- Hardware acceleration for smooth animations

## Deployment

### Using the Deployment Script

We've included a deployment script to simplify the process:

```bash
./deploy.sh
```

This script will:
1. Check if Genezio is installed and install it if needed
2. Verify your Genezio login status
3. Load environment variables from your `.env` file
4. Deploy the application to Genezio

### Manual Deployment

If you prefer to deploy manually:

1. Install Genezio CLI:
```bash
npm install -g genezio
```

2. Login to Genezio:
```bash
genezio login
```

3. Deploy the application:
```bash
genezio deploy
```

## Project Structure

- `/src/assets`: Static assets and theme configuration
- `/src/components`: Reusable UI components
- `/src/context`: React context providers
- `/src/examples`: Example components from Vision UI
- `/src/layouts`: Page layouts and components
- `/src/services`: Firebase services and API integrations

## Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firestore database
3. Set up authentication if needed
4. Add your web app to the Firebase project
5. Copy the configuration to your `.env` file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
