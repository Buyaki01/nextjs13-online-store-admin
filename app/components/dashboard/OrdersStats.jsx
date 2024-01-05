import axios from "axios"
import { useEffect, useState } from "react"
import { FaClipboard } from "react-icons/fa"

export const OrdersStats = () => {
  const [orders, setOrders] = useState([])
  const [ordersPercentage, setOrdersPercentage] = useState(0)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders/stats')
        setOrders(response.data.orders)
        setOrdersPercentage(((response.data.orders[0].total - response.data.orders[1].total) / response.data.orders[1].total) * 100) //This month minus previous month divide by previous month multiplied by 100
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="flex gap-5 border shadow-lg p-5 shadow-secondary">
      <div><FaClipboard className="text-xl text-secondary"/></div>
      <div>
        {orders[0]?.total} 
        <div>orders</div>
      </div>
      <div>{ordersPercentage}%</div>
    </div>
  )
}
