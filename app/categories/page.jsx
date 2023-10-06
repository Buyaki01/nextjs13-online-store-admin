'use client'

import axios from "axios"
import { useState, useEffect } from "react"

export default function Categories() {
  const [name, setName] = useState()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories')
        setCategories(response.data.categories)
      } catch (error) {
        console.error("Error fetching Categories:", error)
      }
    }

    fetchCategories()
  }, [])

  async function addCategory(e) {
    e.preventDefault()

    await axios.post('/api/categories', { name })
    setName('')
  }

  return (
    <>
      <h1>Categories</h1>
      <form onSubmit={addCategory}>
        <label>New Category name</label>
        <div className="flex gap-1">
          <input 
            type="text" 
            placeholder={'Category name'}
            className="mb-0"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>

      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category Name</td>
          </tr>
        </thead>

        <tbody>
          {categories.length > 0 && categories.map(category => (
            <tr key={category._id}>
              <td>{category.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}