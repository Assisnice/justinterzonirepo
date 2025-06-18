# Justin Terzoni Portfolio

A modern, interactive portfolio website built with React, TypeScript, and Vite. Features a unique desktop-style interface with draggable windows and terminal integration.

## Features

- 🖥️ Desktop-style interface with draggable windows
- 💻 Interactive terminal component
- 📱 Responsive design for mobile and desktop
- ⚡ Fast performance with Vite
- 🎨 Modern UI with smooth animations
- 🔧 TypeScript for type safety

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: CSS-in-JS with custom animations
- **Deployment**: Netlify-ready

## Local Development

**Prerequisites:** Node.js (v16 or higher)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Netlify Deployment

This project is configured for easy Netlify deployment:

1. **Connect your repository** to Netlify
2. **Set build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Add environment variables** in Netlify dashboard:
   - `GEMINI_API_KEY`: Your Gemini API key
4. **Deploy!**

### Manual Deployment

You can also deploy manually by:

1. Running `npm run build`
2. Uploading the `dist/` folder to Netlify

## Project Structure

```
├── components/           # React components
│   ├── icons/           # Icon components
│   ├── sections/        # Content sections
│   └── ...              # UI components
├── hooks/               # Custom React hooks
├── dist/                # Build output (generated)
├── public/              # Static assets
├── netlify.toml         # Netlify configuration
├── _redirects           # SPA routing configuration
└── ...
```

## Configuration Files

- `netlify.toml` - Netlify build and deployment settings
- `_redirects` - SPA routing and security headers
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration

## Environment Variables

- `GEMINI_API_KEY` - Required for AI-powered features

## License

This project is private and proprietary.

