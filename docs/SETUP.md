# Setup and Installation Guide

## Prerequisites

Before setting up the Weather Dashboard, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v18 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** for version control

### Verify Installation
```bash
node --version    # Should show v18.0.0 or higher
npm --version     # Should show npm version
git --version     # Should show git version
```

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/dasturchioka/weather-app
cd weather-app
```

### 2. Install Dependencies
Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### 3. Environment Configuration
Create environment configuration file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Required: Your OpenWeatherMap API Key
VITE_WEATHER_API_KEY=your_openweathermap_api_key_here

# Optional: API Base URL (defaults to OpenWeatherMap)
VITE_WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
```

**Security Note**: Never commit `.env.local` to version control. It's already included in `.gitignore`.

## Development Setup

### Start Development Server
```bash
npm run dev
```

This will:
- Start the Vite development server
- Open your browser to `http://localhost:3000`
- Enable hot module replacement for live updates
- Display TypeScript errors in the terminal

### Development Features
- **Hot Reload**: Changes automatically refresh the browser
- **TypeScript Checking**: Real-time type error reporting
- **ESLint Integration**: Code quality checks
- **Fast Builds**: Vite's optimized bundling

## Build Configuration

### Development Build
For development with source maps and debugging:
```bash
npm run dev
```

### Production Build
Create optimized production build:
```bash
npm run build
```

This generates:
- Minified JavaScript and CSS
- Optimized assets in `dist/` directory
- Source maps for debugging
- Tree-shaken bundles

### Preview Production Build
Test the production build locally:
```bash
npm run preview
```

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

## IDE Setup

### Visual Studio Code (Recommended)
Install these extensions for the best development experience:

#### Essential Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag"
  ]
}
```

#### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

### TypeScript Configuration
The project uses strict TypeScript configuration:
- **Strict Mode**: Enabled for better type safety
- **Path Mapping**: `@/*` maps to `./src/*`
- **Module Resolution**: Bundler mode for Vite compatibility
- **JSX**: React JSX transform

## Troubleshooting

### Common Issues

#### 1. API Key Not Working
**Symptoms**: 401 Unauthorized errors
**Solutions**:
- Verify API key is correct in `.env.local`
- Check that API key is active (may take up to 10 minutes after creation)
- Ensure no extra spaces or quotes around the API key
- Restart development server after changing `.env.local`

#### 2. Port Already in Use
**Symptoms**: `Error: listen EADDRINUSE :::3000`
**Solutions**:
- Kill the process using port 3000: `npx kill-port 3000`
- Change port in `vite.config.ts` or use `--port` flag
- Check for other running development servers

#### 3. TypeScript Errors
**Symptoms**: Type checking failures
**Solutions**:
- Run `npm run type-check` to see all errors
- Ensure all dependencies are installed
- Check for missing type definitions
- Verify TypeScript version compatibility

#### 4. Build Failures
**Symptoms**: Build process fails
**Solutions**:
- Clear node modules: `rm -rf node_modules && npm install`
- Check for ESLint errors: `npm run lint`
- Verify all imports are correct
- Check for missing environment variables

#### 5. Styling Issues
**Symptoms**: Tailwind classes not working
**Solutions**:
- Verify Tailwind CSS is imported in `src/styles/globals.css`
- Check if classes are properly written
- Ensure dark mode classes are prefixed with `dark:`
- Clear browser cache

### Environment Variables Debug

Check if environment variables are loaded correctly:
```typescript
// Add to any component temporarily
console.log('API Key loaded:', !!import.meta.env.VITE_WEATHER_API_KEY);
console.log('Base URL:', import.meta.env.VITE_WEATHER_API_BASE_URL);
```

### Network Issues
If API requests fail:
1. Check browser network tab for request details
2. Verify CORS isn't blocking requests
3. Test API key directly in browser: `https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY`

## Deployment

### Environment Setup for Production

#### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard

#### Netlify Deployment
1. Build the project: `npm run build`
2. Deploy `dist/` folder to Netlify
3. Set environment variables in Netlify dashboard
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

#### Environment Variables for Production
Set these in your deployment platform:
```env
VITE_WEATHER_API_KEY=your_production_api_key
VITE_WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
```

### Custom Domain Setup
1. Configure domain in deployment platform
2. Update CORS settings if needed
3. Set up SSL certificate (usually automatic)

## Performance Optimization

### Development Performance
- Use `npm run dev` for fastest development experience
- Enable source maps for easier debugging
- Use browser dev tools for performance profiling

### Production Performance
- Minimize bundle size with tree shaking
- Optimize images and assets
- Enable gzip compression on server
- Use CDN for static assets

### Bundle Analysis
Analyze bundle size:
```bash
npm run build
npx vite-bundle-analyzer dist
```

## Testing Setup

### Test Configuration
The project is configured for testing with:
- **Vitest**: Fast test runner
- **React Testing Library**: Component testing utilities
- **jsdom**: Browser environment simulation

### Running Tests
```bash
# Run tests once
npm run test

# Run tests in watch mode  
npm run test:watch

# Run tests with coverage
npm run test -- --coverage
```

### Writing Tests
Test files should be placed alongside components:
```
src/components/weather/WeatherDisplay/
├── WeatherDisplay.tsx
├── WeatherDisplay.test.tsx  # Test file
└── index.ts
```

## Code Quality

### ESLint Configuration
The project uses strict ESLint rules:
- TypeScript-specific rules
- React hooks rules
- Import/export rules
- Code formatting rules

### Pre-commit Hooks
Consider setting up pre-commit hooks:
```bash
npm install --save-dev husky lint-staged
```

Add to `package.json`:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "git add"]
  }
}
```

## Monitoring and Analytics

### Error Monitoring
Consider integrating error tracking:
- Sentry for error monitoring
- LogRocket for session replay
- Google Analytics for usage tracking

### Performance Monitoring
- Web Vitals measurement
- Bundle size monitoring
- API response time tracking

## Security Considerations

### API Key Security
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Monitor API usage for unusual patterns

### Content Security Policy
Consider adding CSP headers for production:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; connect-src 'self' https://api.openweathermap.org;">
```

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills
The build process includes necessary polyfills for:
- ES6+ features
- CSS Grid and Flexbox
- Fetch API
- Promise support

## Contributing Guidelines

### Development Workflow
1. Create feature branch from main
2. Make changes following existing patterns
3. Add tests for new functionality
4. Run linting and type checking
5. Test in multiple browsers
6. Create pull request with description

### Code Style
- Follow existing TypeScript patterns
- Use functional components with hooks
- Implement proper error handling
- Write descriptive component and function names
- Add JSDoc comments for complex functions

### Commit Messages
Use conventional commit format:
```
feat: add temperature unit conversion
fix: resolve API caching issue  
docs: update setup instructions
style: improve responsive design
```

## Getting Help

### Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)

### Community Support
- Create issues in the GitHub repository
- Check existing issues and discussions
- Review the documentation files in `/docs/`

### Professional Support
For professional development or consulting, consider reaching out to the maintainers through the repository's contact methods.