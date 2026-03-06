import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider as NavThemeProvider, Theme } from '@react-navigation/native';
import * as React from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { DarkTheme } from './DarkTheme';
import { LightTheme } from './LightTheme';
import { ThemeContext } from './themeContext';

export type Scheme = 'system' | 'light' | 'dark';
const STORAGE_KEY = 'theme.scheme';

export const ThemeControlsContext = React.createContext<
  | {
      scheme: Scheme;
      setScheme: (s: Scheme) => void;
      toggle: () => void;
    }
  | undefined
>(undefined);

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const system = useSystemColorScheme();
  const [scheme, setScheme] = React.useState<Scheme>('system');
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(STORAGE_KEY);
        if (v === 'light' || v === 'dark' || v === 'system') {
          setScheme(v);
        }
      } catch (e) {
        // ignore
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, scheme).catch(() => {});
  }, [scheme, loaded]);

  const actualTheme =
    scheme === 'system' ? (system === 'dark' ? DarkTheme : LightTheme) : scheme === 'dark' ? DarkTheme : LightTheme;

  const toggle = React.useCallback(() => setScheme((prev) => (prev === 'dark' ? 'light' : 'dark')) , []);

  return (
    <ThemeControlsContext.Provider value={{ scheme, setScheme, toggle }}>
      <ThemeContext.Provider value={actualTheme as Theme}>
        <NavThemeProvider value={actualTheme as Theme}>{children}</NavThemeProvider>
      </ThemeContext.Provider>
    </ThemeControlsContext.Provider>
  );
};

export function useThemeControls() {
  const ctx = React.useContext(ThemeControlsContext);
  if (!ctx) throw new Error('useThemeControls must be used within AppThemeProvider');
  return ctx;
}
