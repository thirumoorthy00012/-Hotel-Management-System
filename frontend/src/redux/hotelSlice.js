import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const API_URL =
    "https://hotel-management-system-1qjl.onrender.com/api/hotels";


//get hotels//
export const fetchHotels = createAsyncThunk(
    "hotels/fetchHotels",

    async (params = {}) => {

        const {
            title = "",
            minPrice = "",
            maxPrice = "",
            offset = 0,
            limit = 6
        } = params;


        const query =
            new URLSearchParams();


        if (title) {
            query.append(
                "title",
                title
            );
        }


        if (minPrice) {
            query.append(
                "minPrice",
                minPrice
            );
        }


        if (maxPrice) {
            query.append(
                "maxPrice",
                maxPrice
            );
        }


        query.append(
            "offset",
            offset
        );


        query.append(
            "limit",
            limit
        );


        const response = await fetch(
            `${API_URL}?${query.toString()}`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch hotels"
            );

        }


        return await response.json();
    }
);



//delete hotel//
export const deleteHotel = createAsyncThunk(
    "hotels/deleteHotel",

    async (id) => {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete hotel"
            );

        }


        return id;
    }
);



//inisitial state//
const initialState = {

    hotels: [],

    count: 0,

    loading: false,

    error: null

};



//slice//
const hotelSlice = createSlice({

    name: "hotels",

    initialState,

    reducers: {},


    extraReducers: (builder) => {


        // GET - LOADING
        builder.addCase(
            fetchHotels.pending,
            (state) => {

                state.loading = true;

                state.error = null;

            }
        );


        // GET - SUCCESS
        builder.addCase(
            fetchHotels.fulfilled,
            (state, action) => {

                state.loading = false;

                state.hotels =
                    action.payload.hotels;

                state.count =
                    action.payload.count;

            }
        );


        // GET - ERROR
        builder.addCase(
            fetchHotels.rejected,
            (state, action) => {

                state.loading = false;

                state.error =
                    action.error.message;

            }
        );


        // DELETE - START
        builder.addCase(
            deleteHotel.pending,
            (state) => {

                state.error = null;

            }
        );


        // DELETE - SUCCESS
        builder.addCase(
            deleteHotel.fulfilled,
            (state, action) => {

                state.hotels =
                    state.hotels.filter(
                        (hotel) =>
                            hotel.id !==
                            action.payload
                    );


                state.count =
                    Math.max(
                        0,
                        state.count - 1
                    );

            }
        );


        // DELETE - ERROR
        builder.addCase(
            deleteHotel.rejected,
            (state, action) => {

                state.error =
                    action.error.message;

            }
        );

    }

});


export default hotelSlice.reducer;
