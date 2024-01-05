import axios from "axios"
import { useEffect, useState } from "react"
import { FaUsers } from "react-icons/fa"

export const UsersStats = () => {
  const [users, setUsers] = useState([])
  const [usersPercentage, setUsersPercentage] = useState(0)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/stats')
        setUsers(response.data.users)
        setUsersPercentage(((response.data.users[0].total - response.data.users[1].total) / response.data.users[1].total) * 100) //This month minus previous month divide by previous month multiplied by 100
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="flex gap-5 border shadow-lg p-5 shadow-secondary">
      <div><FaUsers className="text-xl text-secondary"/></div>
      <div>
        {users[0]?.total} 
        <div>users</div>
      </div>
      <div>{usersPercentage}%</div>
    </div>
  )
}
