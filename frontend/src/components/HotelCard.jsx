import { useNavigate } from "react-router-dom";

function HotelCard({ hotel, onDelete }) {

    const navigate = useNavigate();

    const imageUrl = hotel.image
        ? `http://localhost:5000/uploads/${hotel.image}`
        : null;

    return (
        <div className="hotel-card">

            {/* Image */}
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={hotel.title}
                    className="hotel-card-image"
                />
            ) : (
                <div className="hotel-card-no-image">
                    No Image
                </div>
            )}

            {/* Content */}
            <div className="hotel-card-content">

                {/* Top section */}
                <div className="hotel-card-header">

                    <h2>{hotel.title}</h2>

                    <div className="hotel-management-actions">

                        <button
                            className="edit-btn"
                            onClick={() =>
                                navigate(`/edit/${hotel.id}`)
                            }
                        >
                            Edit
                        </button>

                        <button
                            className="delete-btn"
                            onClick={() =>
                                onDelete(hotel.id)
                            }
                        >
                            Delete
                        </button>

                    </div>

                </div>

                <p className="hotel-price">
                    ₹{Number(hotel.price).toFixed(2)}
                </p>

                <p className="hotel-description">
                    {hotel.description}
                </p>

                {/* View Details */}
                <div className="hotel-details-action">

                    <button
                        className="view-btn"
                        onClick={() =>
                            navigate(`/hotels/${hotel.id}`)
                        }
                    >
                        View Details
                    </button>

                </div>

            </div>

        </div>
    );
}

export default HotelCard;