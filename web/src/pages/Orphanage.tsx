import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import Leaflet from "leaflet";

import api from "../services/api";

import Sidebar from "../components/Sidebar";

import mapMarkerImg from "../images/map-marker.svg";

import "../styles/pages/orphanage.css";

import spinner from "../images/spinner.gif";

const happyMapIcon = Leaflet.icon({
	iconUrl: mapMarkerImg,
	iconSize: [58, 68],
	iconAnchor: [29, 68],
});

interface RouteParams {
	id: string;
}

interface OrphanageData {
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

function Orphanage() {
	const params = useParams<RouteParams>();
	const [orphanage, setOrphanage] = useState<OrphanageData>();
	const [activeImageIndex, setActiveImageIndex] = useState(0);

	useEffect(() => {
		api.get(`orphanages/${params.id}`).then((response) => {
			setOrphanage(response.data);
		});
	}, [params.id]);

	function handleWhatsapp() {
		if (orphanage) {
			let whatsappOnlyNumbers = orphanage.whatsapp.replace("(", "");
			whatsappOnlyNumbers = whatsappOnlyNumbers.replace(")", "");
			whatsappOnlyNumbers = whatsappOnlyNumbers.replace("-", "");
			whatsappOnlyNumbers = whatsappOnlyNumbers.replace(" ", "");

			let message = "Olá, desejo visitar o orfanano!";
			let messageConverted = message.replace(" ", "%20");

			window.open(
				`https://api.whatsapp.com/send?phone=55${whatsappOnlyNumbers}&text=${messageConverted}`,
				"_blank",
				"noopener noreferrer"
			);
		}
	}

	return (
		<div id="page-orphanage">
			<Sidebar />

			{!orphanage ? (
				<div className="spinner-container">
					<img src={spinner} alt="Carregando..." />
				</div>
			) : (
				<main>
					<div className="orphanage-details">
						<img
							src={orphanage.images[activeImageIndex].url}
							alt={orphanage.name}
						/>

						<div className="images">
							{orphanage.images.map((image, index) => {
								return (
									<button
										key={image.id}
										className={activeImageIndex === index ? "active" : ""}
										type="button"
										onClick={() => {
											setActiveImageIndex(index);
										}}
									>
										<img src={image.url} alt={orphanage.name} />
									</button>
								);
							})}
						</div>

						<div className="orphanage-details-content">
							<h1>{orphanage.name}</h1>
							<p>{orphanage.about}</p>

							<div className="map-container">
								<Map
									center={[orphanage.latitude, orphanage.longitude]}
									zoom={16}
									style={{ width: "100%", height: 280 }}
									dragging={false}
									touchZoom={false}
									zoomControl={false}
									scrollWheelZoom={false}
									doubleClickZoom={false}
								>
									<TileLayer
										url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
									/>
									<Marker
										interactive={false}
										icon={happyMapIcon}
										position={[orphanage.latitude, orphanage.longitude]}
									/>
								</Map>

								<footer>
									{/*<a
										href={`https://www.google.com/maps/place/${orphanage.latitude},${orphanage.longitude}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										Ver rotas no Google Maps
									</a>*/}

									<a
										href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										Ver rotas no Google Maps
									</a>
								</footer>
							</div>

							<hr />

							<h2>Instruções para visita</h2>
							<p>{orphanage.instructions}</p>

							<div className="open-details">
								<div className="hour">
									<FiClock size={32} color="#15b6d6" />
									Segunda à sexta {orphanage.opening_hours}
								</div>

								{orphanage.open_on_weekends ? (
									<div className="open-on-weekends">
										<FiInfo size={32} color="#39cc83" />
										Atendemos <br />
										fim de semana
									</div>
								) : (
									<div className="open-on-weekends dont-open">
										<FiInfo size={32} color="#ff669d" />
										Não atendemos <br />
										fim de semana
									</div>
								)}
							</div>

							<button
								type="button"
								className="contact-button"
								onClick={handleWhatsapp}
							>
								<FaWhatsapp size={20} color="#fff" />
								Entrar em contato
							</button>
						</div>
					</div>
				</main>
			)}
		</div>
	);
}

export default Orphanage;
