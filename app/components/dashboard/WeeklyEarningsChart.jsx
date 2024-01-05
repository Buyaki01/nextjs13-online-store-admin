import axios from 'axios'
import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export const WeekSalesChart = () => {
  const [sales, setSales] = useState([])
  const [Loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchWeeklySales = async () => {
      try {
        const response = await axios.get('/api/orders/weekly-sales')
        setIncome(response.data.income)
        setIncomePercentage(((response.data.income[0].total - response.data.income[1].total) / response.data.income[1].total) * 100) //This month minus previous month divide by previous month multiplied by 100
      } catch (error) {
        console.error("Error fetching income:", error)
      }
    }

    fetchWeeklySales()
  }, [])

  const data = [
    {
      day: 'Mon',
      amount: 4000,
    },
    {
      day: 'Tue',
      amount: 3000,
    },
  ];

  return (
    <div className="styledChart">
      <h1 className='mb-3'>Last 7 Days Earnings (US $)</h1>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
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
  )
}
