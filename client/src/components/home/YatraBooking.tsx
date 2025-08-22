"use client";

import React from "react";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import PaymentIcon from "@mui/icons-material/Payment";
import DateRangeIcon from "@mui/icons-material/DateRange";

const YatraBooking: React.FC = () => {
  return (
    <section className="bg-gray-100 p-6 rounded-lg shadow-md max-w-5xl mx-auto mt-3 mb-3">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-700 font-['Volkhov'] text-center md:text-left flex flex-wrap justify-center md:justify-start">
        Why&nbsp;
        <span className="text-red-600 font-extrabold mr-1">DHADHICH</span>
        Bus Service?
      </h2>
      <div className="flex flex-col md:flex-row items-center">
        {/* Left Section - Text */}
        <div className="md:w-1/2 p-6">
          <div className="mt-4 justify-start">
            <h3 className="text-[20.65px] font-[600] leading-[30.98px] font-['Poppins']">
              Easy and Fast
            </h3>
            <h1 className="text-2xl md:text-lg font-[700] leading-[74px] text-gray-900 font-['Volkhov']">
              Book Your Next Yatra In 3 Easy Steps
            </h1>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-gray-800 text-white p-2">
                <MapsHomeWorkIcon />
              </div>
              <div>
                <h4 className="font-bold">Choose Destination</h4>
                <p className="text-gray-600">
                  Pick your favorite place to visit with our easy selection
                  process.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-gray-800 text-white p-2">
                <PaymentIcon />
              </div>
              <div>
                <h4 className="font-bold">Make Payment</h4>
                <p className="text-gray-600">
                  Enjoy simple and secure payment options for a hassle-free
                  booking.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-gray-800 text-white p-2">
                <DateRangeIcon />
              </div>
              <div>
                <h4 className="font-bold">Reach at Time on Selected Date</h4>
                <p className="text-gray-600">
                  Arrive at your chosen destination on time, every time.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Section - Images */}
        <div className="md:w-1/2 p-6 flex flex-col items-center">
          <div className="text-center text-gray-700 font-bold mb-4">
            Traveling in All Over India
          </div>
          <div className="relative w-full h-[300px] flex items-center justify-center">
            <div className="relative w-full h-full sm:w-[100%] sm:h-[80%] bg-white rounded-xl shadow-lg p-2 flex items-center justify-center">
              <img
                src="/images/public/home/83c0dfa55bef9edd54a6a90efc5d2fd7.png"
                alt="Destination 1"
                className="absolute left-0 top-0 w-[80%] h-36 rounded-lg shadow-md border-4 border-white"
              />
              <img
                src="/images/public/home/f8328f81fdf0d394cc562fbaa45126a3.png"
                alt="Destination 2"
                className="absolute top-[60px] left-[-40px] w-40 h-28 rounded-lg shadow-md border-4 border-white z-1"
              />
              <img
                src="/images/public/home/6f58de3c4b3d1d5d94614fd604778a4c.png"
                alt="Destination 4"
                className="absolute bottom-[10px] left-10 w-[85%] sm:w-[70%] h-32 rounded-lg shadow-md border-4 border-white z-2"
              />
              <img
                src="/images/public/home/20a0b89234c6d2e68cc0ff1d0e4019d6.png"
                alt="Destination 5"
                className="absolute top-[70px] right-[-30px] w-36 h-32 rounded-lg shadow-md border-4 border-white z-3"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YatraBooking;
