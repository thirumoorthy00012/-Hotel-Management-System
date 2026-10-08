import {
    useEffect,
    useState
} from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    fetchHotels,
    deleteHotel
} from "../redux/hotelSlice";

import HotelCard
    from "../components/HotelCard";

import SearchFilter
    from "../components/SearchFilter";

import Pagination
    from "../components/Pagination";

import {
    Helmet
} from "react-helmet-async";



function HotelList() {

    const dispatch = useDispatch();


    const {
        hotels,
        count,
        loading,
        error
    } = useSelector(
        (state) => state.hotels
    );



    // Delete message
    const [
        deleteMessage,
        setDeleteMessage
    ] = useState("");



    // Filters
    const [
        filters,
        setFilters
    ] = useState({

        title: "",

        minPrice: "",

        maxPrice: ""

    });



    // Current page
    const [
        currentPage,
        setCurrentPage
    ] = useState(1);



    // 6 hotels per page
    const itemsPerPage = 6;



   //fetch hotels//

    useEffect(() => {

        const offset =
            (currentPage - 1)
            * itemsPerPage;


        dispatch(
            fetchHotels({

                ...filters,

                offset: offset,

                limit: itemsPerPage

            })
        );

    }, [
        dispatch,
        filters,
        currentPage
    ]);



    // =================================
    // SEARCH / FILTER
    // =================================

    const handleFilter = (
        newFilters
    ) => {

        setFilters(newFilters);

        // Return to page 1
        setCurrentPage(1);

    };



    // =================================
    // PAGE CHANGE
    // =================================

    const handlePageChange = (
        page
    ) => {

        setCurrentPage(page);


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };



    // =================================
    // DELETE
    // =================================

    const handleDelete = async (
        id
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this hotel?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            await dispatch(
                deleteHotel(id)
            ).unwrap();


            setDeleteMessage(
                "Hotel deleted successfully!"
            );


            setTimeout(() => {

                setDeleteMessage("");

            }, 3000);


        } catch (error) {

            alert(error);

        }

    };



    return (

        <div className="hotel-list-page">


            {/* SEO */}

            <Helmet>

                <title>
                    Hotels | Hotel Management System
                </title>


                <meta
                    name="description"
                    content="Browse hotels, search hotels and filter hotels by price."
                />

            </Helmet>



            {/* TITLE */}

            <h1>
                Hotels
            </h1>



            {/* SEARCH */}

            <SearchFilter
                onFilter={handleFilter}
            />



            {/* DELETE SUCCESS */}

            {deleteMessage && (

                <div className="success-popup">

                    {deleteMessage}

                </div>

            )}



            {/* LOADING */}

            {loading && (

                <p className="loading-message">

                    Loading hotels...

                </p>

            )}



            {/* ERROR */}

            {error && (

                <p className="error-message">

                    Error: {error}

                </p>

            )}



            {/* HOTEL CARDS */}

            {!loading &&
                !error &&
                hotels.length > 0 && (

                    <div className="hotel-grid">

                        {hotels.map(
                            (hotel) => (

                                <HotelCard
                                    key={hotel.id}
                                    hotel={hotel}
                                    onDelete={
                                        handleDelete
                                    }
                                />

                            )
                        )}

                    </div>

                )}



            {/* NO HOTELS */}

            {!loading &&
                !error &&
                hotels.length === 0 && (

                    <p className="no-hotels">

                        No hotels found.

                    </p>

                )}



            {/* PAGINATION */}

            {!loading &&
                !error &&
                count > 0 && (

                    <Pagination

                        currentPage={
                            currentPage
                        }

                        totalItems={
                            count
                        }

                        itemsPerPage={
                            itemsPerPage
                        }

                        onPageChange={
                            handlePageChange
                        }

                    />

                )}

        </div>

    );

}


export default HotelList;