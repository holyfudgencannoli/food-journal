import { ScreenPrimative } from "@/components/screen-primative";
import { ScrollableDataTable } from "@/components/scrollable-data-table";
import { colors } from "@/config/theme";
import * as Entries from '@/features/entries/services/entry-repository';
import { EntryType } from "@/features/entries/types";
import { useTheme } from "@/hooks/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";




export default function JournalEntriesScreen() {
    const navigation = useNavigation();
    const db = useSQLiteContext();
  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EntryType>();
  const [items, setItems] = useState<EntryType[]>([]);
  const { dark, colors, fonts } = useTheme()

    const loadItems = async (database = db) => {
        if (!database) return;
        try {
            const rows: EntryType[] = await Entries.readAll(database);
            setEntries(rows || []);
        } catch (e) {
            console.error('Failed to load chores:', e);
        }
    };




	useEffect(() => {
		loadItems(db);
	}, []);

  const deleteChore = async (database = db) => {
    if (!database) return;
		try {	
			if (!selectedItem) return;
            await Entries.destroy(database, selectedItem.id);
			setSelectedItem(undefined);
			setModal(false);
			await loadItems(database);
		}
		catch (e) {	
			console.error('Delete failed:', e);
		}
	}

    const [entries, setEntries] = useState<EntryType[]>([])

    const getData = async () => {
        const entries: EntryType[] | null = await Entries.readAll(db)

        setEntries(entries)
        
    }

    useFocusEffect(
        useCallback(() => {
            getData()
        }, [])
    )
    

    const columns = [
        { key: "title", title: "Name" },
        { key: "start", title: "Start Time" },
        { key: "end", title: "End Time" }
    ];

  return(
    <ScreenPrimative>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#afa'  }}>
      <TouchableOpacity style={{ padding: 24 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={36} color={colors.primary}/>
      </TouchableOpacity>
        <Text style={{ fontSize: 36, color: colors.primary, fontWeight: 'bold' }}>Journal Entries</Text>	
        </View>
      <View style={{ padding: 16 }}>
        <ScrollableDataTable
            data={entries}
            columns={columns}
            headerStyle={{ backgroundColor: colors.primary, padding: 16 }}
            headerTextStyle={{ color: colors.text }}
            rowStyle={{ padding: 16 }}
            cellTextStyle={{ textAlign: 'center', color: dark ? 'white' : 'black' }}
            onRowPress={(item) => {
                setSelectedItem(item)
                setModal(true)
            }}

        >

        </ScrollableDataTable>
      </View>

        <Modal
            // animationType="slide"
            transparent={true}
            visible={modal}
            onRequestClose={() => {
                setModal(false)
            }}
            // style={{ height: '60%' }}

        >
            <View style={{ alignItems: 'center', backgroundColor: colors.primary, height: 'auto', width: '85%', marginBottom: 12, justifyContent: 'center', position: 'absolute', top: '30%', padding: 20, alignSelf: 'center', borderRadius: 8 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 12, color: colors.text }}>
                    Title: {selectedItem ? selectedItem.title : 'No Chore Selected'}
                </Text>
                <Text style={{ fontSize: 18, marginBottom: 24, color: colors.text }}>
                    Body: {selectedItem ?  (selectedItem.body === '' ? 'No notes' : selectedItem.body) : 'No Chore Selected' }
                </Text>
                <Button buttonColor={colors.notification} style={{ margin: 8 }} mode="contained" onPress={() => deleteChore(db)}>Delete</Button>
                <Button buttonColor={colors.card} mode="contained" onPress={() => setModal(false)}>Close</Button>
            </View>

        </Modal>
    </ScreenPrimative>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    color: colors.primary,
    fontSize: 44,
    fontWeight: 'bold',
  }
});
