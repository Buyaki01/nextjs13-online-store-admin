'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import Nav from "../components/Nav"

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios.get('/api/orders')
      setOrders(response.data.orders)
      setLoading(false)
    }

    fetchOrders()
  }, [])

  return (
    <div className="min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow rounded-lg p-4 overflow-x-auto">
        <h2 className="mb-3 text-center text-2xl text-[#d40d9a]">Orders</h2>
        {loading 
          ? (<div className="text-center mt-10">
              <p className="text-xl text-bold">Loading...</p>
          </div>) 
          : (orders.length > 0 
            ? (
                <table className="min-w-full border border-collapse">
                  <thead>
                    <tr className="bg-custom-green text-white">
                      <th className="py-2 px-4">Payment Status</th>
                      <th className="py-2 px-4">Order ID</th>
                      <th className="py-2 px-4">Date</th>
                      <th className="py-2 px-4">Total Price</th>
                      <th className="py-2 px-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map(order => (
                      <tr className="mb-5 border-t border-gray-300" key={order._id}>
                        <td className="py-3 px-5">
                          {order.paymentStatus === "completed" 
                            ? (<button className="rounded-lg text-center bg-[#50d71e] text-white px-4 py-2">Paid</button>) 
                            : (<button className="rounded-lg text-center bg-red-500 text-white px-4 py-2">Not Paid</button>)
                          }
                        </td>
                        <td className="py-3 px-5">{order._id}</td>
                        <td className="py-3 px-5">{(new Date(order.createdAt)).toLocaleString()}</td>
                        <td>{order.totalPrice}</td>
                        <td className="flex py-3 px-5">
                          <Link className="flex gap-1 bg-custom-green text-white py-1 px-2 rounded-md cursor-pointer" href={`/orders/${order._id}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                            Show order
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            )
            : (
                <div className="flex justify-center mt-10">
                  <p className="text-xl font-semibold mb-4"> No Orders Yet</p>
                  <Link 
                    href={'/'}
                    className="text-xl font-bold text-secondary flex gap-1 items-center justify-center hover:underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                    </svg>Start Shopping
                  </Link>
                </div>
              )
          )}
      </div>
    </div>
  )
}

export default MyOrders