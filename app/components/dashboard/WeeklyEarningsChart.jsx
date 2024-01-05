import axios from 'axios'
import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export const WeekSalesChart = () => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchWeeklySales = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/orders/weekly-sales')
        const newData = response.data.income.map((item) => {
          const DAYS = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thur",
            "Fri",
            "Sat"
          ]

          return {
            day: DAYS[item._id.day - 1],
            amount: item.total
          }
        })

        setSales(newData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching income:", error)
        setLoading(false)
      }
    }

    fetchWeeklySales()
  }, [])

  return (
    <>
      {loading 
        ? <p className='mt-14 text-center text-lg'>Loading Chart...</p>
        : 
          <div className="styledChart">
            <h1 className='mb-3'>Last 7 Days Earnings (US $)</h1>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={sales}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
      }
    </>
  )
}
