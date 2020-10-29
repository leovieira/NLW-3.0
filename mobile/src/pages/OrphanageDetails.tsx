import React, { useState, useEffect } from "react";
import {
	Image,
	View,
	ScrollView,
	Text,
	StyleSheet,
	Dimensions,
	Linking,
	ActivityIndicator,
} from "react-native";
import Swiper from "react-native-swiper";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";

import api from "../services/api";

import mapMarkerImg from "../images/map-marker.png";

interface OrphanageDetailsRouteParams {
	id: number;
}

interface Orphanage {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	about: string;
	instructions: string;
	whatsapp: string;
	opening_hours: string;
	open_on_weekends: boolean;
	images: Array<{
		id: number;
		url: string;
	}>;
}

export default function OrphanageDetails() {
	const route = useRoute();

	const params = route.params as OrphanageDetailsRouteParams;

	const [orphanage, setOrphanage] = useState<Orphanage>();

	useEffect(() => {
		api.get(`orphanages/${params.id}`).then((response) => {
			setOrphanage(response.data);
		});
	}, [params.id]);

	if (!orphanage) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size={50} color="#15b6d6" />
			</View>
		);
	}

	function handleOpenGoogleMapsRoutes() {
		if (orphanage) {
			Linking.openURL(
				`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage?.longitude}`
			);
		}
	}

	function handleWhatsapp() {
		if (orphanage) {
			let whatsappOnlyNumbers = orphanage.whatsapp.replace("(", "");
			whatsappOnlyNumbers = whatsappOnlyNumbers.replace(")", "");
			whatsappOnlyNumbers = whatsappOnlyNumbers.replace("-", "");
			whatsappOnlyNumbers = whatsappOnlyNumbers.replace(" ", "");

			let message = "Olá, desejo visitar o orfanano!";
			let messageConverted = message.replace(" ", "%20");

			Linking.openURL(
				`whatsapp://send?phone=55${whatsappOnlyNumbers}&text=${messageConverted}`
			);
		}
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.imagesContainer}>
				<Swiper
					showsButtons={orphanage.images.length > 1 ? true : false}
					autoplay={true}
					dotStyle={styles.swiperDot}
					activeDotStyle={styles.swiperActiveDot}
					nextButton={<Text style={styles.swiperButtonText}>›</Text>}
					prevButton={<Text style={styles.swiperButtonText}>‹</Text>}
				>
					{orphanage.images.map((image) => {
						return (
							<Image
								key={image.id}
								style={styles.image}
								source={{
									uri: image.url,
								}}
							/>
						);
					})}
				</Swiper>
			</View>

			<View style={styles.detailsContainer}>
				<Text style={styles.title}>{orphanage.name}</Text>
				<Text style={styles.description}>{orphanage.about}</Text>

				<View style={styles.mapContainer}>
					<MapView
						style={styles.mapStyle}
						provider={PROVIDER_GOOGLE}
						loadingEnabled={true}
						loadingIndicatorColor="#15c3d6"
						zoomEnabled={false}
						pitchEnabled={false}
						scrollEnabled={false}
						rotateEnabled={false}
						initialRegion={{
							latitude: orphanage.latitude,
							longitude: orphanage.longitude,
							latitudeDelta: 0.008,
							longitudeDelta: 0.008,
						}}
					>
						<Marker
							icon={mapMarkerImg}
							coordinate={{
								latitude: orphanage.latitude,
								longitude: orphanage.longitude,
							}}
						/>
					</MapView>

					<RectButton
						onPress={handleOpenGoogleMapsRoutes}
						style={styles.routesContainer}
					>
						<Text style={styles.routesText}>Ver rotas no Google Maps</Text>
					</RectButton>
				</View>

				<View style={styles.separator} />

				<Text style={styles.title}>Instruções para visita</Text>
				<Text style={styles.description}>{orphanage.instructions}</Text>

				<View style={styles.scheduleContainer}>
					<View style={[styles.scheduleItem, styles.scheduleItemBlue]}>
						<Feather name="clock" size={40} color="#2ab5d1" />
						<Text style={[styles.scheduleText, styles.scheduleTextBlue]}>
							Segunda à sexta {orphanage.opening_hours}
						</Text>
					</View>

					{orphanage.open_on_weekends ? (
						<View style={[styles.scheduleItem, styles.scheduleItemGreen]}>
							<Feather name="info" size={40} color="#39cc83" />
							<Text style={[styles.scheduleText, styles.scheduleTextGreen]}>
								Atendemos fim de semana
							</Text>
						</View>
					) : (
						<View style={[styles.scheduleItem, styles.scheduleItemRed]}>
							<Feather name="info" size={40} color="#ff669d" />
							<Text style={[styles.scheduleText, styles.scheduleTextRed]}>
								Não atendemos fim de semana
							</Text>
						</View>
					)}
				</View>

				<RectButton style={styles.contactButton} onPress={handleWhatsapp}>
					<FontAwesome name="whatsapp" size={24} color="#fff" />
					<Text style={styles.contactButtonText}>Entrar em contato</Text>
				</RectButton>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},

	container: {
		flex: 1,
	},

	imagesContainer: {
		height: 240,
	},

	image: {
		width: Dimensions.get("window").width,
		height: 240,
		resizeMode: "cover",
	},

	swiperDot: {
		width: 14,
		height: 14,
		borderRadius: 7,
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "#15c3d6",
		backgroundColor: "#fff",
	},

	swiperActiveDot: {
		width: 14,
		height: 14,
		borderRadius: 7,
		backgroundColor: "#15c3d6",
	},

	swiperButtonText: {
		fontSize: 50,
		color: "#15c3d6",
	},

	detailsContainer: {
		padding: 24,
	},

	title: {
		color: "#4d6f80",
		fontSize: 30,
		fontFamily: "Nunito_700Bold",
	},

	description: {
		fontFamily: "Nunito_600SemiBold",
		color: "#5c8599",
		lineHeight: 24,
		marginTop: 16,
	},

	mapContainer: {
		borderRadius: 20,
		overflow: "hidden",
		borderWidth: 1.2,
		borderColor: "#b3dae2",
		marginTop: 40,
		backgroundColor: "#e6f7fb",
	},

	mapStyle: {
		width: "100%",
		height: 150,
	},

	routesContainer: {
		padding: 16,
		alignItems: "center",
		justifyContent: "center",
	},

	routesText: {
		fontFamily: "Nunito_700Bold",
		color: "#0089a5",
	},

	separator: {
		height: 0.8,
		width: "100%",
		backgroundColor: "#d3e2e6",
		marginVertical: 40,
	},

	scheduleContainer: {
		marginTop: 24,
		flexDirection: "row",
		justifyContent: "space-between",
	},

	scheduleItem: {
		width: "48%",
		padding: 20,
	},

	scheduleItemBlue: {
		backgroundColor: "#e6f7fb",
		borderWidth: 1,
		borderColor: "#b3dae2",
		borderRadius: 20,
	},

	scheduleItemGreen: {
		backgroundColor: "#edfff6",
		borderWidth: 1,
		borderColor: "#a1e9c5",
		borderRadius: 20,
	},

	scheduleItemRed: {
		backgroundColor: "#fef6f9",
		borderWidth: 1,
		borderColor: "#ffbcd4",
		borderRadius: 20,
	},

	scheduleText: {
		fontFamily: "Nunito_600SemiBold",
		fontSize: 16,
		lineHeight: 24,
		marginTop: 20,
	},

	scheduleTextBlue: {
		color: "#5c8599",
	},

	scheduleTextGreen: {
		color: "#37c77f",
	},

	scheduleTextRed: {
		color: "#ff669d",
	},

	contactButton: {
		backgroundColor: "#3cdc8c",
		borderRadius: 20,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		height: 56,
		marginTop: 40,
	},

	contactButtonText: {
		fontFamily: "Nunito_800ExtraBold",
		color: "#fff",
		fontSize: 16,
		marginLeft: 16,
	},
});
