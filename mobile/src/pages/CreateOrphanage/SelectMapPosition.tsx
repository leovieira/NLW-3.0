import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import MapView, { PROVIDER_GOOGLE, Marker, MapEvent } from "react-native-maps";

import mapMarkerImg from "../../images/map-marker.png";

export default function SelectMapPosition() {
	const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
	const navigation = useNavigation();

	function handleSelectMapPosition(event: MapEvent) {
		setPosition(event.nativeEvent.coordinate);
	}

	function handleNextStep() {
		navigation.navigate("OrphanageData", { position });
	}

	return (
		<View style={styles.container}>
			<MapView
				style={styles.mapStyle}
				provider={PROVIDER_GOOGLE}
				loadingEnabled={true}
				loadingIndicatorColor="#15c3d6"
				initialRegion={{
					latitude: -16.4392272,
					longitude: -51.1138666,
					latitudeDelta: 0.015,
					longitudeDelta: 0.015,
				}}
				onPress={handleSelectMapPosition}
			>
				{position.latitude !== 0 && position.longitude !== 0 ? (
					<Marker
						icon={mapMarkerImg}
						coordinate={{
							latitude: position.latitude,
							longitude: position.longitude,
						}}
					/>
				) : null}
			</MapView>

			{position.latitude !== 0 && position.longitude !== 0 ? (
				<RectButton style={styles.nextButton} onPress={handleNextStep}>
					<Text style={styles.nextButtonText}>Próximo</Text>
				</RectButton>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "relative",
	},

	mapStyle: {
		width: "100%",
		height: "100%",
	},

	nextButton: {
		position: "absolute",
		height: 56,
		left: 24,
		right: 24,
		bottom: 32,
		borderRadius: 20,
		backgroundColor: "#15c3d6",
		alignItems: "center",
		justifyContent: "center",
	},

	nextButtonText: {
		fontFamily: "Nunito_800ExtraBold",
		fontSize: 16,
		color: "#FFF",
	},
});
