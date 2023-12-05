'use client'

import axios from "axios"
import { useState, useEffect } from "react"
import { withSwal } from 'react-sweetalert2'
import Nav from "../components/Nav"
import Spinner from "../../app/components/Spinner"

function Categories({ swal }) {
  const [editedCategoryInfo, setEditedCategoryInfo] = useState(null)
  const [name, setName] = useState()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedCategoryImagePath, setUploadedCategoryImagePath] = useState([])

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
      uploadedCategoryImagePath,
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
    setUploadedCategoryImagePath([])
    setProperties([])

    fetchCategories()
  }

  const uploadCategoryPhoto = async (e) => { //Saves the uploaded images directly to the computer/ AWS S3 Bucket / Cloud storage, whatever you would have stated in the server
    const files = e.target?.files

    try {
      if (files?.length > 0) {
        setIsUploading(true)

        const data = new FormData()
  
        for (const file of files) {
          data.append('uploads', file)
        }
  
        const response = await axios.post('/api/uploads', data)
        setUploadedCategoryImagePath(response.data.uploadedImagePaths) //The uploadedImagePaths in response.data.uploadedImagePaths is coming from the server side
        
        setIsUploading(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function editCategory(category) {
    setEditedCategoryInfo(category)
    setName(category.name)
    setUploadedCategoryImagePath(category.categoryImage)
    setProperties(category.properties.map(({ name, values }) => ({ 
      name,
      values: values.join(',')
    })))
  }

  function deleteCategory(category) {

    const updatedCategories = categories.filter((c) => c._id !== category._id)
    setCategories(updatedCategories)

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
        try {

          await axios.delete(`/api/categories/${category._id}`) //The DELETE request typically does not have a request body in the same way as POST or PUT requests. Instead, you usually include the data you want to send in the URL or as query parameters
        } catch (error) {
          console.error('Error deleting category:', error)

          // If an error occurs, revert the local state to its previous state
          setCategories([...categories])
        }
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
    <div className="min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
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
          </div>
          
          <label>Category Photo</label>
          <div className="mb-3 flex flex-wrap gap-1">
            {!!uploadedCategoryImagePath?.length > 0 && 
              (
                <div key={uploadedCategoryImagePath} className="h-24">
                  <img 
                    src={
                      editedCategoryInfo
                        ? editedCategoryInfo.categoryImage[0]
                        : uploadedCategoryImagePath
                    }
                    alt="" 
                    className="rounded-lg" 
                  />
                </div>
              )
            }

            {isUploading && (
              <div className="h-24 flex items-center"> 
                <Spinner />
              </div>
            )}

            <label className="cursor-pointer w-24 h-24 border mt-2 flex items-center justify-center text-sm gap-1 text-slate-900 rounded-lg bg-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <div>Upload</div>
              <input type="file" onChange={uploadCategoryPhoto} className="hidden" />
            </label>
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
              <tr className="text-center">
                <td>Category Name</td>
                <td>Actions</td>
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
                        <tr 
                          key={category._id}
                          className="border-t border-gray-300 text-center"
                        >
                          <td>{category.name}</td>
                          <td className="flex gap-2 justify-center">
                            <button 
                              onClick={() => editCategory(category)} 
                              className="flex gap-1 items-center btn-primary mr-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                              Edit
                            </button>

                            <button 
                              className="flex gap-1 items-center text-white px-4 py-1 mt-1 rounded-md bg-red-500 hover:bg-red-900"
                              onClick={() => deleteCategory(category)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                              Delete
                            </button>

                          </td>
                        </tr>
                      )))
                    : (
                      <tr>
                        <td colSpan="3" className="px-3 py-2 text-center">
                          <p className="text-lg text-gray-600">No categories available.</p>
                        </td>
                      </tr>
                    )
                )
              }
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal}/>
))
