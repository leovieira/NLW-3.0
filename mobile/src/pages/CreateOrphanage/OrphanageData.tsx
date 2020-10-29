import React, { useState, useEffect } from "react";
import {
	ScrollView,
	View,
	StyleSheet,
	Switch,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	ActivityIndicator,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { Feather } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import api from "../../services/api";

interface OrphanageDataRouteParams {
	position: {
		latitude: number;
		longitude: number;
	};
}

export default function OrphanageData() {
	const scrollViewRef = React.useRef(null) as any;

	const [name, setName] = useState("");
	const [about, setAbout] = useState("");
	const [instructions, setInstructions] = useState("");
	const [whatsapp, setWhatsapp] = useState("");
	const [opening_hours, setOpeningHour] = useState("");
	const [open_on_weekends, setOpenOnWeekends] = useState(true);
	const [images, setImages] = useState<string[]>([]);

	const [formError, setFormError] = useState({ status: false, msg: "" });
	const [loading, setLoading] = useState({ enabled: false });

	const navigation = useNavigation();
	const route = useRoute();

	const params = route.params as OrphanageDataRouteParams;

	useEffect(() => {
		if (formError.status) {
			scrollViewRef.current.scrollToEnd({ animated: true });
		}
	}, [formError]);

	function showMsg(
		error: boolean,
		msg: string,
		redirect: string,
		counter: number
	) {
		navigation.navigate("CreationStatus", {
			error,
			msg,
			redirect,
			counter,
		});
	}

	async function handleSelectImages() {
		const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

		if (status !== "granted") {
			alert("Eita, precisamos de acesso às suas fotos...");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1,
		});

		if (result.cancelled) {
			return;
		}

		const { uri: image } = result;

		setImages([...images, image]);
	}

	function handleRemoveImage(index: number) {
		images.splice(index, 1);
		setImages([...images]);
	}

	async function handleCreateOrphanage() {
		const { latitude, longitude } = params.position;

		if (
			name !== "" &&
			about !== "" &&
			latitude !== 0 &&
			longitude !== 0 &&
			instructions !== "" &&
			whatsapp !== "" &&
			opening_hours !== "" &&
			images.length !== 0
		) {
			const data = new FormData();

			data.append("name", name);
			data.append("about", about);
			data.append("latitude", String(latitude));
			data.append("longitude", String(longitude));
			data.append("instructions", instructions);
			data.append("whatsapp", whatsapp);
			data.append("opening_hours", opening_hours);
			data.append("open_on_weekends", String(open_on_weekends));

			images.forEach((image, index) => {
				data.append("images", {
					name: `image_${index}.jpg`,
					type: "image/jpg",
					uri: image,
				} as any);
			});

			setLoading({ enabled: true });

			await api
				.post("orphanages", data)
				.then((response) => {
					setLoading({ enabled: false });

					if (response.status === 201) {
						showMsg(false, "Orfanato criado com sucesso!", "OrphanagesMap", 5);
					} else {
						showMsg(true, "Oops... algo deu errado!", "OrphanageData", 5);
					}
				})
				.catch((error) => {
					setLoading({ enabled: false });
					showMsg(true, "Oops... algo deu errado!", "OrphanageData", 5);
				});
		} else {
			setFormError({ status: true, msg: "*Preencha todos os campos!" });
		}
	}

	return (
		<View style={styles.container}>
			{loading.enabled && (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size={50} color="#15b6d6" />
				</View>
			)}

			<ScrollView ref={scrollViewRef} contentContainerStyle={{ padding: 24 }}>
				<Text style={styles.title}>Dados</Text>

				<Text style={styles.label}>Nome</Text>
				<TextInput
					style={styles.input}
					value={name}
					onChangeText={(text) => setName(text)}
				/>

				<Text style={styles.label}>Sobre</Text>
				<TextInput
					style={[styles.input, { height: 110 }]}
					multiline
					value={about}
					onChangeText={(text) => setAbout(text)}
				/>

				<Text style={styles.label}>Fotos</Text>
				<ScrollView horizontal style={styles.uploadedImagesContainer}>
					{images.map((image, index) => {
						return (
							<View key={index} style={styles.uploadedImageContainer}>
								<Image source={{ uri: image }} style={styles.uploadedImage} />
								<TouchableOpacity
									style={styles.removeImageButton}
									activeOpacity={0.8}
									onPress={() => {
										handleRemoveImage(index);
									}}
								>
									<Feather name="x" size={24} color="#ff669d" />
								</TouchableOpacity>
							</View>
						);
					})}
				</ScrollView>

				<TouchableOpacity
					style={styles.imagesInput}
					onPress={handleSelectImages}
				>
					<Feather name="plus" size={24} color="#15b6d6" />
				</TouchableOpacity>

				<Text style={styles.title}>Visitação</Text>

				<Text style={styles.label}>Instruções</Text>
				<TextInput
					style={[styles.input, { height: 110 }]}
					multiline
					value={instructions}
					onChangeText={(text) => setInstructions(text)}
				/>

				<Text style={styles.label}>Whatsapp</Text>
				<TextInputMask
					style={styles.input}
					keyboardType="numeric"
					type={"cel-phone"}
					options={{
						maskType: "BRL",
						withDDD: true,
						dddMask: "(99) ",
					}}
					placeholder="(   ) _____-____"
					value={whatsapp}
					onChangeText={(text) => setWhatsapp(text)}
				/>

				<Text style={styles.label}>Horário de visitas</Text>
				<TextInput
					style={styles.input}
					value={opening_hours}
					onChangeText={(text) => setOpeningHour(text)}
				/>

				<View style={styles.switchContainer}>
					<Text style={styles.label}>Atende final de semana?</Text>
					<Switch
						thumbColor="#fff"
						trackColor={{ false: "#ccc", true: "#39cc83" }}
						value={open_on_weekends}
						onValueChange={setOpenOnWeekends}
					/>
				</View>

				<RectButton style={styles.nextButton} onPress={handleCreateOrphanage}>
					<Text style={styles.nextButtonText}>Cadastrar</Text>
				</RectButton>

				{formError.status && (
					<Text style={styles.errorMsg}>{formError.msg}</Text>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	loadingContainer: {
		position: "absolute",
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(1, 1, 1, 0.2)",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 1,
	},

	title: {
		color: "#5c8599",
		fontSize: 24,
		fontFamily: "Nunito_700Bold",
		marginBottom: 32,
		paddingBottom: 24,
		borderBottomWidth: 0.8,
		borderBottomColor: "#d3e2e6",
	},

	label: {
		color: "#8fa7b3",
		fontFamily: "Nunito_600SemiBold",
		marginBottom: 8,
	},

	comment: {
		fontSize: 11,
		color: "#8fa7b3",
	},

	input: {
		backgroundColor: "#fff",
		borderWidth: 1.4,
		borderColor: "#d3e2e6",
		borderRadius: 20,
		height: 56,
		paddingVertical: 18,
		paddingHorizontal: 24,
		marginBottom: 16,
		textAlignVertical: "top",
	},

	uploadedImagesContainer: {
		marginBottom: 32,
		paddingBottom: 10,
	},

	uploadedImageContainer: {
		width: 80,
		height: 80,
		marginRight: 8,
	},

	uploadedImage: {
		width: "100%",
		height: "100%",
		borderRadius: 20,
	},

	removeImageButton: {
		width: 40,
		height: 30,
		position: "absolute",
		top: 0,
		right: 0,
		borderStyle: "solid",
		borderWidth: 2,
		borderColor: "#ff669d",
		borderTopRightRadius: 20,
		borderBottomLeftRadius: 20,
		backgroundColor: "#ffe0ec",
		alignItems: "center",
		justifyContent: "center",
	},

	imagesInput: {
		backgroundColor: "rgba(255, 255, 255, 0.5)",
		borderStyle: "dashed",
		borderColor: "#96d2f0",
		borderWidth: 1.4,
		borderRadius: 20,
		height: 56,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 32,
	},

	switchContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 16,
	},

	nextButton: {
		backgroundColor: "#15c3d6",
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		height: 56,
		marginTop: 32,
	},

	nextButtonText: {
		fontFamily: "Nunito_800ExtraBold",
		fontSize: 16,
		color: "#fff",
	},

	errorMsg: {
		marginTop: 22,
		fontSize: 16,
		color: "#ff669d",
	},
});
