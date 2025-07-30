import React, { useState } from "react";
import  { Accounts } from 'meteor/accounts-base';

export const ForgotPasswordForm = ( { onSwitchToLogin }) => { //({ onSwitchToLogin }): Esto es la "desestructuración de props"-->le dice al componente padre AuthLayout que queremos volver al inicio
    //Gestiona el estado del correo electrónico, mensajes de error y mensajes de éxito.
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const validateEmail = (email) => {
        //regex simple to validation email Valida el formato del correo electrónico ingresado por el usuario.
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase())//re.test->comprueba si la caena pasada como argumento coincide con el oatron de regex(true-false)retorna el email en una cadena y lo convierte en minuscula

    }
    const handleSubmit = (e) => {//funcion que se activa cuando el usuario da click en el button enviar
        e.preventDefault();//previene la recarga de la página y realiza validaciones

        //clear the message error or succes when start this sure if exist a message before this clean for new messages
        setError('')
        setSuccessMessage('')

        //first valitation
        if(!email) {
            setError('Pleas, fill the field email with your email')
            return;
        }

        //second valitation
        if(!validateEmail(email)) {//if the email do not have a valid format the function  handleSumbmit stoped 
            setError('Pleas, We need a valid email address')
            return;
        }

        //if all valitations is correct llama a Accounts.forgotPassword de Meteor para enviar la solicitud de recuperación al servidor.
        Accounts.forgotPassword({email}, (err) => { //este es un metodo de Meteor Accounts para recuperacion de contrasena le pasa un objeto email -> (err) =>es el callback que se ejecuta si existe err
            if(err) {
                setError(err.reason || 'Error to sumbit recovery email')
            } else {
                setSuccessMessage('if the email exist in our sistem, you will receive a link to reset your password')
                setEmail('')//clear to field after to sending
            }
        })
    }

    //here start JSX that this a component will render
    return (
        <form onSubmit={ handleSubmit } className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Recover Password</h2>
            {/**this is a line with render conditional if var have a error or null or empty string then render a p */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input 
                type="email" 
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                />
            </div>

            <button 
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Send Email of Recovery
            </button>

            <div className="text-center text-sm">
                <button 
                type="button"//importante que sea button para evitar que se trate de enviar el  formulario como si fuera submit
                onClick={onSwitchToLogin}//activa la funcion padre en AuthLayout esto le dira que cambie la vista al login
                className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Back to Login
                </button>
            </div>
        </form>
    )
}