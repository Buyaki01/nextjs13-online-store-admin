import axios from "axios"
import { useEffect, useState } from "react"

export const EarningsToday = () => {
  const [income, setIncome] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchIncomeToday = async () => {
      setLoading(true)
      const response = await axios.get('/api/orders/daily-transactions')
      setIncome(response.data.dailyIncome)
      setLoading(false)
    }

    fetchIncomeToday()
  }, [])

  return (
    <div>
      {loading 
        ? <p>Loading today's earnings...</p> 
        : <h3><span className="font-bold">Today's Earnings: </span> ${income[0]?.total}</h3>
      }
    </div>
  )
}
