import axios from "axios"
import Link from "next/link"
import { useState } from "react"
import { useEffect } from "react"

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('/api/users')
      setUsers(response.data.users)
      setLoading(false)
    }

    fetchUsers()
  }, [])

  return (
    <>
      {loading 
      ? (
          <p>Loading...</p>
        ) 
      : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email Address</th>
                <th>Roles</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 && users.map(user => (
                <tr>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="flex gap-2">
                    {user.role}
                    <Link href={`/users/edit/${user._id}`}>Edit Role</Link> {/* Or create a pop up on the page to allow admin to edit the roles */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </>
  )
}

export default UsersPage