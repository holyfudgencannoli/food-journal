// import Button from "@/components/button";
import { ScreenPrimative } from "@/components/screen-primative";
import { colors } from "@/config/theme";
import * as Form from '@/custom/react-native-forms/src';
import * as Entry from '@/features/entries/services/entry-repository';
import { CreateEntryParams } from "@/features/entries/types";
// import { CreateEntryParams } from "@/features/entries/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const STORAGE_KEY = "times";
export default function NewEntryScreen() {
  const navigation = useNavigation();
	const db = useSQLiteContext();
    const { title, startTime, endTime, time_id } = useLocalSearchParams();
    const router = useRouter()
    

	const [body, setBody] = useState("");
	// const [startr, setType] = useState("");
	// const [frequency, setFrequency] = useState("");

	const submitParams = {
        title: title as string,
        body: body,
        start: startTime as string,
        end: endTime as string,
        created_at: new Date().toISOString()
	} as CreateEntryParams


    useFocusEffect(
        useCallback(() => {
            console.log(title)
            console.log(startTime)
            console.log(endTime)
        }, [])
    )

	async function handleSubmit() {
		try {
			const entryId = await Entry.create(db, submitParams)
			console.log("ENTRY ID: ", entryId)
            try {
                if (time_id) {
                    const json = await AsyncStorage.getItem(STORAGE_KEY);
                    if (json) {
                        const parsed = JSON.parse(json) as any[];
                        const filtered = parsed.filter((t) => t.id !== time_id);
                        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
                    }
                } else {
                    await AsyncStorage.removeItem(STORAGE_KEY);
                }
                Alert.alert('Entry Added!', 'You added an entry to your food journal. Great job!')
                router.navigate('/')
            } catch (error) {
                console.error('Failed to update times storage:', error);
            }
		} catch (error) {
			console.error(error)
		}
	}

  return(
    <ScreenPrimative>
			<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#afa'  }}>
				<TouchableOpacity style={{ padding: 24 }} onPress={() => navigation.goBack()}>
					<Ionicons name="arrow-back" size={36} color={colors.primary}/>
				</TouchableOpacity>
				<Text style={{ fontSize: 36, color: colors.primary, fontWeight: 'bold' }}>New Entry Form</Text>	
			</View>
      <View style={{ backgroundColor: '#3c6530', flex: 1, padding: 32, justifyContent: 'center' }}>
        <Form.Control label="Title" name="title" labelStyle={{ fontWeight: 'bold' }}>
            <Form.Input 
                value={title as string}
                style={{ width: '100%', backgroundColor: 'transparent', textAlign: 'center', margin: 'auto' }} 
            />
        </Form.Control>
        <Form.Control label="Body" name="body" labelStyle={{ fontWeight: 'bold' }}>
            <Form.Input 
                multiline
                onChangeText={(text) => setBody(text)}
                style={{ width: '100%', backgroundColor: 'transparent', textAlign: 'center', margin: 'auto' }} 
            />
        </Form.Control>
				<Form.Control label="Medicine Type" name="name" labelStyle={{ fontWeight: 'bold' }}>
					<Form.Input 
                        value={startTime as string}
                        style={{ width: '100%', backgroundColor: 'transparent', textAlign: 'center', margin: 'auto' }} 
                    />
				</Form.Control>
                		<Form.Control label="Medicine Type" name="name" labelStyle={{ fontWeight: 'bold' }}>
					<Form.Input 
                        value={endTime as string}
                        style={{ width: '100%', backgroundColor: 'transparent', textAlign: 'center', margin: 'auto' }} 
                    />
				</Form.Control>
                <View style={{ marginVertical: 42 }}>
                    <Button color={'#8a8'} title="Submit Entry" onPress={handleSubmit} />
                </View>
      </View>
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
