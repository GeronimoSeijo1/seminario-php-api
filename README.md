## Librerias
Ejecutar el comando para instalar las dependencias utilizadas:
- jwt-decode
- axios
- bootstrap
- bootstrap-icons
- react-router-dom
```bash
npm install
```

### Librería jwt-decode en frontend 
Se instaló la librería jwt-decode en el frontend para decodificar el token JWT recibido al hacer login. Esto permite extraer el id del usuario directamente del token, evitando almacenar ese dato manualmente o hacer una llamada adicional al backend para obtenerlo.

## ENDPOINTS

### Modificación de Endpoint: GET /estadisticas
El motivo fue para adaptar la respuesta para que el frontend pueda visualizar correctamente el rendimiento de los usuarios.

Cambios realizados:
- Se agregaron los campos usuario (nombre de usuario) y nombre (nombre público) a la respuesta.
- Se calculó en el controlador:
  * total_partidas: suma de partidas ganadas, perdidas y empatadas.
  * winrate: porcentaje de partidas ganadas sobre el total.
- Se modificó la consulta SQL para realizar un JOIN con la tabla usuario.

### Nuevo endpoint: GET /partidas/{partidaId}/cartas/servidor
Se necesitaba un endpoint que liste las cartas que tiene el servidor con estado 'EN_MANO'.

### Nuevo endpoint: GET /usuarios/{usuarioId}/mazos/{mazoId}/cartas
Se agregó el siguiente endpoint para permitir que un usuario logueado obtenga las cartas asociadas a uno de sus mazos.

### Modificacion de Endpoint: GET /cartas?atributo={atributo}&nombre={nombre}
Para poder construir nuevos mazos desde el frontend, era necesario contar con el id de cada carta dentro de la respuesta del endpoint de listado de cartas. Sin ese id, no era posible distinguir o seleccionar cartas de forma precisa al armar un nuevo mazo.
Cambios realizados:
- Dentro del método listaCartas() en el model de Mazo, se agregó explícitamente el campo: c.id AS carta_id.

### Modificacion de Endpoint: GET /usuarios/{usuario}/mazos
Se modificó la respuesta cuando un usuario no tiene mazos registrados, en la funcion listarMazos del MazoController: Ahora cuando $lista está vacía, el controlador devuelve una respuesta exitosa (200) con un objeto JSON que incluye "la lista de mazos del usuario logueado vacia" junto con un array vacío ([]).