import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
//import 'react-calendar/dist/Calendar.css'; // Ensure base styles are imported

const BuyinPerson = () => {
  const { propertyId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [minDate, setMinDate] = useState(new Date());

  useEffect(() => {
    const fetchAvailableTimes = async (date) => {
      try {
        const formattedDate = date.toISOString().slice(0, 10);
        const response = await fetch(`${window.API_BASE_URL}/api/availability/${propertyId}/${formattedDate}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAvailableTimes(data.availableSlots);
      } catch (error) {
        console.error('Error fetching available times:', error);
        setBookingError('Failed to fetch available times.');
      }
    };

    fetchAvailableTimes(selectedDate);
  }, [selectedDate, propertyId]);

  useEffect(() => {
    // Set the minimum date to today (start of the day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setMinDate(today);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setBookingConfirmation(null);
    setBookingError(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setBookingConfirmation(null);
    setBookingError(null);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const handleBookAppointment = async () => {
    if (!selectedTime) {
      setBookingError('Please select a time slot.');
      return;
    }

    setIsBooking(true);
    try {
      const formattedDate = selectedDate.toISOString().slice(0, 10);
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          date: formattedDate,
          time: selectedTime,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookingConfirmation(data.message || 'Appointment booked successfully!');
        setBookingError(null);
        fetchAvailableTimes(selectedDate);
        setSelectedTime(''); // Reset selected time after booking
      } else {
        const errorData = await response.json();
        setBookingError(errorData.message || 'Failed to book appointment.');
        setBookingConfirmation(null);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setBookingError('An unexpected error occurred while booking.');
      setBookingConfirmation(null);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-xl mx-auto bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-400">Book an In-Person Visit</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-teal-400">Select a Date</h3>
          <div className="rounded-md overflow-hidden bg-gray-700 text-white">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              className="react-calendar text-white bg-gray-700 border-none"
              minDate={minDate}
            />
          </div>
        </div>

        {availableTimes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-teal-400">Available Times for {selectedDate.toLocaleDateString()}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${selectedTime === time ? 'bg-indigo-500 font-semibold' : ''}`}
                >
                  {formatTime(time)}
                </button>
              ))}
            </div>
            {availableTimes.length === 0 && <p className="text-gray-400 mt-2">No times available for this date.</p>}
          </div>
        )}

        {selectedTime && (
          <div className="mb-6">
            <p className="text-lg font-semibold text-teal-400 mb-2">
              Selected Time: <span className="text-indigo-300">{formatTime(selectedTime)}</span> on{' '}
              <span className="text-indigo-300">{selectedDate.toLocaleDateString()}</span>
            </p>
            <button
              onClick={handleBookAppointment}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isBooking ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isBooking}
            >
              {isBooking ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        )}

        {bookingConfirmation && <p className="text-green-400">{bookingConfirmation}</p>}
        {bookingError && <p className="text-red-400">{bookingError}</p>}
      </div>
    </div>
  );
};

export default BuyinPerson;