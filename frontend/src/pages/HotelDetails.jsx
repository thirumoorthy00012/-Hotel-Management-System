import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Helmet } from "react-helmet-async";

function HotelDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userLocation, setUserLocation] = useState(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await fetch(
                    `https://hotel-management-system-1qjl.onrender.com/api/hotels/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Hotel not found");
                }

                setHotel(data.hotel);
                setImageError(false);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHotel();
    }, [id]);

    const getUserLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            () => {
                alert(
                    "Unable to get your current location. Please allow location permission."
                );
            }
        );
    };

    if (loading) {
        return <p className="details-message">Loading hotel...</p>;
    }

    if (error) {
        return (
            <div className="details-message">
                <p className="error-message">{error}</p>
                <button onClick={() => navigate("/")}>
                    Back to Hotels
                </button>
            </div>
        );
    }

    if (!hotel) {
        return <p className="details-message">Hotel not found.</p>;
    }

    const latitude = Number(hotel.latitude);
    const longitude = Number(hotel.longitude);

    const imageUrl = hotel.image
        ? hotel.image.startsWith("http")
            ? hotel.image
            : `https://hotel-management-system-1qjl.onrender.com/uploads/${hotel.image}`
        : null;

    return (
        <div className="hotel-details-page">
            <Helmet>
                <title>{hotel.title} | Hotel Management</title>
                <meta
                    name="description"
                    content={hotel.description || `Details for ${hotel.title}`}
                />
            </Helmet>

            <button
                className="back-btn"
                onClick={() => navigate("/")}
            >
                ← Back to Hotels
            </button>

            <h1>{hotel.title}</h1>

            {imageUrl && !imageError ? (
                <img
                    className="details-image"
                    src={imageUrl}
                    alt={hotel.title}
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="details-no-image">
                    No Image Available
                </div>
            )}

            <div className="details-content">
                <h2>{hotel.title}</h2>

                <p className="details-price">
                    ₹{Number(hotel.price).toFixed(2)}
                </p>

                <p className="details-description">
                    {hotel.description}
                </p>

                <div className="coordinates">
                    <p>
                        <strong>Latitude:</strong> {hotel.latitude}
                    </p>

                    <p>
                        <strong>Longitude:</strong> {hotel.longitude}
                    </p>
                </div>
            </div>

            <div className="map-section">
                <h2>Hotel Location</h2>

                <button
                    className="location-btn"
                    onClick={getUserLocation}
                >
                    Get My Current Location
                </button>

                <MapContainer
                    center={[latitude, longitude]}
                    zoom={13}
                    scrollWheelZoom={true}
                    className="hotel-map"
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <CircleMarker
                        center={[latitude, longitude]}
                        radius={12}
                    >
                        <Popup>
                            <strong>{hotel.title}</strong>
                            <br />
                            Hotel Location
                        </Popup>
                    </CircleMarker>

                    {userLocation && (
                        <CircleMarker
                            center={[
                                userLocation.latitude,
                                userLocation.longitude
                            ]}
                            radius={10}
                        >
                            <Popup>Your Current Location</Popup>
                        </CircleMarker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}

export default HotelDetails;