# SGMR - Sistema de Gestion de Medicamentos Refrigerados

Este proyecto es una aplicacion web para gestionar el stock, ventas y alertas de medicamentos que requieren refrigeracion. El sistema permite a los empleados de farmacia registrar ingresos, ventas y monitorear la temperatura del refrigerador, generando alertas automaticas ante desvios o stock bajo.

## Requisitos Previos

Antes de comenzar, asegurate de tener instalado:
* Node.js (v18 o superior recomendado)
* Docker y Docker Compose (para la base de datos)

## Instalacion y Configuracion

El proyecto esta dividido en tres partes: Base de Datos (Docker), Backend (API) y Frontend (Client).

### 1. Configuracion del Backend (API) e Iniciar la Base de Datos (Docker)

1. Abre una terminal y entra en la carpeta de la API:
```
   cd api
```
Ejecuta el siguiente comando para levantar la base de datos en segundo plano:
```
   docker compose up -d
```
   (Esto iniciara el contenedor de MongoDB necesario para que la API funcione).
   
2. Instala las dependencias necesarias:
```
   npm install
```
3. Crea un archivo llamado .env en la raiz de la carpeta api y agrega las siguientes variables de entorno (no uses espacios alrededor del igual):
```
   PORT=3000
   MONGO_URL=mongodb://localhost:27017/sgmr
   JWT_SECRET=escribe_aqui_tu_clave_secreta_real
```
4. Inicia el servidor de desarrollo:
```
   npm run dev
```
   La API deberia estar corriendo en http://localhost:3000

### 2. Configuracion del Frontend (Cliente)

1. Abre una segunda terminal (sin cerrar la anterior) y entra en la carpeta del cliente:
```
   cd client
```
2. Instala las dependencias:
```
   npm install
```
3. Inicia la aplicacion de React:
```
   npm run dev
```
   El frontend deberia estar corriendo en http://localhost:5173

## Ejecucion de Tests

Para correr las pruebas automatizadas definidas en el sistema:

1. Ve a la terminal de la carpeta api:
```
   cd api
```
2. Ejecuta el comando de test:
```
   npm test
```
## Tecnologias Usadas

* Backend: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt.
* Frontend: React, Vite, React Router DOM, Bootstrap, Axios.
* Base de Datos: MongoDB.
* Testing: Cucumber JS.

## Autor

Javier Villafañe

