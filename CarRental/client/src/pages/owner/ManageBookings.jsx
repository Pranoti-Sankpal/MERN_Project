import React, { useEffect, useState } from 'react'
import { dummyMyBookingsData } from '../../assets/assets'
import Title from '../../components/owner/Title'

const ManageBookings = () => {

  const currency = import.meta.env.VITE_CURRENCY
  const [bookings, setBookings] = useState([])

  // Fetch bookings
  const fetchOwnerBookings = async () => {
    setBookings(dummyMyBookingsData)
  }

  useEffect(() => {
    fetchOwnerBookings()
  }, [])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>

      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses"
      />

      <div className='max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>

          {/* Table Head */}
          <thead className='text-gray-500 bg-gray-50'>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>

            {bookings.map((booking, index) => (
              <tr key={index} className="border-t border-borderColor">

                {/* Car */}
                <td className='p-3 flex items-center gap-3'>
                  <img
                    src={booking.car.image}
                    alt=""
                    className='h-12 w-12 rounded-md object-cover'
                  />
                  <p className='font-medium max-md:hidden'>
                    {booking.car.brand} {booking.car.model}
                  </p>
                </td>

                {/* Date */}
                <td className='p-3 max-md:hidden'>
                  {booking.pickupDate.split('T')[0]} - {booking.returnDate.split('T')[0]}
                </td>

                {/* Price */}
                <td className='p-3'>
                  {booking.price}{currency}
                </td>

                {/* Status */}
                <td className='p-3 max-md:hidden'>
                  <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>Offline

                  </span>
                </td>

                {/* Actions */}
                <td className='p-3'>
                  {booking.status ==='pending' ? (
                    <select value={booking.status} className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none'>
                      <option value="pending">Prnding</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Condirmed</option>
                    </select>
                  ):(
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold $ {booking.status === 'confirmed' ? 'bg-green-100 text-green-500' :''}`}>{booking.status}</span>
                  )
                  }
                 
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default ManageBookings