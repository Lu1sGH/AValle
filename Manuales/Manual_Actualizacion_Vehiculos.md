# Manual de Actualización de Vehículos (Autos del Valle)

Este documento describe el procedimiento provisional para actualizar la sección de "Vehículos en Venta" de la página web de Autos del Valle, mientras se implementa un sistema de backend definitivo.

Este manual está diseñado para ser comprendido por humanos, LLMs o agentes de programación autónomos.

---

## 1. Estructura de datos (`vehicles.json`)

Toda la información de los vehículos se almacena en formato JSON en la siguiente ruta:

```
src/app/vehicles.json
```

### Formato de un vehículo

Para agregar un nuevo vehículo, añade un objeto JSON al arreglo principal con la siguiente estructura:

```json
{
  "id": "identificador_unico",
  "title": "TÍTULO DEL VEHÍCULO",
  "shortDesc": "Descripción corta que aparece en la tarjeta",
  "price": 500000,
  "details": [
    "FACTURA ORIGINAL",
    "TODO PAGADO HASTA EL 2026",
    "MOTOR 3.0 6CIL BITURBO 390HP"
  ],
  "promo": [
    "¡NO DEJES QUE TE LA GANEN!",
    "CONTAMOS CON PLANES DE FINANCIAMIENTO DESDE UN 30% DE ENGANCHE..."
  ],
  "imageCount": 10,
  "ext": "jpeg"
}
```

### Referencia de campos

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | string | Sí | Identificador único del vehículo. Debe ir en minúsculas, sin espacios (usar guiones bajos `_`), sin acentos ni caracteres especiales. Es crítico, ya que el sistema lo usa para localizar automáticamente las imágenes. Ejemplo: `audi_rs3_2020`. |
| `title` | string | Sí | Título del vehículo tal como aparece en la tarjeta. |
| `shortDesc` | string | Sí | Descripción corta que aparece en la tarjeta. |
| `price` | number | Sí | Precio de venta del vehículo, en pesos mexicanos (MXN). Se escribe como número, sin comillas, comas ni símbolo de moneda (ej. `500000`). |
| `details` | array de strings | Sí | Información técnica del vehículo; cada elemento se muestra como un punto en la lista de detalles de la tarjeta. |
| `promo` | array de strings | No | Mensajes que se resaltan en rojo en la tarjeta. Puede omitirse o dejarse como arreglo vacío (`"promo": []`) si el vehículo no tiene promociones. |
| `imageCount` | number | Sí | Cantidad exacta de fotos del vehículo. El sistema genera las rutas de imagen a partir de este número. |
| `ext` | string | No (por defecto `jpeg`) | Extensión de las fotos del vehículo. Admite únicamente `jpg`, `jpeg` o `png`. Si se omite, el sistema asume `jpeg`. |

> **Nota:** el `id` es crítico — debe coincidir exactamente con el prefijo usado en los nombres de archivo de las imágenes correspondientes (ver sección 2).

---

## 2. Gestión de imágenes

Las fotografías que pertenecen al catálogo de vehículos en venta deben colocarse organizadamente en la siguiente subcarpeta:

```
public/coches/
```

> **Nota de diseño:** las imágenes base (`car1.jpeg`, `car2.jpeg`, etc.) que se usan en el carrusel superior (marquee) se mantienen en la raíz de `public/`, ya que se consideran parte del diseño estructural de la página y no del inventario de ventas. No debes alterarlas al actualizar el inventario.

### Regla de nombrado de imágenes

El sistema asocia las imágenes a los vehículos a través de su `id`. Para que una imagen se muestre, debe cumplir esta convención de nombres:

```
[id_del_vehiculo]_[numero_de_foto].[ext]
```

### Ejemplo de flujo de imágenes

Si en `vehicles.json` creaste un vehículo con `"id": "honda_civic_2022"`, `"imageCount": 3` y `"ext": "png"`, debes colocar exactamente 3 imágenes en `public/coches/`, nombradas de la siguiente manera:

- `honda_civic_2022_1.png` — esta será la imagen principal que aparece en la tarjeta
- `honda_civic_2022_2.png`
- `honda_civic_2022_3.png`

### Notas importantes sobre las imágenes

1. **Extensión:** si el campo `ext` se omite en el JSON, el sistema asume por defecto `jpeg`. Si vas a usar `jpg` o `png`, declara el campo `ext` explícitamente para que coincida con los archivos.
2. **Foto principal:** la imagen con el sufijo `_1` siempre será la portada. Asegúrate de que sea la mejor foto del vehículo.

---

## 3. Resumen de flujo para un nuevo vehículo

1. Reduce el peso de las fotografías (`jpg`, `jpeg` o `png`) del nuevo vehículo para optimizar la carga web.
2. Nómbralas consecutivamente siguiendo la regla: `marca_modelo_año_1.ext`, `marca_modelo_año_2.ext`, etc.
3. Mueve las fotografías a `public/coches/`.
4. Abre `src/app/vehicles.json` y agrega un nuevo bloque JSON respetando las llaves y la sintaxis. Declara `id`, `title`, `shortDesc`, `price`, `details`, `promo` (opcional), `imageCount` y `ext` (si aplica). Asegúrate de que el `id` sea idéntico al usado en los nombres de las fotos.
5. El sistema detectará automáticamente el cambio y ensamblará la nueva tarjeta, su galería y la ventana modal con todos los detalles.

---

*Autos del Valle — Manual interno de actualización de inventario.*
