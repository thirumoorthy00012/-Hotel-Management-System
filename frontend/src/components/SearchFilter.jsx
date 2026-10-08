import { useState } from "react";

function SearchFilter({ onFilter }) {

    const [title, setTitle] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        onFilter({
            title,
            minPrice,
            maxPrice
        });
    };

    const handleClear = () => {

        setTitle("");
        setMinPrice("");
        setMaxPrice("");

        onFilter({
            title: "",
            minPrice: "",
            maxPrice: ""
        });
    };

    return (
        <form
            className="search-filter"
            onSubmit={handleSubmit}
        >

            {/* TITLE SEARCH */}
            <div className="filter-group">

                <label>
                    Search Hotel
                </label>

                <input
                    type="text"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    placeholder="Enter hotel title"
                />

            </div>

            {/* MIN PRICE */}
            <div className="filter-group">

                <label>
                    Minimum Price
                </label>

                <input
                    type="number"
                    value={minPrice}
                    onChange={(e) =>
                        setMinPrice(e.target.value)
                    }
                    placeholder="Min price"
                />

            </div>

            {/* MAX PRICE */}
            <div className="filter-group">

                <label>
                    Maximum Price
                </label>

                <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) =>
                        setMaxPrice(e.target.value)
                    }
                    placeholder="Max price"
                />

            </div>

            {/* SEARCH BUTTON */}
            <button
                type="submit"
                className="search-btn"
            >
                Search
            </button>

            {/* CLEAR BUTTON */}
            <button
                type="button"
                className="clear-btn"
                onClick={handleClear}
            >
                Clear
            </button>

        </form>
    );
}

export default SearchFilter;
