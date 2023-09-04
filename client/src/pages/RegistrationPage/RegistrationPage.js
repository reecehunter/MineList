import React from 'react'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'

const RegistrationPage = () => {
  return (
    <section className='py-5'>
        <h1 className='text-primaryy'>Create a new account</h1>
        <RegistrationForm />
    </section>
  )
}

export default RegistrationPage