import React, { useEffect, useState } from 'react'
import { dummyCarData } from '../../assets/assets'
import Title from '../../components/owner/Title'

const ManageCar = () => {

  const [cars, setCars] = useState([])

  const fetchOwnerCars = async () => {
    setCars(dummyCarData)
  }

  useEffect(() => {
    fetchOwnerCars()
  }, [])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>

      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform."
      />

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>

          <thead className='text-gray-500'>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className="border-t border-borderColor">

                <td className="p-3 flex items-center gap-3">
                  <img src={car.image} alt="" className="w-12 h-8 object-cover rounded"/>
                  <span>{car.brand} {car.model}</span>
                </td>

                <td className="p-3 max-md:hidden">
                  {car.category}
                </td>

                <td className="p-3">
                  {car.pricePerDay}
                </td>

                <td className="p-3 max-md:hidden">
                  {car.isAvailable ? "Available" : "Unavailable"}
                </td>

                <td className="p-3">
                  <button className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  )
}

export default ManageCar