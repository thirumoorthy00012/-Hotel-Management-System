import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function HotelForm({ hotel = null, isEdit = false }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        latitude: "",
        longitude: "",
        price: ""
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (hotel) {
            setFormData({
                title: hotel.title || "",
                description: hotel.description || "",
                latitude: hotel.latitude ?? "",
                longitude: hotel.longitude ?? "",
                price: hotel.price ?? ""
            });

            if (hotel.image) {
                const imageUrl = hotel.image.startsWith("http")
                    ? hotel.image
                    : `https://hotel-management-system-1qjl.onrender.com/uploads/${hotel.image}`;

                setPreview(imageUrl);
            } else {
                setPreview(null);
            }
        }
    }, [hotel]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        setError("");
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!formData.title.trim()) {
            setError("Please enter hotel title.");
            return;
        }

        if (!formData.description.trim()) {
            setError("Please enter hotel description.");
            return;
        }

        if (
            formData.latitude === "" ||
            !Number.isFinite(Number(formData.latitude)) ||
            Number(formData.latitude) < -90 ||
            Number(formData.latitude) > 90
        ) {
            setError("Please enter a valid latitude between -90 and 90.");
            return;
        }

        if (
            formData.longitude === "" ||
            !Number.isFinite(Number(formData.longitude)) ||
            Number(formData.longitude) < -180 ||
            Number(formData.longitude) > 180
        ) {
            setError("Please enter a valid longitude between -180 and 180.");
            return;
        }

        if (
            formData.price === "" ||
            !Number.isFinite(Number(formData.price)) ||
            Number(formData.price) <= 0
        ) {
            setError("Price must be greater than 0.");
            return;
        }

        try {
            setLoading(true);

            const data = new FormData();

            data.append("title", formData.title.trim());
            data.append("description", formData.description.trim());
            data.append("latitude", formData.latitude);
            data.append("longitude", formData.longitude);
            data.append("price", formData.price);

            if (image) {
                data.append("image", image);
            }

            const baseUrl =
                "https://hotel-management-system-1qjl.onrender.com/api/hotels";

            const url = isEdit
                ? `${baseUrl}/${hotel.id}`
                : baseUrl;

            const response = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                body: data
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Request failed.");
            }

            setSuccessMessage(
                isEdit
                    ? "Hotel updated successfully!"
                    : "Hotel added successfully!"
            );

            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error) {
            setError(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page">
            <Helmet>
                <title>
                    {isEdit
                        ? "Edit Hotel | Hotel Management System"
                        : "Add Hotel | Hotel Management System"}
                </title>

                <meta
                    name="description"
                    content={
                        isEdit
                            ? "Edit hotel information."
                            : "Add a new hotel to the hotel management system."
                    }
                />
            </Helmet>

            <h1>{isEdit ? "Edit Hotel" : "Add Hotel"}</h1>

            {successMessage && (
                <div className="success-popup">
                    {successMessage}
                </div>
            )}

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            <form className="hotel-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="image">Hotel Image</label>

                    <input
                        id="image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                    />
                </div>

                {preview && (
                    <div className="image-preview">
                        <img
                            src={preview}
                            alt={formData.title || "Hotel preview"}
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="title">Title</label>

                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter hotel title"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>

                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter hotel description"
                        rows="5"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="latitude">Latitude</label>

                    <input
                        id="latitude"
                        type="number"
                        step="any"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="Example: 11.0168"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="longitude">Longitude</label>

                    <input
                        id="longitude"
                        type="number"
                        step="any"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="Example: 76.9558"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price</label>

                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter hotel price"
                    />
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading
                        ? isEdit
                            ? "Updating Hotel..."
                            : "Adding Hotel..."
                        : isEdit
                            ? "Update Hotel"
                            : "Add Hotel"}
                </button>
            </form>
        </div>
    );
}

export default HotelForm;