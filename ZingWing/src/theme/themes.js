import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const darkTheme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4ea8ff',
    secondary: '#9d5cff',
    background: '#05070d',
    surface: '#0c1220',
    surfaceVariant: '#131a2a',
    outline: '#2d9cff',
    text: '#f5f7ff',
    onSurface: '#f5f7ff',
    onSurfaceVariant: '#b8c7e6',
    card: '#0c1220',
    border: '#1c5cff',
    notification: '#9d5cff',
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1769ff',
    secondary: '#6c3dff',
    background: '#f5f7fb',
    surface: '#ffffff',
    surfaceVariant: '#e9eef8',
    outline: '#a9b8d8',
    text: '#111827',
    onSurface: '#111827',
    onSurfaceVariant: '#4b5563',
    card: '#ffffff',
    border: '#c7d2fe',
    notification: '#1769ff',
  },
};
