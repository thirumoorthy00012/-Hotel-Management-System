import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function HotelForm({
    hotel = null,
    isEdit = false
}) {

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

    // Success popup
    const [successMessage, setSuccessMessage] =
        useState("");


   //load existing hotel data into the form when editing

    useEffect(() => {

        if (hotel) {

            setFormData({
                title: hotel.title || "",
                description: hotel.description || "",
                latitude: hotel.latitude || "",
                longitude: hotel.longitude || "",
                price: hotel.price || ""
            });


            if (hotel.image) {

                setPreview(
                    `http://hotel-management-system-1q31.onrender.com/uploads/${hotel.image}`
                );

            }

        }

    }, [hotel]);


    // =====================================
    // INPUT CHANGE
    // =====================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData({
            ...formData,
            [name]: value
        });

    };


    // =====================================
    // IMAGE CHANGE
    // =====================================

    const handleImageChange = (e) => {

        const file = e.target.files[0];


        if (!file) {
            return;
        }


        setImage(file);


        setPreview(
            URL.createObjectURL(file)
        );

    };


    // =====================================
    // SUBMIT
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        setError("");



        // =================================
        // VALIDATION
        // =================================

        if (!formData.title.trim()) {

            setError(
                "Please enter hotel title."
            );

            return;
        }


        if (!formData.description.trim()) {

            setError(
                "Please enter hotel description."
            );

            return;
        }


        if (!formData.latitude) {

            setError(
                "Please enter latitude."
            );

            return;
        }


        if (!formData.longitude) {

            setError(
                "Please enter longitude."
            );

            return;
        }


        if (!formData.price) {

            setError(
                "Please enter hotel price."
            );

            return;
        }


        if (Number(formData.price) <= 0) {

            setError(
                "Price must be greater than 0."
            );

            return;
        }



        try {

            setLoading(true);


            const data = new FormData();


            data.append(
                "title",
                formData.title
            );


            data.append(
                "description",
                formData.description
            );


            data.append(
                "latitude",
                formData.latitude
            );


            data.append(
                "longitude",
                formData.longitude
            );


            data.append(
                "price",
                formData.price
            );


            if (image) {

                data.append(
                    "image",
                    image
                );

            }



            // =================================
            // URL
            // =================================

            const url = isEdit
                ? `http://hotel-management-system-1q31.onrender.com/api/hotels/${hotel.id}`
                : "http://hotel-management-system-1q31.onrender.com/api/hotels";


            // =================================
            // METHOD
            // =================================

            const method = isEdit
                ? "PUT"
                : "POST";



            const response = await fetch(
                url,
                {
                    method: method,
                    body: data
                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Request failed"
                );

            }



            // =================================
            // SUCCESS POPUP
            // =================================

            setSuccessMessage(
                isEdit
                    ? "Hotel updated successfully!"
                    : "Hotel added successfully!"
            );



            // =================================
            // GO TO HOTEL LIST
            // =================================

            setTimeout(() => {

                navigate("/");

            }, 1500);


        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }

    };



    return (

        <div className="form-page">


            {/* SEO */}

            <Helmet>

                <title>
                    {isEdit
                        ? "Edit Hotel | Hotel Management System"
                        : "Add Hotel | Hotel Management System"
                    }
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



            {/* PAGE TITLE */}

            <h1>

                {isEdit
                    ? "Edit Hotel"
                    : "Add Hotel"
                }

            </h1>



            {/* SUCCESS POPUP */}

            {successMessage && (

                <div className="success-popup">

                    {successMessage}

                </div>

            )}



            {/* ERROR */}

            {error && (

                <p className="form-error">

                    {error}

                </p>

            )}



            {/* FORM */}

            <form
                className="hotel-form"
                onSubmit={handleSubmit}
            >


                {/* IMAGE */}

                <div className="form-group">

                    <label>
                        Hotel Image
                    </label>


                    <input
                        type="file"
                        accept="image/*"
                        onChange={
                            handleImageChange
                        }
                    />

                </div>



                {/* IMAGE PREVIEW */}

                {preview && (

                    <div className="image-preview">

                        <img
                            src={preview}
                            alt={
                                formData.title ||
                                "Hotel preview"
                            }
                        />

                    </div>

                )}



                {/* TITLE */}

                <div className="form-group">

                    <label>
                        Title
                    </label>


                    <input
                        type="text"
                        name="title"
                        value={
                            formData.title
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Enter hotel title"
                    />

                </div>



                {/* DESCRIPTION */}

                <div className="form-group">

                    <label>
                        Description
                    </label>


                    <textarea
                        name="description"
                        value={
                            formData.description
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Enter hotel description"
                        rows="5"
                    />

                </div>



                {/* LATITUDE */}

                <div className="form-group">

                    <label>
                        Latitude
                    </label>


                    <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={
                            formData.latitude
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Example: 11.0168"
                    />

                </div>



                {/* LONGITUDE */}

                <div className="form-group">

                    <label>
                        Longitude
                    </label>


                    <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={
                            formData.longitude
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Example: 76.9558"
                    />

                </div>



                {/* PRICE */}

                <div className="form-group">

                    <label>
                        Price
                    </label>


                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={
                            formData.price
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Enter hotel price"
                    />

                </div>



                {/* SUBMIT */}

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >

                    {loading

                        ? (
                            isEdit
                                ? "Updating Hotel..."
                                : "Adding Hotel..."
                        )

                        : (
                            isEdit
                                ? "Update Hotel"
                                : "Add Hotel"
                        )

                    }

                </button>


            </form>

        </div>

    );
}


export default HotelForm;