'use client'

import axios from "axios"
import { useState, useEffect } from "react"
import { withSwal } from 'react-sweetalert2'

function Categories({ swal }) {
  const [editedCategoryInfo, setEditedCategoryInfo] = useState(null)
  const [name, setName] = useState()
  const [parentCategory, setParentCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState([])

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
    const data = { 
      name, 
      parentCategory, 
      properties: properties.map(property => ({
        name: property.name,
        values: property.values.split(','),
      }))
    }

    if (editedCategoryInfo) {
      await axios.put('/api/categories', {...data, _id: editedCategoryInfo._id})
      setEditedCategoryInfo(null)
    } else {
      await axios.post('/api/categories', data)
    }

    setName('')
    setParentCategory('')
    setProperties([])

    fetchCategories()
  }

  async function editCategory(category) {
    setEditedCategoryInfo(category)
    setName(category.name)
    setParentCategory(category.parentCategory?._id)
    setProperties(category.properties.map(({ name, values }) => ({ 
      name,
      values: values.join(',')
    })))
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
        await axios.delete(`/api/categories/${category._id}`) //The DELETE request typically does not have a request body in the same way as POST or PUT requests. Instead, you usually include the data you want to send in the URL or as query parameters
        fetchCategories()
      }
    })
  }

  function addProperty() {
    setProperties(prev => {
      return [...prev, {name: '', values: ''}]
    })
  }

  function updatePropertyNameChange(index, property, newPropertyName) {
    // console.log({index, property, newPropertyName})

    setProperties(prev => {
      const properties = [...prev]
      properties[index].name = newPropertyName
      return properties
    })
  }

  function updatePropertyValuesChange(index, property, newPropertyValues) {

    setProperties(prev => {
      const properties = [...prev]
      properties[index].values = newPropertyValues
      return properties
    })
  }

  function removeProperty(indexToRemove) {
    setProperties(prev => {
      return [...prev].filter((prop, propIndex) => {
        return propIndex !== indexToRemove
      })
    })
  }

  return (
    <>
      <h1>Categories</h1>
      
      <label>{ editedCategoryInfo ? `Edit Category ${editedCategoryInfo.name}` : 'Create New Category' }</label>

      <form onSubmit={addCategory}>
        <div className="flex gap-1">
          <input 
            type="text" 
            placeholder={'Category name'}
            value={name}
            onChange={e => setName(e.target.value)}
          /> 

          <select 
            value={parentCategory}
            onChange={e => setParentCategory(e.target.value)}
          >
            <option value="0">No parent category</option>

            {categories.length > 0 && categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="new-property bg-slate-400 text-sm mb-2"
          >
            Add new property
          </button>

          {properties.length > 0 && properties.map((property, index) => (
            <div className="flex gap-1 mb-2">
              <input 
                type="text" 
                className="mb-0"
                value={property.name}
                placeholder="property name (example: color)"
                onChange={(e) => updatePropertyNameChange(index, property, e.target.value)}
              />

              <input
                type="text"
                className="mb-0"
                value={property.values}
                placeholder="values, comma separated"
                onChange={(e) => updatePropertyValuesChange(index, property, e.target.value)}
              />

              <button
                type="button"
                className="bg-slate-500 py-1 px-4 text-white"
                onClick={() => removeProperty(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div> 

        <div className="flex gap-1">
          {editedCategoryInfo && (
            <button
              type="button"
              onClick={() => {
                setEditedCategoryInfo(null)
                setName('')
                setParentCategory('')
                setProperties([])
              }}
              className="btn-primary"
            >
              Cancel
            </button>
          )}

          <button type="submit" className="btn btn-default">Save</button>
        </div>

      </form>

      {!editedCategoryInfo && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Parent Category</td>
              <td></td>
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
      )}
    </>
  )
}

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal}/>
))
