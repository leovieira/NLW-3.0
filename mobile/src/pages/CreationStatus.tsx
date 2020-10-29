import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";

interface CreationStatusRouteParams {
	error: boolean;
	msg: string;
	redirect: string;
	counter: number;
}

export default function CreationStatus() {
	const route = useRoute();
	const navigation = useNavigation();

	const routeParams = route.params as CreationStatusRouteParams;

	const [params, setParams] = useState<CreationStatusRouteParams>({
		error: true,
		msg: "Oops... algo deu errado!",
		redirect: "OrphanageData",
		counter: 5,
	});

	const [redirect, setRedirect] = useState({
		enabled: false,
		counter: 0,
	});

	useEffect(() => {
		setParams({ ...routeParams });
		setRedirect({ enabled: true, counter: routeParams.counter });
	}, [routeParams]);

	useEffect(() => {
		if (redirect.enabled) {
			let interval = setInterval(() => {
				setRedirect({ ...redirect, counter: redirect.counter - 1 });
			}, 1000);

			if (redirect.counter === 0) {
				clearInterval(interval);
				setRedirect({ enabled: false, counter: 0 });
				navigation.navigate(params.redirect);
			}

			return () => clearInterval(interval);
		}
	}, [redirect, params]);

	return (
		<View style={styles.container}>
			{params.error ? (
				<Feather name="x-circle" size={50} color="#fff" />
			) : (
				<Feather name="check-circle" size={50} color="#fff" />
			)}

			<Text style={styles.msgText}>{params.msg}</Text>
			<Text style={styles.redirect}>
				Redirecionando em ({redirect.counter}) segundos...
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		backgroundColor: "#15c3d6",
		alignItems: "center",
		justifyContent: "center",
	},

	msgText: {
		marginTop: 20,
		fontFamily: "Nunito_700Bold",
		fontSize: 20,
		color: "#fff",
	},

	redirect: {
		position: "absolute",
		bottom: 20,
		fontFamily: "Nunito_600SemiBold",
		fontSize: 16,
		color: "#fff",
	},
});
