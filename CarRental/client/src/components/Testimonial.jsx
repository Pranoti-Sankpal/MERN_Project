import React from 'react'
import Title from './Title'
import {assets} from '../assets/assets';

const Testimonial = () => {

const testimonials = [
  {
    name: "Pranoti Sankpal",
    location: "Kolhapur",
    image: assets.testimonial_image_1,
    testimonial:
      "Booking a car through this platform was extremely easy. The vehicle was clean, well maintained, and ready on time. The whole rental experience was smooth and hassle-free."
  },

  {
    name: "Rahul Patil",
    location: "Sangli",
    image: assets.testimonial_image_2,
    testimonial:
      "Great selection of cars and very reasonable prices. I booked a car for a weekend trip and everything worked perfectly. I highly recommend this service for anyone looking for reliable car rentals."
  },

  {
    name: "Pooja Deshmukh",
    location: "Mumbai",
    image: assets.testimonial_image_1,
    testimonial:
      "Amazing experience! The booking process was quick, the car quality was excellent, and customer support was very helpful. I will definitely use this car rental service again."
  }
];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
        <Title title="What Our Customer Say" sbuTitle="Discover why discerning travelers choose StayVenture for their luxury accommodations around the world."/>
           

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                {testimonials.map((testimonial,index) => (
                    <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                             <img key={index} src={assets.star_icon} alt="star-icon" />
                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4">"{testimonial.testimonial}"</p>
                    </div>
                ))}
            </div>
        </div>
  )
}

export default Testimonial
