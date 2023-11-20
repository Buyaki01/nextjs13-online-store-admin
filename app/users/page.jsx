'use client'

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
          <>
            <h1 className="font-bold mb-3 text-lg">Users</h1>
            <table className="min-w-full border border-gray-300 text-center">
              <thead>
                <tr className="table-edit-link text-white">
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Email Address</th>
                  <th className="py-2 px-4">Roles</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 && users.map(user => (
                  <tr className="border-t border-gray-300">
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.role}</td>
                    <td className="py-2 px-4 flex gap-2 justify-center">
                      <Link 
                        href={`/users/edit/${user._id}`}
                        className="flex gap-1 items-center rounded-md px-3 py-1 text-lg text-white table-edit-link mr-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit Role
                      </Link> {/* Or create a pop up on the page to allow admin to edit the roles */}
                      <Link 
                        href={`/users/delete/${user._id}`}
                        className="flex gap-1 items-center rounded-md px-3 py-1 text-lg text-white bg-red-500 mr-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.5 3.5L6 5l5.5 5.5H2v3h9.5L6 18l1.5 1.5L17 12l-1.5-1.5L7.5 3.5z"/>
                        </svg>
                        Deactivate User
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )
      }
    </>
  )
}

export default UsersPage