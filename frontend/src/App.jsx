import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import HotelList from "./pages/HotelList";
import AddHotel from "./pages/AddHotel";
import EditHotel from "./pages/EditHotel";
import HotelDetails from "./pages/HotelDetails";

function App() {

    return (
        <>
            <Navbar />
            
            <Routes>

                <Route
                    path="/"
                    element={<HotelList />}
                />

                <Route
                    path="/add"
                    element={<AddHotel />}
                />

                <Route
                    path="/edit/:id"
                    element={<EditHotel />}
                />

                <Route
                    path="/hotels/:id"
                    element={<HotelDetails />}
                />

            </Routes>
        </>
    );
}

export default App;