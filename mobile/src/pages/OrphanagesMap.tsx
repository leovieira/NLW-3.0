import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";

import api from "../services/api";

import mapMarker from "../images/map-marker.png";

interface Orphanage {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
}

export default function OrphanagesMap() {
	const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

	const navigation = useNavigation();

	useFocusEffect(() => {
		api.get("orphanages").then((response) => {
			setOrphanages(response.data);
		});
	});

	function handleNavigateToOrphanageDetails(id: number) {
		navigation.navigate("OrphanageDetails", { id });
	}

	function handleNavigateToCreateOrphanage() {
		navigation.navigate("SelectMapPosition");
	}

	return (
		<View style={styles.container}>
			<MapView
				style={styles.map}
				provider={PROVIDER_GOOGLE}
				loadingEnabled={true}
				loadingIndicatorColor="#15c3d6"
				initialRegion={{
					latitude: -16.4392272,
					longitude: -51.1138666,
					latitudeDelta: 0.015,
					longitudeDelta: 0.015,
				}}
			>
				{orphanages.map((orphanage) => {
					return (
						<Marker
							key={orphanage.id}
							icon={mapMarker}
							calloutAnchor={{
								x: 2.8,
								y: 0.79,
							}}
							coordinate={{
								latitude: orphanage.latitude,
								longitude: orphanage.longitude,
							}}
						>
							<Callout
								tooltip={true}
								onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}
							>
								<View style={styles.calloutContainer}>
									<Text style={styles.calloutText}>{orphanage.name}</Text>

									<View style={styles.calloutIconContainer}>
										<Feather name="arrow-right" size={20} color="#15c3d6" />
									</View>
								</View>
							</Callout>
						</Marker>
					);
				})}
			</MapView>

			<View style={styles.footer}>
				<Text style={styles.footerText}>
					{orphanages.length} orfanatos encontrados
				</Text>

				<RectButton
					style={styles.createOrphanageButton}
					onPress={handleNavigateToCreateOrphanage}
				>
					<Feather name="plus" size={20} color="#fff" />
				</RectButton>
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
		width: 185,
		minHeight: 46,
		paddingVertical: 12,
		paddingLeft: 20,
		paddingRight: 25,
		backgroundColor: "#fff",
		borderRadius: 16,
		flexDirection: "row",
		justifyContent: "space-between",
	},

	calloutText: {
		width: "90%",
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
