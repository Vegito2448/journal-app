# Journal App

Journal App es una aplicación sencilla para la creación, edición, y eliminación de notas personales. Puedes registrarte, iniciar sesión y gestionar tus notas para mantener un registro de tus tareas o ideas. La aplicación está construida usando **React**, **Redux**, **React Router**, y se conecta a **Firebase Auth** y **Firestore** para la autenticación y almacenamiento de datos.

## Funcionalidades

- **Autenticación con Firebase**: Los usuarios pueden registrarse e iniciar sesión con correo electrónico y contraseña.
- **Gestión de Notas**:
  - Crear nuevas notas.
  - Editar notas existentes.
  - Eliminar notas.
- **Interfaz Intuitiva**: La página principal permite gestionar tus notas de manera sencilla.
- **Persistencia de Datos**: Las notas se almacenan en Firestore, lo que permite acceder a ellas desde cualquier dispositivo una vez autenticado.
  
## Tecnologías Utilizadas

- **React**: Librería para construir interfaces de usuario.
- **Redux Toolkit**: Para el manejo del estado global de la aplicación.
- **React Router DOM**: Para la navegación entre las páginas de la aplicación.
- **Firebase**:
  - **Firebase Auth**: Para la autenticación de usuarios.
  - **Firestore**: Para almacenar las notas de los usuarios.
- **Sass**: Para el diseño.

## Requisitos

- **Node.js** (versión 14 o superior).
- **Firebase**: Deberás crear un proyecto en Firebase y obtener las credenciales correspondientes.

## Instalación

Sigue estos pasos para clonar y ejecutar el proyecto en tu entorno local:

1. Clona este repositorio:
```bash
git clone https://github.com/tu-usuario/journal-app.git
````
2. Accede al directorio del proyecto:
```
cd journal-app
```
3. Instala las dependencias:
```npm install```
4. Configura Firebase:
- Crea un proyecto en Firebase.
- Añade la configuración de Firebase en el archivo src/firebase/config.ts y añade las variable de entorno en el .env de la raíz del proyecto.

5. Ejecuta el servidor de desarrollo:

```
npm run dev
```
