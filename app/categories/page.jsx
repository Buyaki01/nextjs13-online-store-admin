'use client'

import axios from "axios"
import { useState, useEffect } from "react"

export default function Categories() {
  const [name, setName] = useState()
  const [parentCategory, setParentCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories')
      setCategories(response.data.categories)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching Categories:", error)
    }
  }

  async function addCategory(e) {
    e.preventDefault()

    await axios.post('/api/categories', { name, parentCategory })
    setName('')
    fetchCategories()
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

          <select 
            className="mb-0" 
            value={parentCategory}
            onChange={e => setParentCategory(e.target.value)}
          >
            <option value="0">No parent category</option>

            {categories.length > 0 && categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}

          </select>

          <button type="submit" className="btn btn-default">Save</button>
        </div>
      </form>

      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category Name</td>
            <td>Parent Category</td>
          </tr>
        </thead>

        <tbody>

        {loading 
          ? (
              <p className="loading-categories mt-3 text-xl text-center">Loading...</p>
            ) 
          : (
            categories.length > 0 
              ? (categories.map(category => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category?.parentCategory?.name}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn-primary">Edit</button>
                        <button className="btn-primary">Delete</button>
                      </div>
                    </td>
                  </tr>
                )))
              : (
                <p>No categories available.</p>
              )
          )
        }
        </tbody>
      </table>
    </>
  )
}