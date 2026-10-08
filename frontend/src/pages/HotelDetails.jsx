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

    const [userLocation, setUserLocation] =
        useState(null);


    // =================================
    // GET HOTEL
    // =================================

    useEffect(() => {

        const fetchHotel = async () => {

            try {

                const response = await fetch(
                    `https://hotel-management-system-1qjl.onrender.com/api/hotels/${id}`
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Hotel not found"
                    );

                }


                setHotel(data.hotel);


            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);

            }

        };


        fetchHotel();

    }, [id]);



    // =================================
    // GET USER LOCATION
    // =================================

    const getUserLocation = () => {

        if (!navigator.geolocation) {

            alert(
                "Geolocation is not supported by your browser."
            );

            return;
        }


        navigator.geolocation.getCurrentPosition(

            (position) => {

                setUserLocation({

                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude

                });

            },


            (error) => {

                console.error(
                    "Geolocation error:",
                    error
                );


                alert(
                    "Unable to get your current location. Please allow location permission."
                );

            }

        );

    };



    // =================================
    // LOADING
    // =================================

    if (loading) {

        return (

            <p className="details-message">

                Loading hotel...

            </p>

        );

    }



    // =================================
    // ERROR
    // =================================

    if (error) {

        return (

            <div className="details-message">

                <p className="error-message">

                    {error}

                </p>


                <button
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Back to Hotels
                </button>

            </div>

        );

    }



    // =================================
    // HOTEL NOT FOUND
    // =================================

    if (!hotel) {

        return (

            <p className="details-message">

                Hotel not found.

            </p>

        );

    }



    // Convert coordinates to numbers

    const latitude =
        Number(hotel.latitude);

    const longitude =
        Number(hotel.longitude);



    // Hotel image

    const imageUrl = hotel.image
        ? `https://hotel-management-system-1q31.onrender.com/uploads/${hotel.image}`
        : null;



    return (

        <div className="hotel-details-page">


            {/* =========================
                SEO
            ========================== */}

            <Helmet>

                <title>
                    {hotel.title} | Hotel Management 
                </title>


                <meta
                    name="description"
                    content={hotel.description}
                />

            </Helmet>



            {/* =========================
                BACK BUTTON
            ========================== */}

            <button
                className="back-btn"
                onClick={() =>
                    navigate("/")
                }
            >
                ← Back to Hotels
            </button>



            {/* =========================
                HOTEL TITLE
            ========================== */}

            <h1>
                {hotel.title}
            </h1>



            {/* =========================
                HOTEL IMAGE
            ========================== */}

            {imageUrl ? (

                <img
                    className="details-image"
                    src={imageUrl}
                    alt={hotel.title}
                />

            ) : (

                <div className="details-no-image">

                    No Image

                </div>

            )}



            {/* =========================
                HOTEL INFORMATION
            ========================== */}

            <div className="details-content">


                <h2>
                    {hotel.title}
                </h2>


                <p className="details-price">

                    ₹{Number(hotel.price).toFixed(2)}

                </p>


                <p className="details-description">

                    {hotel.description}

                </p>


                <div className="coordinates">

                    <p>

                        <strong>
                            Latitude:
                        </strong>{" "}

                        {hotel.latitude}

                    </p>


                    <p>

                        <strong>
                            Longitude:
                        </strong>{" "}

                        {hotel.longitude}

                    </p>

                </div>

            </div>



            {/* MAP*/}

            <div className="map-section">


                <h2>
                    Hotel Location
                </h2>



                {/* CURRENT LOCATION BUTTON */}

                <button
                    className="location-btn"
                    onClick={
                        getUserLocation
                    }
                >
                    Get My Current Location
                </button>



                {/* MAP */}

                <MapContainer
                    center={[
                        latitude,
                        longitude
                    ]}
                    zoom={13}
                    scrollWheelZoom={true}
                    className="hotel-map"
                >


                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />



                    {/* HOTEL LOCATION */}

                    <CircleMarker
                        center={[
                            latitude,
                            longitude
                        ]}
                        radius={12}
                    >

                        <Popup>

                            <strong>
                                {hotel.title}
                            </strong>

                            <br />

                            Hotel Location

                        </Popup>

                    </CircleMarker>



                    {/* USER LOCATION */}

                    {userLocation && (

                        <CircleMarker
                            center={[
                                userLocation.latitude,
                                userLocation.longitude
                            ]}
                            radius={10}
                        >

                            <Popup>

                                Your Current Location

                            </Popup>

                        </CircleMarker>

                    )}

                </MapContainer>


            </div>


        </div>

    );

}


export default HotelDetails;
