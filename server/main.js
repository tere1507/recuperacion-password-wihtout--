import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import { Accounts } from 'meteor/accounts-base'; // maneja toda la logica de autenticacion y gestion de user
import { ServiceConfiguration } from 'meteor/service-configuration'; // este modulo de Meteor se usa para servicios de autneticacion de terceros como google,fb, git, le dices a Meteor como coenctarse con ellos





async function insertLink({ title, url }) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
}

Meteor.startup(async () => {

Accounts.urls.resetPassword = function (token) {
    return Meteor.absoluteUrl(`reset-password/${token}`);
  };


  // Configuración de correo para restablecimiento de contraseña
  process.env.MAIL_URL = process.env.MAIL_URL || 'smtp://user:pass@smtp.example.com:587/'; // Placeholder, reemplaza con tu configuración real(SMTP ->simple Mail Transfor protocol)

  // Configuración de Google OAuth
  await ServiceConfiguration.configurations.upsertAsync(
    { service: 'google' },
    {
      $set: {
        clientId: process.env.GOOGLE_CLIENT_ID || 'TU_GOOGLE_CLIENT_ID',
        secret: process.env.GOOGLE_CLIENT_SECRET || 'TU_GOOGLE_CLIENT_SECRET',
        loginStyle: 'popup'
      }
    }
  );

  // Si la colección Links está vacía, añade algunos datos.
  if (await LinksCollection.find().countAsync() === 0) {
    await insertLink({
      title: 'Do the Tutorial',
      url: 'https://www.meteor.com/tutorials/react/creating-an-app',
    });
    await insertLink({
      title: 'Follow the Guide',
      url: 'https://guide.meteor.com',
    });
    await insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com',
    });
    await insertLink({
      title: 'Disscussions',
      url: 'https://forums.meteor.com',
    });
  }

  // Publicamos la colección Links completa a todos los clientes.
  Meteor.publish('links', function () {
    return LinksCollection.find();
  });

  // Publicar información básica del usuario para el cliente
  Meteor.publish('currentUserData', function () {
    if (this.userId) {
      return Meteor.users.find(
        { _id: this.userId },
        { fields: { emails: 1, username: 1, profile: 1, services: { google: 1 } } }
      );
    }
    return this.ready();
  });

  // Configurar las cuentas para usar email como método de registro/login
  Accounts.onCreateUser((options, user) => {
    if (options.email) {
      user.email = options.email;
    }
    if (options.username) {
      user.username = options.username;
    }
    if (options.profile) {
      user.profile = options.profile;
    }
    if (user.services && user.services.google) {
      user.username = user.services.google.name;
      user.emails = [{ address: user.services.google.email, verified: true }];
    }
    return user;
  });

  // Permitir la creación de cuentas por email
  Accounts.emailTemplates.siteName = 'My app Meteor';
  Accounts.emailTemplates.from = 'Mi App Meteor <no-reply@mi-app-meteor.com>';

  Accounts.emailTemplates.resetPassword.subject = () => {
    return 'Reset your password of My App Meteor';
  };

  Accounts.emailTemplates.resetPassword.text = (user, url) => {
    const displayName = user.username || (user.emails && user.emails[0] && user.emails[0].address) || 'Usuario';
    return `Hola ${displayName},\n\n` +
           `Para restablecer tu contraseña, haz clic en el siguiente enlace:\n\n` +
           `${url}\n\n` +
           `Si no solicitaste esto, por favor ignora este correo.\n\n` +
           `Gracias,\n` +
           `El equipo de Mi App Meteor`;
  };

  Accounts.emailTemplates.resetPassword.html = (user, url) => {
    const displayName = user.username || (user.emails && user.emails[0] && user.emails[0].address) || 'Usuario';
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Hola ${displayName},</p>
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
        <p style="margin-top: 20px;">
          <a href="${url}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #4F46E5; /* Color índigo similar a tus botones */
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          ">
            Restablecer mi contraseña
          </a>
        </p>
        <p style="margin-top: 20px;">Si no solicitaste esto, por favor ignora este correo.</p>
        <p>Gracias,</p>
        <p>El equipo de Mi App Meteor</p>
      </div>
    `;
  };

});
