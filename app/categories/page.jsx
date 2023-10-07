'use client'

import axios from "axios"
import { useState, useEffect } from "react"
import { withSwal } from 'react-sweetalert2'

function Categories({ swal }) {
  const [editCategoryInfo, setEditCategoryInfo] = useState(null)
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
    const data = { name, parentCategory }

    if (editCategoryInfo) {
      await axios.put('/api/categories', {...data, _id: editCategoryInfo._id})
      setEditCategoryInfo(null)
    } else {
      await axios.post('/api/categories', data)
    }

    setName('')
    fetchCategories()
  }

  async function editCategory(category) {
    setEditCategoryInfo(category)
    setName(category.name)
    setParentCategory(category.parentCategory?._id)
  }

  function deleteCategory(category) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55', 
      reverseButtons: true,
    }).then(async result => {

      // console.log({ result })
      if (result.isConfirmed) {
        await axios.delete(`/api/categories/${category._id}`)
        fetchCategories()
      }
    })
  }

  return (
    <>
      <h1>Categories</h1>
      <form onSubmit={addCategory}>
        <label>{ editCategoryInfo ? `Edit Category ${editCategoryInfo.name}` : 'Create New Category' }</label>
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
                      <button 
                        onClick={() => editCategory(category)} 
                        className="btn-primary mr-1"
                      >
                        Edit
                      </button>

                      <button 
                        className="btn-primary"
                        onClick={() => deleteCategory(category)}
                      >
                        Delete
                      </button>

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

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal}/>
))