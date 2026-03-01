# Proyecto: Dashboard de un Blog

## Estructura del Proyecto
---
```
├── app.js
├── db/
│   ├── pool.js
│   ├── schema.sql
│   └── database.sqlite
├── models/
│   ├── userRepo.js
│   ├── postRepo.js
│   └── commentRepo.js
├── services/
│   ├── syncService.js
│   └── statsService.js
├── routes/
│   ├── sync.js
│   ├── dashboard.js
│   └── api.js
├── views/
│   ├── dashboard.ejs
│   └── partials/
├── public/
│   ├── css/
│   ├── js/
│   └── vendor/chart.umd.min.js
└── middleware/
    └── errorHandler.js
```
- **Routes** → controladores HTTP
- **Services** → lógica de negocio
- **Models (Repos)** → acceso a base de datos
- **Views** → presentación 
- **Public** → recursos estáticos

<br>

## Base de Datos
---
Las tablas que han sido creadas son:
### users

- id (PK)
- name
- username (UNIQUE)
- email (UNIQUE)
- created_at

### posts

- id (PK)
- user_id (FK → users.id)
- title
- body

### comments

- id (PK)
- post_id (FK → posts.id)
- name
- email
- body

Las claves foráneas son activadas en SQLite con:
```
db.pragma('foreign_keys = ON');
```

## Sicronización de datos
```
GET /sync
```

Esta ruta sirve para poder traer los datos de la API pública y guardarlos en la base de datos que tenemos local. Al acceder a esa ruta accedemos a esta ruta, el servidor automáticamente realiza esa sincronización.

Se descargan tres recursos de la API:

- `/users` → usuarios
- `/posts` → publicaciones
- `/comments` → comentarios

Los datos no se duplican porque se ha utilizado:
```
ON CONFLICT(id)
```
Entonces en el caso de no existir el registro se inserta y si existe se actualiza. Gracias a esto la sincronización se puede ejecutar varias veces sin que se dupliquen los datos.

<br>

## API REST
---
```
GET /api/stats
```

Devuelve las métricas agregadas calculadas en SQL

<br>

## Métricas implementadas
---
Se han calculado diferentes métricas a partir de los datos almacenados que se encuentran en la base de datos donde se generan mediante consultas SQL y posteriormente se utilizan en el dashboard. 

Estas estadísticas se obtienen a través del método `getStats()`del archivo `statsService.js`. 

Primero se calculan los totales de cada tabla:
- Número total de usuarios
- Número total de posts
- Número total de comentarios

### Totales globales
Consulta utilizada:
```sql
SELECT
    (SELECT COUNT(*) FROM users) AS totalUsers,
    (SELECT COUNT(*) FROM posts) AS totalPosts,
    (SELECT COUNT(*) FROM comments) AS totalComments
```

Con esto se muestra en el dashboard 3 tarjetas con los valores globales del sistema.

### Media del contenido del post por usuario
Al encontrar que JSONPlaceholder todos los usuarios tienen el mismo número de post, se ha utilizado una métrica con variabilidad real calculando la media del contenido de los post de cada usuario con:
```sql
SELECT u.username AS label, 
       ROUND(AVG(LENGTH(p.body)), 0) AS value
FROM users u
JOIN posts p ON p.user_id = u.id
GROUP BY u.id
ORDER BY value DESC
```
Aquí:
- Agrupa los posts por usuario
- Calcula la media de longitud del texto
- Ordena los resultados de mayor a menor

### Top 10 post
En este se ha calculado un ranking de los post según la longitud de su título
```sql
SELECT p.title AS label,
       LENGTH(p.title) AS value
FROM posts p
ORDER BY value ASC
LIMIT 10
```
En esta consulta:
- Calcula la longitud del título de cada post.
- Ordena los resultados.
- Devuelve los 10 primeros.

se visualiza qué títulos son más largos o más cortos

<br>

## Dashboard
---
```
GET /dashboard
```

Esta rutra muestra la parte visual, al acceder se calcula las estadísticas llamando a `getStats()`, renderiza la vista `dashboard.ejs`y envía el HTML al navegador.

Se muestra las tarjetas (KPI cards) con_
- Total de usuarios
- Total de posts
- Total de comentarios

En los gráficos:
- El primero la longitud media del contenido del post por usuario
- El segundo un ranking de posts según la longitud del título

<br>

## Problemas encontrados + soluciones
---
| Problema | Solución |
| --- | --- |
| CSP bloqueaba Chart.js CDN | Se descargó localmente |
| Scripts inline bloqueados | Se eliminaron y se usó atributo `data-stats` |
| Dataset uniforme | Se redefinieron métricas BI |
| Error 500 en dashboard | Se aisló entre `getStats()` y EJS |


<br>

## Justificación de las consultas
---
Al realizar las consultas como número de posts por usuario o número de ocmentrarios por post siempre son iguales ya que tiene una estructura muy regular, para que haya unas métricas con variación se ha utilizado la longitud media del contenido del post por usuario y por la longitud del titulo.