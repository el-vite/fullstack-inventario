# Sistema de Gestión de Inventario

Aplicación web full-stack para la gestión de productos y transacciones de inventario, desarrollada como parte de una evaluación técnica de conocimientos. La arquitectura se basa en microservicios con un backend en .NET y un frontend en Angular.

---

## Requisitos Previos

Para ejecutar este proyecto en un entorno local, necesitarás tener instalado el siguiente software:

* **.NET SDK:** Versión 8.0 o superior.
* **Node.js:** Versión 18.0 o superior (incluye `npm`).
* **Angular CLI:** Instalar globalmente con `npm install -g @angular/cli`.
* **SQL Server:** Cualquier edición, como SQL Server 2022 Express.
* **Git:** Para clonar el repositorio.

---

## Puesta en Marcha

Sigue estos pasos para configurar el proyecto por primera vez.

### 1. Clonar el Repositorio


git clone <URL_DE_TU_REPOSITORIO>
cd <NOMBRE_DE_LA_CARPETA_DEL_PROYECTO>


### 2. Configurar la Base de Datos

1.  Abre tu gestor de base de datos (como SQL Server Management Studio).
2.  Crea una nueva base de datos llamada **`InventarioDB`**.
3.  Abre el archivo **`database.sql`** que se encuentra en la raíz del proyecto.
4.  Copia y ejecuta el contenido del script en una nueva consulta sobre la base de datos `InventarioDB` para crear las tablas.

### 3. Configurar las Cadenas de Conexión del Backend

Este paso debe realizarse en **ambos** proyectos del backend (`ProductService` y `TransactionService`).

1.  Abre el archivo `backend/ProductService/appsettings.json`.
2.  Abre el archivo `backend/TransactionService/appsettings.json`.
3.  En ambos archivos, modifica la sección `ConnectionStrings` con tus credenciales de SQL Server.

**Ejemplo usando Autenticación de Windows:**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=NOMBRE-DE-TU-SERVIDOR\\SQLEXPRESS;Database=InventarioDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}

```


## Ejecución del Backend

Los dos microservicios deben ejecutarse simultáneamente. Para ello, necesitarás **dos terminales separadas**.

### Terminal 1: Iniciar `ProductService`

```bash
cd backend/ProductService
dotnet run

```

Este servicio se iniciará en un puerto diferente, como http://localhost:5089.

Importante: Asegúrate de que el puerto del ProductService que anotaste coincida con el configurado en el archivo Program.cs del TransactionService (en la sección AddHttpClient).


Ejecución del Frontend
Una vez que el backend esté corriendo, puedes iniciar la aplicación de Angular.

1.Abre una tercera terminal.

2.Navega a la carpeta del proyecto de Angular:

cd frontend/inventario-app

3.Instala todas las dependencias (solo la primera vez):
```bash
npm install
```
4.Inicia el servidor de desarrollo:
```bash
ng serve -o
```
Esto abrirá automáticamente tu navegador en http://localhost:4200, donde podrás ver y usar la aplicación.

Capturas

• Listado dinámico de productos y transacciones con paginación.
<img width="1317" height="946" alt="Pantalla para la creación de productos" src="https://github.com/user-attachments/assets/0c6798c5-4b0d-4805-8c3a-014e3c133839" />
<img width="1317" height="946" alt="imagen_2025-09-28_185212723" src="https://github.com/user-attachments/assets/9be49d76-beae-4771-9643-2e83961e8629" />


• Pantalla para la creación de productos.
<img width="1342" height="946" alt="Pantalla para la creación de productos" src="https://github.com/user-attachments/assets/8d68ad6d-1c5c-4458-8d79-3bd830d17aff" />
<img width="1342" height="946" alt="Pantalla para la edición de productos 2" src="https://github.com/user-attachments/assets/4db88e7e-ee33-4a1d-95be-7b442ca91eab" />

• Pantalla para la edición de productos.
<img width="1342" height="946" alt="Pantalla para la edición de productos 1" src="https://github.com/user-attachments/assets/f51a930d-65e3-46ae-add4-7e73d6e5a905" />
<img width="1342" height="946" alt="Pantalla para la edición de productos 2" src="https://github.com/user-attachments/assets/bf4eb156-958e-4df1-9d62-d6e764b78eea" />

• Pantalla para la creación de transacciones.
<img width="1342" height="946" alt="Pantalla para la creación de transacciones" src="https://github.com/user-attachments/assets/ba2f430e-0757-4128-bf89-7096ef064b0c" />
<img width="1342" height="946" alt="Pantalla para la creación de transacciones 2" src="https://github.com/user-attachments/assets/b0f7573c-d625-4af5-a575-a60ae20d0d0b" />

• Pantalla para la edición de transacciones.
<img width="1342" height="946" alt="Pantalla para la edición de transacciones 2 " src="https://github.com/user-attachments/assets/a604de7f-3d70-4065-8bee-89699e942b73" />
<img width="1342" height="946" alt="Pantalla para la edición de transacciones 3 " src="https://github.com/user-attachments/assets/71fb82f7-ee7f-4b5a-943c-fbcd77b0ed58" />
<img width="1342" height="946" alt="Pantalla para la edición de transacciones 4 (error)" src="https://github.com/user-attachments/assets/afa8641a-58e8-403e-b712-973e34e1709a" />

• Pantalla de filtros dinámicos.
<img width="1317" height="946" alt="Pantalla de filtros dinámicos 1" src="https://github.com/user-attachments/assets/07c66c4d-98c8-4041-8245-8b19634ca5e4" />
<img width="1317" height="946" alt="Pantalla de filtros dinámicos 2" src="https://github.com/user-attachments/assets/d774f124-fb2a-4659-b653-111529fe61de" />
