import React from "react";
import { useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import mapMarkerImg from "../images/map-marker.svg";

import "../styles/components/sidebar.css";

export default function Sidebar() {
	const history = useHistory();

	function handleBack() {
		history.push("/app");
	}

	return (
		<aside className="app-sidebar">
			<img src={mapMarkerImg} alt="Happy" />

			<footer>
				<button type="button" onClick={handleBack}>
					<FiArrowLeft size={24} color="#fff" />
				</button>
			</footer>
		</aside>
	);
}
