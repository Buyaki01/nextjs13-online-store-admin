import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

const AdminForm = () => {

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const router = useRouter()

  const addNewAdmin = async (e) => {
    e.preventDefault()

    const data = { firstname, lastname, email, phoneNumber } 

    await axios.post('/api/admins', data)

    router.push("/admins")
  }

  return (
    <form onSubmit={addNewAdmin}>
      <label htmlFor="firstname">First Name</label>
      <input 
        type="text"
        id="firstname"
        name="firstname"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
      />

      <label htmlFor="lastname">Last Name</label>
      <input 
        type="text"
        id="lastname"
        name="lastname"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />

      <label htmlFor="email">Email</label>
      <input 
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="phoneNumber">Phone Number</label>
      <input 
        type="tel"
        id="phoneNumber"
        name="phoneNumber"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <button 
        type="submit"
        className="btn-default"
      >
        Save
      </button>
    </form>
  )
}

export default AdminForm