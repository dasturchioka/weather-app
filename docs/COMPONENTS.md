# Components Documentation

## Overview

The Weather Dashboard follows a component-based architecture with clear separation between presentation and logic. Components are organized into two main categories: common/reusable components and weather-specific components.

## Component Hierarchy

```
App
├── ErrorBoundary (Common)
└── ThemeProvider (Context)
    └── WeatherWidget (Main Container)
        ├── CitySelector
        ├── WeatherDisplay
        ├── ForecastList
        ├── DataVisualization
        └── SettingsPanel
```

## Common Components

### ErrorBoundary

**Location**: `src/components/common/ErrorBoundary/ErrorBoundary.tsx`  
**Type**: Class Component  
**Purpose**: Catches and handles React errors gracefully

#### Props
```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
}
```

#### State
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
```

#### Features
- Catches JavaScript errors in child components
- Displays user-friendly error message
- Provides "Try again" button to reset error state
- Supports dark/light theme styling

#### Usage
```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### WeatherIcon

**Location**: `src/components/common/WeatherIcon/WeatherIcon.tsx`  
**Type**: Functional Component  
**Purpose**: Displays weather condition icons

#### Props
```typescript
interface WeatherIconProps {
  icon: string;     // OpenWeatherMap icon code
  size?: number;    // Icon size in pixels (default: 48)
}
```

#### Features
- Maps OpenWeatherMap icon codes to Lucide React icons
- Fallback to Cloud icon for unknown codes
- Consistent styling with theme colors
- Customizable size

#### Icon Mapping
| Code | Icon Component | Weather Condition |
|------|---------------|-------------------|
| 01d  | Sun          | Clear sky (day)   |
| 01n  | Moon         | Clear sky (night) |
| 02d-04n | Cloud     | Clouds            |
| 09d-11n | CloudRain | Rain/Thunderstorm |
| 13d-13n | CloudSnow | Snow              |
| 50d-50n | Cloud     | Mist/Fog          |

#### Usage
```typescript
<WeatherIcon icon="01d" size={64} />
```

## Weather Components

### WeatherWidget

**Location**: `src/components/weather/WeatherWidget/WeatherWidget.tsx`  
**Type**: Functional Component (Container)  
**Purpose**: Main container component managing weather data and UI state

#### Features
- Three-tab interface: Current, Forecast, Statistics
- City transition animations
- Loading and error states
- Statistics calculations
- Integration with custom hooks

#### State Management
```typescript
const [activeTab, setActiveTab] = useState<'current' | 'forecast' | 'statistics'>('current');
const [isTransitioning, setIsTransitioning] = useState(false);
```

#### Tab Content
- **Current**: Weather display + settings panel
- **Forecast**: 5-day forecast list + temperature chart
- **Statistics**: Temperature and humidity statistics + visualization

#### Usage
```typescript
<WeatherWidget />
```

### CitySelector

**Location**: `src/components/weather/CitySelector/CitySelector.tsx`  
**Type**: Functional Component  
**Purpose**: Dropdown component for selecting cities

#### Props
```typescript
interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}
```

#### Features
- Dropdown with search functionality
- Real-time filtering of cities
- Debounced search input (300ms)
- Keyboard navigation support
- Click-outside-to-close behavior

#### City List
Currently supports: London, New York, Tokyo, Sydney, Cairo

#### State Management
```typescript
const [isOpen, setIsOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
```

#### Usage
```typescript
<CitySelector 
  selectedCity="London"
  onCityChange={(city) => console.log(city)} 
/>
```

### WeatherDisplay

**Location**: `src/components/weather/WeatherDisplay/WeatherDisplay.tsx`  
**Type**: Functional Component  
**Purpose**: Displays current weather information

#### Props
```typescript
interface WeatherDisplayProps {
  weather: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}
```

#### Features
- Gradient background design
- Large temperature display with unit conversion
- Weather icon integration
- Detailed metrics grid (humidity, wind, pressure, visibility)
- Last updated timestamp
- Responsive design

#### Metrics Display
- **Humidity**: Percentage with droplet icon
- **Wind Speed**: m/s with wind icon
- **Pressure**: hPa with thermometer icon
- **Visibility**: km with eye icon

#### Usage
```typescript
<WeatherDisplay 
  weather={weatherData} 
  unit="celsius" 
/>
```

### ForecastList

**Location**: `src/components/weather/ForecastList/ForecastList.tsx`  
**Type**: Functional Component  
**Purpose**: Displays 5-day weather forecast

#### Props
```typescript
interface ForecastListProps {
  forecast: ForecastData[];
  unit: 'celsius' | 'fahrenheit';
}
```

#### Features
- Card-based layout for each day
- Weather icon for each forecast
- Min/max temperature display
- Date formatting (weekday, month, day)
- Weather description
- Temperature unit conversion

#### Layout
Each forecast card contains:
- Left side: Weather icon and date/description
- Right side: High/low temperatures

#### Usage
```typescript
<ForecastList 
  forecast={forecastData} 
  unit="fahrenheit" 
/>
```

### DataVisualization

**Location**: `src/components/weather/DataVisualization/DataVisualization.tsx`  
**Type**: Functional Component  
**Purpose**: Interactive temperature trend chart

#### Props
```typescript
interface DataVisualizationProps {
  forecast: ForecastData[];
  unit: 'celsius' | 'fahrenheit';
}
```

#### Features
- SVG-based line chart
- Temperature trend visualization
- Interactive data points
- Gradient area under curve
- Grid lines for reference
- Responsive scaling

#### Chart Elements
- **Line**: Blue gradient stroke showing temperature trend
- **Area**: Semi-transparent fill under the line
- **Points**: Circular markers at each data point
- **Labels**: Temperature values and day names
- **Grid**: Horizontal reference lines

#### Calculations
- Auto-scaling based on temperature range
- Responsive dimensions (720x200 base, scales with container)
- 40px padding on all sides

#### Usage
```typescript
<DataVisualization 
  forecast={forecastData} 
  unit="celsius" 
/>
```

### SettingsPanel

**Location**: `src/components/weather/SettingsPanel/SettingsPanel.tsx`  
**Type**: Functional Component  
**Purpose**: User preferences and actions panel

#### Props
```typescript
interface SettingsPanelProps {
  unit: 'celsius' | 'fahrenheit';
  onToggleUnit: () => void;
  onRefresh: () => void;
}
```

#### Features
- Temperature unit toggle (°C/°F)
- Theme toggle (Light/Dark)
- Data refresh button
- Consistent button styling
- Theme-aware colors

#### Settings Options
1. **Temperature Unit**: Toggle between Celsius and Fahrenheit
2. **Theme**: Switch between light and dark modes
3. **Refresh Data**: Manually refresh weather data

#### Theme Integration
Uses `ThemeContext` to access and modify global theme state.

#### Usage
```typescript
<SettingsPanel 
  unit="celsius"
  onToggleUnit={() => toggleUnit()}
  onRefresh={() => refetchData()}
/>
```

## Component Design Patterns

### Container vs Presentational

#### Container Components
- **WeatherWidget**: Manages state and data fetching
- **CitySelector**: Handles search logic and state

#### Presentational Components
- **WeatherDisplay**: Pure presentation of weather data
- **ForecastList**: Renders forecast data
- **DataVisualization**: Displays chart based on props
- **SettingsPanel**: UI for settings (delegates actions to parent)

### Props Interface Design

All components follow consistent prop interface patterns:
- Required data props (weather, forecast)
- Optional configuration props (unit, size)
- Callback props for user interactions (onCityChange, onToggleUnit)
- Clear TypeScript interfaces for all props

### Styling Approach

#### Tailwind CSS Classes
- Consistent use of Tailwind utility classes
- Dark mode variants using `dark:` prefix
- Responsive breakpoints: `sm:`, `md:`, `lg:`
- Hover states for interactive elements

#### Color Scheme
- **Primary**: Blue shades (blue-50 to blue-900)
- **Success**: Green shades for positive actions
- **Error**: Red shades for error states
- **Neutral**: Gray shades for backgrounds and text

### Error Handling

#### Component Level
Each component handles its own error scenarios:
- Missing/invalid props
- Empty data states
- Rendering fallbacks

#### Error Boundaries
Critical components wrapped in ErrorBoundary for graceful failure handling.

## Component Testing Strategy

### Test Files Location
Each component has a corresponding `.test.tsx` file in the same directory (currently empty, ready for implementation).

### Testing Approach
- **Unit Tests**: Individual component behavior
- **Integration Tests**: Component interaction with hooks/context
- **Snapshot Tests**: UI regression prevention
- **User Interaction Tests**: Event handling and user flows

### Mock Strategy
Components can be tested in isolation using:
- Mock weather data
- Mock API responses
- Mock context providers
- Jest/React Testing Library utilities

## Accessibility Considerations

### ARIA Support
- Semantic HTML elements
- Proper heading hierarchy
- Button and link roles
- Tab navigation support

### Keyboard Navigation
- Tab order follows logical flow
- Enter/Space for button activation
- Escape to close dropdowns
- Arrow keys for tab navigation

### Visual Accessibility
- High contrast ratios in both themes
- Proper focus indicators
- Scalable fonts and icons
- Color not as sole information indicator

## Performance Optimizations

### React Optimizations
- `useCallback` for event handlers
- `useMemo` for expensive calculations
- Proper key props for list items
- Minimal re-renders through state structure

### Rendering Optimizations
- Conditional rendering for loading states
- Lazy loading ready structure
- SVG for scalable graphics
- Efficient DOM updates

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Feature Support
- CSS Grid and Flexbox
- SVG graphics
- ES6+ features (via build process)
- Modern JavaScript APIs