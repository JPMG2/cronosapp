# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo React Native application using TypeScript. The project is set up with file-based routing via Expo Router and includes both a starter template (in `app-example/`) and the actual application code (in `app/`).

## Architecture

- **File-based routing**: Uses Expo Router with routes defined in the `app/` directory
- **Component structure**: Shared components in `app-example/components/` including UI components and themed components
- **Hooks**: Custom hooks in `app-example/hooks/` for color scheme, theme color management
- **Constants**: Theme definitions and configuration in `app-example/constants/`
- **Path mapping**: TypeScript configured with `@/*` mapping to root directory for imports

## Common Commands

### Development
- `npm start` - Start Expo development server
- `npm run android` - Start for Android emulator
- `npm run ios` - Start for iOS simulator  
- `npm run web` - Start for web browser
- `npx expo start` - Alternative way to start development server

### Code Quality
- `npm run lint` - Run ESLint (using expo lint configuration)

### Project Management
- `npm run reset-project` - Move starter code to `app-example/` and create fresh `app/` directory

## Development Notes

### Project Structure States
The project can exist in two states:
1. **Fresh state**: Contains example code in `app/`, `components/`, `hooks/`, `constants/`, `scripts/`
2. **Reset state**: Example code moved to `app-example/`, with minimal `app/` containing only `index.tsx` and `_layout.tsx`

### Key Dependencies
- Expo Router for navigation and routing
- React Navigation for tab navigation
- Expo Vector Icons and Expo Symbols for iconography
- React Native Reanimated and Gesture Handler for animations
- TypeScript with strict mode enabled

### Component Patterns
- Uses `expo-router` Stack and Tabs components for navigation
- Implements themed components that adapt to light/dark color schemes
- Custom haptic feedback integration for tab interactions
- SF Symbols support via IconSymbol component on iOS

## TypeScript Configuration
- Strict mode enabled
- Path mapping configured for `@/*` imports
- Expo TypeScript base configuration extended