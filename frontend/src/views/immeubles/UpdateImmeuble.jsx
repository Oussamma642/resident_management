

import React, { useEffect, useState } from 'react'

import axiosClient from "../../axios-client";


function UpdateImmeuble() {

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        syndic_id: ''
    });

    useEffect(() => {
        axiosClient.get('/immeubles/auth-syndic')
            .then(({ data }) => {
                console.log(data);
                setFormData(data);
            }
            )
            .catch((error) => {
                console.error("There was an error fetching the immeuble data!", error);
            });
    }, []);

  return (
    <div>UpdateImmeuble</div>
  )
}

export default UpdateImmeuble
