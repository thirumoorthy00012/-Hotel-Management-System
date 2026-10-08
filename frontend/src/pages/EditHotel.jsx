import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import HotelForm from "../components/HotelForm";

function EditHotel() {

    const { id } = useParams();

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchHotel = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/api/hotels/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Hotel not found"
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

    if (loading) {
        return (
            <p style={{ textAlign: "center" }}>
                Loading hotel...
            </p>
        );
    }

    if (error) {
        return (
            <p
                style={{
                    textAlign: "center",
                    color: "red"
                }}
            >
                {error}
            </p>
        );
    }

    return (
        <HotelForm
            hotel={hotel}
            isEdit={true}
        />
    );
}

export default EditHotel;