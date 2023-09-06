import React from 'react'
import CreateForm from '../../components/CreateForm/CreateForm'

const CreatePage = () => {

    // TODO: Check if authenticated.

    return (
        <div>
            <h1 className='text-primaryy'>Add Your Plugin</h1>
            <CreateForm />
        </div>
    )
}

export default CreatePage