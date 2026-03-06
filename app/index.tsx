import { ScreenPrimative } from "@/components/screen-primative";
import { Shades } from "@/config/LightTheme";
import { colors } from "@/config/theme";
import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";

export default function HomeScreen() {
	const window = useWindowDimensions()
    const { dark, colors, fonts } = useTheme()
    const shades = Shades
  

	return(
		<ScreenPrimative edges={['top']}>
			<View style={styles.container}>
				
				<View style={{ width: '100%', height: 'auto', margin: 42, alignItems: 'center', backgroundColor: shades['color-neutral-400'], padding: 16 }}> 
					<Image source={require("../assets/images/android/res/mipmap-hdpi/ic_launcher_foreground.png")}
						style={{ width: window.width/1.5, height: window.width/3  }}
					/>
				</View>
				<View style={{ backgroundColor: shades['color-neutral-400'], marginVertical: window.height/5, width: window.width, height: window.height/5, justifyContent: 'space-around', alignItems: 'center',  }}>
					<Link href={'/new-meal-time'} asChild>
						<TouchableOpacity>
							<Text style={{ color: shades['color-neutral-100'], textShadowColor: shades['color-neutral-900'], textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2, fontSize: 24, padding: 16 }}>
								New Meal Entry 
							</Text>
						</TouchableOpacity>
					</Link>
					<Link href={'/journal-entries'} asChild>
						<TouchableOpacity>
							<Text style={{ color: shades['color-neutral-100'], textShadowColor: shades['color-neutral-900'], textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2, fontSize: 24, padding: 16 }}>
								Journal Entries
							</Text>
						</TouchableOpacity>
					</Link>
				</View>
			</View>
		</ScreenPrimative>

	)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		alignItems: 'center',
		// padding: 16
		// justifyContent: 'center',
	},
	title: {
		color: colors.primary,
		fontSize: 44,
		fontWeight: 'bold',
	}
});
