import React, { useState } from "react";
import { LoginForm } from './LoginForm'; 
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm} from './ForgotPasswordForm'
import { GoogleLoginButton } from './GoogleLoginButton'

export const AuthLayout = () => {
    // Estado para controlar qué formulario se muestra
    //currentView es el estado o view que se esta mostrando y se inicia con login 
    const [currentView, setCurrentView] = useState('login') // 'login', 'signup', 'forgotPassword'

    const renderForm = () => {
        switch (currentView) { //se encarga de retornar el formulario segun currentView
            case 'login':
                return (
                    <>
                    <LoginForm //nos rederiza al loginForm
                    onSwitchToSignup={() => setCurrentView('signup')} // si el estado es signup retorna el LoginForm
                    onSwitchToForgotPassword={() => setCurrentView('forgotPassword')}
                    />
                    <div className="mt-6 text-center text-gray-500">
                        <p>- O -</p>
                    </div>
                    <GoogleLoginButton /> {/* Agregamos el botón de Google aquí */}
                    </>
                );
            case 'signup':
                return (
                    <SignupForm //if the state is signup return to view SignupForm
                    onSwitchToLogin={() => setCurrentView('login')}/> //allows us to return to the login
                )
            
            case 'forgotPassword':
                return (
                    <ForgotPasswordForm 
                    onSwitchToLogin={() => setCurrentView('login')}/>
                )

            default:
                return(
                    <>
                    <LoginForm 
                    onSwitchToSignup={() => setCurrentView('signup')}
                    onSwitchToForgotPassword={() => setCurrentView('forgotPassword')}
                    />
                    <div className="mt-6 text-center text-gray-500">
                        <p>- O -</p>
                    </div>
                    <GoogleLoginButton /> {/* Agregamos el botón de Google aquí */}
                    </>
                )
            }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                {renderForm()}
            </div>
        </div>
    )
}