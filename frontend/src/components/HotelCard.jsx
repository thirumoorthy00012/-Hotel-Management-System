import { useNavigate } from "react-router-dom";

function HotelCard({ hotel, onDelete }) {
    const navigate = useNavigate();

    const imageUrl = hotel.image
        ? hotel.image.startsWith("http")
            ? hotel.image
            : `https://hotel-management-system-1qjl.onrender.com/uploads/${hotel.image}`
        : null;

    return (
        <div className="hotel-card">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={hotel.title}
                    className="hotel-card-image"
                    onError={(e) => {
                        e.currentTarget.style.display = "none";
                    }}
                />
            ) : (
                <div className="hotel-card-no-image">
                    No Image
                </div>
            )}

            <div className="hotel-card-content">
                <div className="hotel-card-header">
                    <h2>{hotel.title}</h2>

                    <div className="hotel-management-actions">
                        <button
                            className="edit-btn"
                            onClick={() => navigate(`/edit/${hotel.id}`)}
                        >
                            Edit
                        </button>

                        <button
                            className="delete-btn"
                            onClick={() => onDelete(hotel.id)}
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

                <div className="hotel-details-action">
                    <button
                        className="view-btn"
                        onClick={() => navigate(`/hotels/${hotel.id}`)}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HotelCard;