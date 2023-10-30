import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReservations } from '../redux/reducers/rservationSlice';
import { cancelReservation } from '../redux/reducers/resereveSlice';
import loadingImage from '../assets/images/loading.gif';

const ShowReservation = () => {
  const dispatch = useDispatch();
  const reservations = useSelector((state) => state.reservations.reservations);
  const msg = useSelector((state) => state.reserve.msg);
  const UnAmsg = useSelector((state) => state.reservations.msg);
  const loading = useSelector((state) => state.reservations.loading);

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <img
          src={loadingImage} // Use the imported image here
          alt="Loading..."
        />
      </div>
    );
  }

  // Function to calculate days and hours remaining
  const calculateTimeRemaining = (reservationDate) => {
    const currentDate = new Date();
    const reservationDateObj = new Date(reservationDate);
    const timeDifference = reservationDateObj - currentDate;
    const daysRemaining = Math.floor(timeDifference / (1000 * 3600 * 24));
    const hoursRemaining = Math.floor(
      (timeDifference % (1000 * 3600 * 24)) / (1000 * 3600),
    );

    if (daysRemaining > 0) {
      return `${daysRemaining} days`;
    }
    if (hoursRemaining > 0) {
      return `${hoursRemaining} hours`;
    }
    return 'Less than 1 hour';
  };

  const handleCancelReservation = (reservationId) => {
    dispatch(cancelReservation(reservationId)).then(() => {
      dispatch(fetchReservations());
    });
  };

  return (
    <div className="container mx-auto p-4">
      {msg && <p className="text-green-600 text-center mt-4">{msg}</p>}
      {UnAmsg && <p className="text-red-600 text-center mt-4">{UnAmsg}</p>}
      <h1 className="text-3xl flex justify-center font-semibold text-gray-800 mb-4">
        Reservations
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {reservations ? (
          reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer relative"
            >
              <div
                className="bg-cover bg-center bg-no-repeat h-72 grayscale transition-all duration-300"
                style={{ backgroundImage: `url(${reservation.trade.image})` }}
              />
              <div className="p-6 bg-black backdrop-filter bg-opacity-50 absolute inset-0 flex flex-col items-center justify-center text-white">
                <h2 className="text-2xl font-semibold text-white text-shadow mb-4 text-center">
                  {reservation.trade.name}
                </h2>

                <p className="text-xl font-semibold text-white-400 text-gradient text-shadow mb-4">
                  {reservation.city}
                </p>
                <p className="text-2xl font-semibold text-green-400 text-gradient text-shadow mb-4">
                  {calculateTimeRemaining(reservation.date)}
                </p>
                <button
                  type="button"
                  onClick={() => handleCancelReservation(reservation.id)}
                  className="bg-red-600 text-white py-2 px-4 text-center rounded-full hover:bg-red-700 transition-colors duration-300 cursor-pointer"
                >
                  Cancel Reservation
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Loading reservations...</p>
        )}
      </div>
    </div>
  );
};

export default ShowReservation;
