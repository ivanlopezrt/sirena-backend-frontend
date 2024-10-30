# Sirena Frontend

Este proyecto es el frontend de la aplicación Sirena, desarrollado en React. Esta documentación describe el entorno, configuración y despliegue de la aplicación en un contenedor Docker.

## Contenido

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución en Desarrollo](#ejecución-en-desarrollo)
- [Despliegue con Docker](#despliegue-con-docker)
- [Dependencias](#dependencias)
- [Scripts](#scripts)

---

## Requisitos

- **Node.js**: Recomendado v18.20.4 o superior.
- **Docker**: Para despliegue en contenedor (opcional para desarrollo local).

## Instalación

1. **Instalar dependencias**:
    ```bash
    npm install
    ```

## Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

```plaintext
REACT_APP_API_HOST=http://localhost:3003
REACT_APP_PUBLIC_URL=https://example.com
REACT_APP_LOGIN_URL=/public/auth/login
```

- **`REACT_APP_API_HOST`**: URL de la API backend.
- **`REACT_APP_PUBLIC_URL`**: URL pública de la aplicación.
- **`REACT_APP_LOGIN_URL`**: Ruta de inicio de sesión para autenticación.

## Ejecución en Desarrollo

Para iniciar la aplicación en modo desarrollo, ejecuta:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`.

## Despliegue con Docker

Para ejecutar el proyecto en un contenedor Docker:

1. **Construir la imagen Docker**:
    ```bash
    docker build -t sirena-frontend .
    ```
2. **Ejecutar el contenedor**:
    ```bash
    docker run -p 3000:3000 sirena-frontend
    ```

Esto levantará la aplicación en `http://localhost:3000`.

### Dockerfile

El Dockerfile realiza los siguientes pasos:

- Utiliza la imagen base `node:18.20.4`.
- Crea el directorio de trabajo `/usr/src/app`.
- Copia los archivos de dependencias y ejecuta `npm ci` para instalar.
- Copia el código fuente y ejecuta `npm run build` para generar los archivos de producción.
- Expone el puerto 3000 y ejecuta `npm run start`.

## Dependencias

Algunas de las principales dependencias del proyecto son:

- **React**: Biblioteca principal para la interfaz de usuario.
- **React Router DOM**: Para la navegación en la aplicación.
- **React Query**: Para la gestión de estados y consultas asíncronas.
- **Formik**: Para la gestión de formularios.
- **Lottie React**: Para animaciones.
- **ApexCharts y React-ApexCharts**: Para visualización de gráficos.

La lista completa de dependencias está en el archivo `package.json`.

## Scripts

Los scripts disponibles en el proyecto son:

- **`npm start`**: Inicia la aplicación en modo desarrollo.
- **`npm run build`**: Genera una versión optimizada para producción en la carpeta `build`.
- **`npm test`**: Ejecuta las pruebas configuradas.
- **`npm run eject`**: Expone la configuración de Create React App (uso avanzado).
