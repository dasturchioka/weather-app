# Weather Dashboard

A modern, responsive weather dashboard built with React, TypeScript, and Tailwind CSS.

## Features

- 🌤️ Current weather display with detailed metrics
- 📊 5-day weather forecast with interactive charts
- 🌍 Multi-city support with search functionality
- 🌙 Dark/Light theme toggle
- 📱 Fully responsive design
- ⚡ Fast and optimized performance
- 🔄 Real-time data updates with throttling
- 📈 Temperature trend visualization
- 🎯 TypeScript for type safety
- ✨ Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Vitest & React Testing Library
- **Code Quality**: ESLint & Prettier

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/dasturchioka/weather-app.git
cd weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Environment Configuration
Create environment configuration file:
```bash
touch .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Required: Your OpenWeatherMap API Key
VITE_WEATHER_API_KEY=your_openweathermap_api_key_here

# Optional: API Base URL (defaults to OpenWeatherMap)
VITE_WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

| Command        | Description                          |
|----------------|--------------------------------------|
| `npm run dev`  | Start development server with Vite   |
| `npm run build`| Run TypeScript build and create production build with Vite |
| `npm run preview` | Preview production build locally   |
| `npm run lint` | Run ESLint code analysis             |
| `npm run test` | Run all tests with Vitest            |
| `npm run test:watch` | Run tests in watch mode         |
| `npm run test:ui`    | Run tests with Vitest UI        |


## Project Structure

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed information about the project structure and architecture decisions.

## API Documentation

See [API.md](./docs/API.md) for information about the API integration and data models.

## Component Documentation

See [COMPONENTS.md](./docs/COMPONENTS.md) for detailed documentation about each component.

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Weather data provided by OpenWeatherMap API
- Icons by Lucide React
- UI framework by Tailwind CSS
```