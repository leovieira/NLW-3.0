import React, { useState, ChangeEvent, FormEvent } from "react";
import { useHistory } from "react-router-dom";
import { Map, Marker, TileLayer } from "react-leaflet";
import Leaflet, { LeafletMouseEvent } from "leaflet";
import { FiPlus } from "react-icons/fi";

import Sidebar from "../components/Sidebar";

import mapMarkerImg from "../images/map-marker.svg";

import "../styles/pages/create-orphanage.css";

import api from "../services/api";

const happyMapIcon = Leaflet.icon({
	iconUrl: mapMarkerImg,
	iconSize: [58, 68],
	iconAnchor: [29, 68],
});

export default function CreateOrphanage() {
	const history = useHistory();

	const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
	const [name, setName] = useState("");
	const [about, setAbout] = useState("");
	const [instructions, setInstructions] = useState("");
	const [opening_hours, setOpeningHours] = useState("");
	const [open_on_weekends, setOpenOnWeekends] = useState(true);
	const [images, setImages] = useState<File[]>([]);
	const [previewImages, setPreviewImages] = useState<string[]>([]);

	function handleMapClick(event: LeafletMouseEvent) {
		const { lat, lng } = event.latlng;

		setPosition({
			latitude: lat,
			longitude: lng,
		});
	}

	function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
		if (!event.target.files) {
			return;
		}

		const selectedImages = Array.from(event.target.files);

		setImages(selectedImages);

		const selectedImagesPreview = selectedImages.map((image) => {
			return URL.createObjectURL(image);
		});

		setPreviewImages(selectedImagesPreview);
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		const { latitude, longitude } = position;

		const data = new FormData();

		data.append("name", name);
		data.append("about", about);
		data.append("latitude", String(latitude));
		data.append("longitude", String(longitude));
		data.append("instructions", instructions);
		data.append("opening_hours", opening_hours);
		data.append("open_on_weekends", String(open_on_weekends));

		images.forEach((image) => {
			data.append("images", image);
		});

		await api.post("orphanages", data);

		alert("Cadastro realizado com sucesso!");

		history.push("/app");
	}

	return (
		<div id="page-create-orphanage">
			<Sidebar />

			<main>
				<form onSubmit={handleSubmit} className="create-orphanage-form">
					<fieldset>
						<legend>Dados</legend>

						<Map
							center={[-16.4392272, -51.1138666]}
							style={{ width: "100%", height: 280 }}
							zoom={15}
							onclick={handleMapClick}
						>
							<TileLayer
								url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
							/>

							{position.latitude !== 0 && position.longitude !== 0 ? (
								<Marker
									interactive={false}
									icon={happyMapIcon}
									position={[position.latitude, position.longitude]}
								/>
							) : null}
						</Map>

						<div className="input-block">
							<label htmlFor="name">Nome</label>
							<input
								id="name"
								value={name}
								onChange={(event) => setName(event.target.value)}
							/>
						</div>

						<div className="input-block">
							<label htmlFor="about">
								Sobre <span>Máximo de 300 caracteres</span>
							</label>
							<textarea
								id="about"
								maxLength={300}
								value={about}
								onChange={(event) => setAbout(event.target.value)}
							/>
						</div>

						<div className="input-block">
							<label htmlFor="images">Fotos</label>

							<div className="images-container">
								{previewImages.map((image) => {
									return <img key={image} src={image} alt={name} />;
								})}

								<label htmlFor="image[]" className="new-image">
									<FiPlus size={24} color="#15b6d6" />
								</label>
								<input
									type="file"
									id="image[]"
									multiple
									onChange={handleSelectImages}
								/>
							</div>
						</div>
					</fieldset>

					<fieldset>
						<legend>Visitação</legend>

						<div className="input-block">
							<label htmlFor="instructions">Instruções</label>
							<textarea
								id="instructions"
								value={instructions}
								onChange={(event) => setInstructions(event.target.value)}
							/>
						</div>

						<div className="input-block">
							<label htmlFor="opening_hours">Horário das visitas</label>
							<input
								id="opening_hours"
								value={opening_hours}
								onChange={(event) => setOpeningHours(event.target.value)}
							/>
						</div>

						<div className="input-block">
							<label htmlFor="open_on_weekends">Atende fim de semana</label>

							<div className="button-select">
								<button
									type="button"
									className={open_on_weekends ? "active" : ""}
									onClick={() => setOpenOnWeekends(true)}
								>
									Sim
								</button>
								<button
									type="button"
									className={!open_on_weekends ? "active" : ""}
									onClick={() => setOpenOnWeekends(false)}
								>
									Não
								</button>
							</div>
						</div>
					</fieldset>

					<button className="confirm-button" type="submit">
						Confirmar
					</button>
				</form>
			</main>
		</div>
	);
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;