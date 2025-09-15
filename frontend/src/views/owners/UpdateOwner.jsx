
import React from 'react'
import { useParams } from 'react-router-dom'


function UpdateOwner() {

    const {id} = useParams();

  return (
    <div>UpdateOwner: {id}</div>
  )
}

export default UpdateOwner
