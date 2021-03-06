import React, { useState, useEffect } from 'react'
import GroceryList from '../GroceryList/GroceryList'
import Shoppinglist from './Shoppinglist.css'
import Box from '@mui/material/Box';
import Item from '@mui/material/TextField';
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack';
import { render } from '@testing-library/react';
import {ThemeProvider } from '@mui/material/styles'
import { amber } from '@mui/material/colors'

function ShoppingList({theme}) {
  const [input, setInput] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [measurement, setMeasurement] = useState('')
  const [groceryList, setGroceryList] = useState([])
  
  useEffect(() => {
    fetch('http://localhost:3000/groceries')
    .then(res => res.json())
    .then((data) => setGroceryList(data))
  }, [])

  function handleChange (e) {
    setInput(e.target.value)
  }
  
  function handleQuantityChange (e) {
    setQuantity(e.target.value)
  }

  function handleMeasurementChange (e) {
    setMeasurement(e.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const shoppingItem = { 
      quantity: quantity, 
      input: input, 
      measurement: measurement
    }
    setInput('')
    setQuantity('')
    setMeasurement('')

    const configurationObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(shoppingItem),
      } 
      fetch("http://localhost:3000/groceries", configurationObject)
      .then(res => res.json())
      .then(data => setGroceryList([...groceryList, data]))
  }

  function handleDelete(groceryID) {
    fetch(`http://localhost:3000/groceries/${groceryID}`, {
      method: "DELETE",
    })
      .then((r) => r.json())
      .then(() => { 
        const newGroceryList = groceryList.filter((groceryItem) => {
          if (groceryID === groceryItem.id) {
            return false
          } else {
            return true
          }
        })
        setGroceryList(newGroceryList)
      })    
  }
  
  const groceryListItems = groceryList.map(
    (key, value) => {
    return (
      <GroceryList
      handleDelete={handleDelete}
      key={value} 
      quantity={key.quantity} 
      measurement={key.measurement} 
      input={key.input}
      id={key.id}/>
    )
  })
  

  return (
    <>
    <div className='item'></div>
    <Box className='shopping-list'
      component="form" onSubmit={handleSubmit}
      sx={{
        '& > :not(style)': { m: 3, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <Stack spacing={1}>
        <Item
            id="outlined-number"
            label="Quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        <Item
        value={measurement} 
        onChange={handleMeasurementChange} 
        id="standard-search" 
        label="Ingredient measurement" 
        variant="standard" 
        InputLabelProps={{
          shrink: true,
        }}/>
        <Item 
        value={input} 
        onChange={handleChange} 
        id="standard-search" 
        label="Add Ingredient" 
        variant="standard" 
        InputLabelProps={{
          shrink: true,
        }}/>
        <ThemeProvider theme={theme}>
        <Button variant="contained" type="submit">Submit</Button>
        </ThemeProvider>
      {groceryListItems}
      </Stack>
    </Box>
    </>
    
  )
}

export default ShoppingList