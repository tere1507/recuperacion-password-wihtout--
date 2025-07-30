import React, { use, useState } from "react";
import { Meteor } from 'meteor/meteor'

//onSwitchToSignup: Una función para cambiar a la vista de registro.
//onSwitchToForgotPassword: Una función para cambiar a la vista de recuperación de contraseña.
//  Estas funciones serán llamadas por LoginForm cuando el usuario haga clic en los enlaces correspondientes.
export const LoginForm = ({ onSwitchToSignup, onSwitchToForgotPassword }) => { //{} destruccion de props y espera recibir dos propiedades de su componente padre AuthLayout
    const [email, setEmail ] = useState('')
    const [password, setPassword ] = useState('')
    const [error, setError ] = useState('')
    const [successMessage, setSuccessMessage ] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault(); //Esta línea detiene el comportamiento predeterminado del navegador de recargar la página cuando se envia el form ypermite manejar el form con JS Y REACT
        //Estas dos líneas limpian cualquier mensaje de error o éxito anterior al inicio de cada intento de envio asegurando que solo se muetre el estado actual
        setError('')
        setSuccessMessage('')

        if(!email || !password) {
            setError('Please, enter your email and password')
            return;
        }

        //si las validaciones pasan esta linea es el corazon de la funcionalidad de inicio de sesion
        //Meteor.loginWithPassword(email, password->Metodo de meteor que intenta autenticar al ususrio con su email y password proporcionados
        //tras el intento de inicio de sesion llamamos al callback err que contendra err si el login fallo
        Meteor.loginWithPassword(email, password, (err) => {
            if(err) {
                setError(err.reason || 'Error when starting session. Please check your credentials')
            } else {
                // Redirección o mensaje de éxito manejado por el componente padre (App.jsx)
                // ya que el estado del usuario cambia y App.jsx se re-renderiza.
            }
        })

    }

    //Aquí comienza el JSX que este componente va a renderizar.
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>
            {/**renderizahdo condicionla */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

            <div>
                <label htmlFor="email">
                    Email
                </label>
                <input 
                type="email"
                id="email"
                name="email"
                value={email} // El valor del campo está "controlado" por la variable de estado emailen javascript
                onChange={(e) => setEmail(e.target.value)} //Actualiza el estado email cada vez que el usuario escribe.
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                />
            </div>

            <div>
                <label htmlFor="password">
                    Password
                </label>
                <input 
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                />
            </div>

            <button 
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Sign In
            </button>

            {/**Esta sección final contiene dos botones (enlaces) para navegar a otras vistas de autenticación a la de SinUp and ForgotPassword */}
            <div className="text-center text-sm">
                <button 
                type="button" //Not to send the form
                onClick={onSwitchToSignup}//llamamos a la prop onSwitchToSignup para que el componente padre cambie la vista
                className="font-medium text-indigo-600 hover:text-indigo-500 mr-4"
                >
                    Do not have an acoount yet? Register here!
                </button>

                <button
                type="button"
                onClick={onSwitchToForgotPassword}//llamamos a la prop onSwitchToForgotPassword para que el componente padre cambie la vista
                className="font-medium text-indigo-600 hover:text-indigo-500 mr-4"
                >
                    Forgot your Password? Click here!
                </button>
            </div>
        </form>
    )
}