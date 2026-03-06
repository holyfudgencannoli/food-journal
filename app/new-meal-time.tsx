import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { colors } from "@/config/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid"; // npm i uuid
import { ScreenPrimative } from "../components/screen-primative";
import TimeLogger from "../components/time-logger";
import * as Form from '../custom/react-native-forms/src';



/* ------------------------------------------------------------------ */
/* Types (optional – remove if you’re not using TS)                   */
type Category = 'Dinner' | 'Lunch' | 'Breakfast' | 'Snack' | 'Dessert' | 'Appetizer';

export type TimePair = {
  id: string;
  startTime: Date;
  endTime: Date;
  category: Category;
};

const STORAGE_KEY = "times";
/* ------------------------------------------------------------------ */

export default function NewTaskForm() {
  /* ---------- State ------------------------------------------------- */
  const [selectedOpt, setSelectedOpt] = useState<{name: string, value: string} | null>();
  const [startTime, setStartTime] = useState<Date | number | string | null>(null);
  const [endTime, setEndTime] = useState<Date | number | string | null>(null);
  const [times, setTimes] = useState<TimePair[]>([]);
	const [title, setTitle] = useState("");


  const navigation = useNavigation<NavigationProp<any>>();



    /* ---------- Load persisted times --------------------------------- */
  useEffect(() => {
    const loadTimes = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        console.log("Effect JSON: ", json)
        if (json) {
          const parsed: TimePair[] = JSON.parse(json).map((t: any) => ({
            ...t,
            startTime: new Date(t.startTime),
            endTime: new Date(t.endTime),
          }));
          setTimes(parsed);
        }
      } catch (e) {
        console.warn("Failed to load times:", e);
      }
      return () => {
        setSelectedOpt(null)
      }
    };

    const loadStartTime = async() => {
      try {
        const datestring = await AsyncStorage.getItem("start_time")
        console.log("JSON:", datestring)
        if (datestring) {
          const value: string = datestring
          console.log("VALUE: ", value)
          setStartTime(new Date(value))
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadTimes();
    loadStartTime();
  }, []);

  const persist = async () => {
    // if (!startTime) {
    //   // First click → Save start time
    //   const now = new Date();
    //   await AsyncStorage.setItem("start_time", now.toISOString());
    //   setStartTime(now);
    //   console.log("Start time saved:", now.toISOString());
    // } else {
    //   // Second click → Save end time and notify parent
    //   const end = new Date();
    //   setEndTime(end);
    // }
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(times.map((t) => ({
          ...t,
          startTime: t.startTime.toISOString(),
          endTime: t.endTime.toISOString(),
        })))
      );
    } catch (e) {
      console.warn("Failed to persist times:", e);
    }
  };

  /* ---------- Persist whenever the array changes ------------------- */
  useEffect(() => {
      
    persist();
  }, [times]);

  const persistTimes = async (newTimes: TimePair[]) => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(newTimes.map((t) => ({
        ...t,
        startTime: t.startTime.toISOString(),
        endTime: t.endTime.toISOString(),
      })))
    );
  };


  /* ---------- Callback from TimeLogger ---------------------------- */
  const onTimesSet = async({ startTime, endTime, category }: { startTime: Date; endTime: Date, category: Category }) => {
    setTimes((prev) => [
      ...prev,
      {
        id: uuidv4(),
        startTime,
        endTime,
        category, // default – user can change it later
      },
    ]);
    setStartTime(null);
    setEndTime(null);
    await AsyncStorage.removeItem("start_time");

  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete entry",
      "Are you sure you want to remove this time record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Remove the item from state
            setTimes((prev) => prev.filter((t) => t.id !== id));

            /* OPTIONAL: If you want to persist immediately (instead of waiting for the effect),
              uncomment the line below.  The effect will still run, but it’s harmless. */
            persistTimes(times.filter(t => t.id !== id));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const opts = [{name: 'Dinner', value: 'Dinner'}, {name: 'Lunch', value: 'Lunch'}, {name: 'Breakfast', value: 'Breakfast'}, {name: 'Snack', value: 'Snack'}, {name: 'Dessert', value: 'Dessert'}, {name: 'Appetizer', value: 'Appetizer'}]


  /* ---------- Render ------------------------------------------------ */
  return (
    <ScreenPrimative edges={[]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary  }}>
				<TouchableOpacity style={{ padding: 36 }} onPress={() => navigation.goBack()}>
					<Ionicons name="arrow-back" size={36} color={'#afa'}/>
				</TouchableOpacity>
				<Text style={{ fontSize: 36, color: '#afa', fontWeight: 'bold' }}>New Entry Form</Text>	
			</View>
      <View style={styles.container}>	
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: 0.9 }}
          colors={["#000", "#333", "#ccc"]}
          style={{ flex: 1, padding: 16}}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0.3, y: 0.9 }}
            colors={['#880', '#088', '#808']}
            style={{ flex: 1, padding: 16, borderRadius: 4}}
          >
            <ScrollView style={{ flex: 1 }}>
              {times ? times.map((time, index) => (
                  <View key={index}>
                    {/* Time display */}
                    <Form.Control 
                      label={`${time.startTime.toLocaleTimeString()} – ${time.endTime.toLocaleTimeString()}`}
                      name="taskTime"  
                      labelStyle={styles.label}
                    >
                      {/* Category picker */}
                    <View style={styles.row}>

                      <Form.Select 
                        options={opts}
                        selectedValue={selectedOpt?.value}
                        placeholder="Select Meal Type"
                        onValueChange={(value: any) => {
                          // Update the specific pair in state
                          console.log("Category", value.value)
                          setTitle(value.value);
                          
                        }}
                        style={{ width: '50%' }}
                      />
                      <View style={{ width: '50%', padding: 16 }}>
                        <Button
                          title="Delete"
                          color="#d32f2f"          // red – feel free to change
                          onPress={() => handleDelete(time.id)}
                        />
                        {/* Navigation button */}
                        <Link
                            href={{
                                pathname: '/new-entry',
                                params: { time_id: time.id, startTime: time.startTime.toLocaleString('en-GB', {month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }), endTime: time.endTime.toLocaleString('en-GB', {month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }), title: title }
                            }}
                            asChild
                        >
                            <Button
                            title="Execute"
                            color="#4CAF50"
                            />
                        </Link>

                      </View>
                    </View>
                    </Form.Control>
                  </View>
              )) : (
                <></>
              )}
            </ScrollView>
          </LinearGradient>
            {/* The start/stop button */}
            <TimeLogger
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              onTimesSet={onTimesSet}
            />
        </LinearGradient>
      </View>
      
    </ScreenPrimative>
  );
}

/* ------------------------------------------------------------------ */
/* Styles (feel free to tweak)                                       */
const styles = StyleSheet.create({
  container: { flex: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: '100%',
    margin: 12,
  },
  timeText: { flex: 2, fontSize: 14 },
  picker: { flex: 2, height: 70 },
  
  label: {
    fontSize: 18,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
});
