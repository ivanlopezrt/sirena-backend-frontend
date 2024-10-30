# Proyecto Sirena BackEnd

Este proyecto es una API contiene el backend del proyecto sierena el cual esta desarrollado con Node.js y Express.
La aplicación permite la gestión de diagnósticos de pacientes y comunicacion con un asistente para la generacion de los
codigos de diagnostico.
La API utiliza JWT para la autenticación y un servidor MySQL para almacenar datos.

## Contenido

- [Configuración](#configuración)
- [Despliegue](#despliegue)
   - [Despliegue en localhost](#despliegue-en-localhost)
   - [Despliegue con Docker](#despliegue-con-docker)

---

## Configuración

Configura las variables de entorno en un archivo `.env`. Este archivo debe estar ubicado en la carpeta `./conf` del
proyecto y debe incluir las siguientes variables:

```plaintext
JWT_SECRET=tu_secreto_jwt
PORT=3003
EMAIL_USER=email@example.com
EMAIL_PASS=password
DNI_SECRET_KEY=clave_secreta_dni
MYSQL_HOST=mysql_host
MYSQL_PORT=3306
MYSQL_DATABASE=nombre_base_de_datos
MYSQL_USER=user
MYSQL_PASSWORD=password
FRONT_URL=http://localhost:3000
RIBERA_HOST=host_de_ribera
```

Las tablas necesarias se generaran de forma automatica la primera vez que se establezca conexion con la
base de datos.

## Despliegue

### Despliegue en localhost

#### Requisitos

- Node.js (versión 18.20.4)
- MySQL

Para ejecutar la aplicación de manera local, sigue estos pasos:

1. **Instalar las dependencias** (si no lo has hecho):
    ```bash
    npm install
    ```

2. **Iniciar la aplicación**:
    ```bash
    npm start
    ```

   La aplicación estará disponible en `http://localhost:3003` (o en el puerto que hayas configurado en tu archivo
   `.env`).


3. **Detener el servidor**:
   Simplemente presiona `Ctrl + C` en la terminal donde se está ejecutando la aplicación.

---

### Despliegue con Docker

#### Requisitos

- Docker
- MySQL

Este proyecto incluye un archivo `Dockerfile` para facilitar el despliegue en un contenedor de Docker. Para ejecutar la
aplicación utilizando Docker, sigue estos pasos:

1. **Construir la imagen**:
    ```bash
    docker build -t sirena-backend .
    ```

2. **Ejecutar el contenedor**:
    ```bash
    docker run -d -p 3003:3003 sirena-backend
    ```

   Esto expondrá la aplicación en el puerto `3003` de tu máquina local (Si modificas el puerto en el `.env` debes
   modificicar el puerto en el `Dockerfile`).


3. **Verificar que el contenedor está corriendo**:
    ```bash
    docker ps
    ```

4. **Detener el contenedor** (si es necesario):
    ```bash
    docker stop <container_id>
    ```




