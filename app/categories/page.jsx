'use client'

import axios from "axios"
import { useState } from "react"

export default function Categories() {
  const [name, setName] = useState()

  async function addCategory(e) {
    e.preventDefault()

    await axios.post('/api/categories', {name})
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
    </>
  )
}