# 🛰️ Solar Panel Detection System

An AI-powered rooftop monitoring application that detects solar panels on buildings using satellite imagery and computer vision.

## ✨ Features

- **AI-Powered Detection**: Uses Roboflow's computer vision API to detect solar panels
- **Interactive Maps**: Google Maps integration with satellite view
- **Real-time Analysis**: Instant rooftop analysis with detailed statistics
- **Comprehensive Results**: Shows panel count, coverage percentage, and confidence scores
- **Location Search**: Search by address or click directly on the map

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Maps API Key
- Roboflow API Key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd solar
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the root directory with the following:

```env
VITE_ROBOFLOW_API_KEY=your_roboflow_api_key
VITE_ROBOFLOW_PRIVATE_KEY=your_roboflow_private_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🔑 API Setup

### Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Static Maps API
   - Geocoding API
4. Create credentials and copy your API key

### Roboflow API

1. Sign up at [Roboflow](https://roboflow.com)
2. Go to your account settings
3. Copy your API key and private key
4. The app uses a public solar panel detection model by default

## 📖 How to Use

1. **Home Page**: Click "Start Monitoring" to begin
2. **Search Location**:
   - Enter an address in the search box, OR
   - Click directly on the map to select a location
3. **Analyze**: Click "Analyze for Solar Panels" button
4. **View Results**: See detection statistics and analyzed imagery

## 🏗️ Project Structure

```
solar/
├── src/
│   ├── components/
│   │   └── ResultsDisplay.tsx    # Results visualization component
│   ├── lib/
│   │   ├── roboflow.ts           # Roboflow API integration
│   │   └── googleMaps.ts         # Google Maps API integration
│   ├── pages/
│   │   └── RooftopMonitor.tsx    # Main monitoring page
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── App.tsx                   # Main app component with routing
│   └── main.tsx                  # App entry point
├── .env                          # Environment variables (not in git)
└── package.json                  # Dependencies
```

## 🛠️ Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Lucide React**: Icon library
- **Google Maps API**: Satellite imagery and geocoding
- **Roboflow API**: AI-powered solar panel detection

## 📊 Detection Results

The app provides:

- **Panel Count**: Number of solar panels detected
- **Coverage Percentage**: How much of the roof area is covered by panels
- **Confidence Score**: AI confidence level for each detection
- **Visual Feedback**: Analyzed satellite image with detection overlay
- **Location Details**: Address and coordinates

## 🎯 Use Cases

- **Homeowners**: Check if neighbors have solar panels
- **Solar Installers**: Pre-survey potential installation sites
- **Researchers**: Study solar panel adoption in different areas
- **Real Estate**: Assess properties with existing solar installations
- **Government**: Monitor renewable energy infrastructure

## 🔒 Security

- API keys are stored in environment variables
- `.env` file is excluded from version control
- All API calls are made client-side with proper error handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### Google Maps not loading
- Verify your API key is correct in `.env`
- Ensure Maps JavaScript API is enabled in Google Cloud Console
- Check browser console for specific error messages

### Roboflow detection not working
- Verify your API key is correct
- Check if you have API credits available
- Ensure the model endpoint is accessible

### Build errors
- Delete `node_modules` and run `npm install` again
- Clear Vite cache: `npm run dev -- --force`
- Check Node.js version: `node --version` (should be v16+)

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ using React, TypeScript, and AI
