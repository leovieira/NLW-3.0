import React from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import mapMarker from "../images/map-marker.png";

export default function OrphanagesMap() {
	const navigation = useNavigation();

	function handleNavigateToOrphanageDetails() {
		navigation.navigate("OrphanageDetails");
	}

	return (
		<View style={styles.container}>
			<MapView
				style={styles.map}
				provider={PROVIDER_GOOGLE}
				initialRegion={{
					latitude: -16.4392272,
					longitude: -51.1138666,
					latitudeDelta: 0.008,
					longitudeDelta: 0.008,
				}}
			>
				<Marker
					icon={mapMarker}
					calloutAnchor={{
						x: 2.7,
						y: 0.79,
					}}
					coordinate={{
						latitude: -16.4392272,
						longitude: -51.1138666,
					}}
				>
					<Callout tooltip={true} onPress={handleNavigateToOrphanageDetails}>
						<View style={styles.calloutContainer}>
							<Text style={styles.calloutText}>Lar das meninas</Text>

							<View style={styles.calloutIconContainer}>
								<Feather name="arrow-right" size={20} color="#15c3d6" />
							</View>
						</View>
					</Callout>
				</Marker>
			</MapView>

			<View style={styles.footer}>
				<Text style={styles.footerText}>2 orfanatos encontrados</Text>

				<TouchableHighlight
					style={styles.createOrphanageButton}
					onPress={() => {}}
				>
					<Feather name="plus" size={20} color="#fff" />
				</TouchableHighlight>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	map: {
		width: "100%",
		height: "100%",
	},

	calloutContainer: {
		width: 180,
		minHeight: 46,
		paddingVertical: 12,
		paddingHorizontal: 25,
		backgroundColor: "#fff",
		borderRadius: 16,
		flexDirection: "row",
		justifyContent: "center",
	},

	calloutText: {
		marginRight: 8,
		fontFamily: "Nunito_700Bold",
		fontSize: 14,
		color: "#15c3d6",
	},

	calloutIconContainer: {
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},

	footer: {
		position: "absolute",
		height: 56,
		left: 24,
		right: 24,
		bottom: 32,
		borderRadius: 20,
		paddingLeft: 24,
		backgroundColor: "#fff",
		elevation: 3,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	footerText: {
		fontFamily: "Nunito_700Bold",
		color: "#8fa7b3",
	},

	createOrphanageButton: {
		width: 56,
		height: 56,
		backgroundColor: "#15c3d6",
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
});
