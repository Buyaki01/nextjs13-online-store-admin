import axios from "axios"
import { useEffect, useState } from "react"
import { FaChartBar } from "react-icons/fa"

export const EarningsStats = () => {
  const [income, setIncome] = useState([])
  const [incomePercentage, setIncomePercentage] = useState(0)

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await axios.get('/api/orders/monthly-transactions')
        setIncome(response.data.income)
        setIncomePercentage(((response.data.income[0].total - response.data.income[1].total) / response.data.income[1].total) * 100) //This month minus previous month divide by previous month multiplied by 100
      } catch (error) {
        console.error("Error fetching income:", error)
      }
    }

    fetchIncome()
  }, [])

  return (
    <div className="flex gap-5 border shadow-lg p-5 shadow-secondary justify-center">
      <div><FaChartBar className="text-xl text-secondary"/></div>
      <div>
        ${income[0]?.total} 
        <div>Earnings</div>
      </div>
      <div>{incomePercentage}%</div>
    </div>
  )
}
