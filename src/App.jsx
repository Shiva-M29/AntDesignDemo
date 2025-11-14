import { useState } from 'react'
import  {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Page1 from './components/Page1'
import Page2 from './components/Page2'

const router=createBrowserRouter([
  {path:'/',element:<Page1/>},
  {path:'page2',element:<Page2/>}
])
function App() {
  return <RouterProvider router={router}/>
}

export default App
