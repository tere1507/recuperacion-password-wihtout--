import React, { useState, useEffect } from "react";
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base'; // Importar Accounts

import { Hello } from './Hello';
import { Info } from './Info'; // Asegúrate de que esta ruta sea correcta
import { AuthLayout } from './AuthLayout';
import { ResetPasswordForm } from './ResetPasswordForm'; 

export const App = () => {
  // ---------------------------------------------------
  // TODOS LOS HOOKS DEBEN DECLARARSE AQUÍ AL PRINCIPIO
  // ---------------------------------------------------

  const { user, loggingIn } = useTracker(() => {
    const handle = Meteor.subscribe('currentUserData');
    const isReady = handle.ready();
    return {
      user: isReady ? Meteor.user() : null,
      loggingIn: Meteor.loggingIn()
    };
  }, []);

  // *******************************************************************
  // CAMBIO CLAVE: Inicializar resetToken basado en la URL actual
  // Esto asegura que el token esté disponible desde el primer renderizado
  // si la URL es de restablecimiento de contraseña.
  // *******************************************************************
  const getInitialResetToken = () => {
    const path = window.location.pathname;
    // Comprobamos si la URL actual es de restablecimiento de contraseña
    if (path.startsWith('/reset-password/')) {
      // Extraemos el token de la URL
      return path.split('/').pop();
    }
    return null;
  };

  const [resetToken, setResetToken] = useState(getInitialResetToken());

  // useEffect para registrar Accounts.onResetPasswordLink solo una vez
  useEffect(() => {
    // Registra el callback para cuando Meteor detecte una URL de restablecimiento de contraseña.
    Accounts.onResetPasswordLink((token, done) => {
      // Cuando el enlace es activado, actualizamos el estado del token.
      // Esto es importante por si el token no se capturó en el getInitialResetToken
      // o si la URL cambia dinámicamente.
      setResetToken(token);
      // Llamamos a done() para indicar a Meteor que hemos manejado el enlace.
      done();
    });

    // Opcional: Limpiar el token si la URL cambia y ya no es de reset
    // Esto es útil si el usuario navega manualmente fuera del flujo de reset.
    const handlePopState = () => { // Usamos popstate para cambios en la URL (back/forward)
      if (!window.location.pathname.startsWith('/reset-password/')) {
        setResetToken(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar.

  // ---------------------------------------------------
  // FIN DE LA DECLARACIÓN DE HOOKS
  // ---------------------------------------------------

  const handleLogout = () => {
    Meteor.logout((err) => {
      if (err) {
        console.error(`Error when logging out ${err}`);
      } else {
        console.log('Session successfully closed');
        // Redirige a la raíz de la aplicación de forma nativa
        window.location.href = '/'; 
      }
    });
  };

  // 1. Si hay un token de restablecimiento, renderiza ResetPasswordForm.
  //    Esta es la condición de más alta prioridad para la interfaz.
  if (resetToken) {
    return <ResetPasswordForm token={resetToken} />;
  }

  // 2. Lógica de renderizado de la pantalla de carga.
  //    Solo se muestra si loggingIn es true Y NO hay un token de restablecimiento activo.
  if (loggingIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  // 3. Si no hay usuario logueado (y no es una URL de restablecimiento ni estamos cargando), muestra AuthLayout.
  if (!user) {
    return <AuthLayout />;
  }

  // 4. Si el usuario está logueado (sesión activa), muestra el contenido principal.
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-900">
            <strong>Welcome to Meteor!</strong>
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 text-lg">
              Hi!, {user.username || user.emails?.[0]?.address || 'Usuario'}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Close Session
            </button>
          </div>
        </div>
        <Hello />
        <Info />
      </div>
    </div>
  );
};
