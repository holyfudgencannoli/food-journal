import { AppThemeProvider } from '@/config/ThemeProvider';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { migrateDbIfNeeded } from '@/db/migrations';

import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {


    
	const handleInit = async (db: SQLiteDatabase) => {
    console.log("Initializing...")
		try {
			await migrateDbIfNeeded(db);
			console.log("✅ Migration complete!");
		} catch (err) {
			console.error("❌ Migration failed:", err);
		} 
  }

  return (
    <GestureHandlerRootView>
    <SQLiteProvider databaseName='food-journal.db' onInit={handleInit}>
        <AppThemeProvider>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="new-meal-time" options={{ headerShown: false }} />
                <Stack.Screen name="new-entry" options={{ headerShown: false }} />
                <Stack.Screen name="journal-entries" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
        </AppThemeProvider>
    </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
