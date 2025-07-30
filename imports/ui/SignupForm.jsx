import React, { useState} from "react";
import { Accounts } from 'meteor/accounts-base'

export const SignupForm = ({ onSwitchToLogin })=> {
    const [email, setEmail ] = useState('')
    const [password, setPassword ] = useState('')
    const [confirmPassword, setConfirmPassword ] = useState('')
    const [error, setError ] = useState('')
    const [successMessage, setSuccessMessage ] = useState('')

    //Esta función toma una contraseña (pwd) como argumento y verifica si cumple con ciertos criterios de fortaleza.
    const validatePassword = (pwd) => {
        if(pwd.length < 6) {
            return 'The password must be at leats 6 characters long'
        }
        // Puedes añadir más validaciones de fortaleza aquí (mayúsculas, números, símbolos)
        return;
    }

    //function que se ejecuta cuando se envia el formulario (registrarse, iniciar sesion) recibe un objeto evento como argunmeto
    const handleSubmit = (e) => {
        e.preventDefault();

        //Estas dos líneas limpian cualquier mensaje de error o éxito anterior al inicio de cada intento de envio del form
        setError('')
        setSuccessMessage('')

        //valitation
        if(!email || !password || !confirmPassword) {
            setError('All fields are required')
            return;
        }

        if(password !== confirmPassword) {
            setError('Passwords do not match')
            return;
        }

        //Aquí se llama a la función validatePassword que definimos antes, pasándole la contraseña ingresada.
        const passwordError = validatePassword(password)
        if(passwordError) {
            setError(passwordError)
            return;
        }

        //si todas las validaciones pasan sin fallos 
        Accounts.createUser({ email, password },  (err) => {
            if(err) {
                setError(err.reason || 'Error when register user')
            } else {
                setSuccessMessage('Account successfully created! Logging in...')
                // Opcional: podrías redirigir al login o directamente al dashboard si el auto-login es deseado
            }
        })
    }

    //Aquí comienza el JSX que este componente va a renderizar.
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
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

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input 
                type="password" 
                name="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                />
                {/**validacion en tiempo real si existe algo en password y si validatePassword contiene errores entonces muestra un p con el error */}
                {password && validatePassword(password) && (
                    <p className="text-red-400 text-xs mt-1">{validatePassword(password)}</p>
                )}
            </div>

            <div>
                <label htmlFor="confirmPassword">
                    Confirm Password
                </label>
                <input 
                type="password" 
                name="confirmPassword" 
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                />

                {/**validacion en tiempo real solo se evalua si abos campos tienes valores y si no coinciden */}
                {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
            </div>

            <button 
            type="submit" //activa el onsubmit del formulario
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
            >
                Register
            </button>

            <div className="text-center text-sm">
                <button 
                type="button"
                onClick={onSwitchToLogin}
                className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Do you hava an Account? Sign In.
                </button>
                
            </div>
        </form>
    )
}