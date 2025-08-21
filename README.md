# Corrector de Código HTML/CSS

Un valida## 🎯 Sistema de Puntaje

- **Aprobación**: ### Advertencias (-1 punto)
17. **Etiquetas semánticas**: Preferir elementos semánticos vs. `<div>`/`<span>`
18. **Nombres de archivo**: Solo minúsculas, guiones, sin espacios ni caracteres especiales
19. **Tamaño de imágenes**: Máximo 500KB por imagen
20. **Nombres de documentos**: Mismas reglas para archivos HTML referenciados
21. **Meta viewport**: Debe incluir viewport responsive- **Acierto**: +1 punto por regla cumplida
- **Error crítico**: -2 a -5 puntos
- **Advertencia**: -1 punto
- **Estructura mínima**: +2 puntos (por ser fundamental)
- **Secuencia semántica**: +2 puntos (por ser compleja)

### 📚 Regla de Secuencia Lógica Semántica

Esta regla valida aspectos fundamentales de la semántica HTML5:

#### ✅ **Jerarquía de Encabezados Correcta**
```html
<h1>Título Principal</h1>
<h2>Subtítulo</h2>
<h3>Sub-subtítulo</h3>
<!-- ❌ NO: <h1> → <h3> (saltar h2) -->
<!-- ❌ NO: <h2> antes de <h1> -->
```

#### ✅ **Header Semánticamente Correcto**
```html
<header>
    <h1>Título del sitio</h1>  <!-- ✅ SÍ: h1 en header -->
    <!-- ❌ NO: <h2> en lugar de <h1> -->
    <!-- ❌ NO: múltiples encabezados en header -->
</header>
```

#### ✅ **Nav Solo para Navegación**
```html
<nav>
    <!-- ✅ SÍ: solo enlaces de navegación -->
    <ul>
        <li><a href="inicio.html">Inicio</a></li>
    </ul>
    <!-- ❌ NO: <h2>, <h3>, etc. en nav -->
    <!-- ❌ NO: <li> sin <ul> padre -->
</nav>
```

#### ✅ **Imágenes con Atributo Alt**
```html
<!-- ✅ SÍ: Imagen informativa con descripción -->
<img src="grafico-ventas.png" alt="Gráfico que muestra el crecimiento de ventas del 25% en 2024">

<!-- ✅ SÍ: Imagen decorativa (alt vacío) -->
<img src="decoracion.png" alt="">

<!-- ❌ NO: Sin atributo alt -->
<img src="importante.jpg">

<!-- ❌ NO: Alt vacío en imagen informativa -->
<img src="mapa-ubicacion.jpg" alt="">
```

#### ✅ **Orden Lógico de Secciones**
```html
<header>...</header>  <!-- 1º -->
<nav>...</nav>        <!-- 2º -->
<main>...</main>      <!-- 3º -->
<aside>...</aside>    <!-- Opcional, flexible -->
<footer>...</footer>  <!-- Último -->
```código HTML/CSS diseñado específicamente para la asignatura "Lenguaje Semántico y Hojas de Estilo". Permite a los estudiantes analizar su código y recibir feedback inmediato sobre errores y aciertos según reglas pedagógicas específicas.

## 🚀 Características

- **Análisis en tiempo real** de código HTML y CSS inline
- **15 reglas de validación** específicas para la asignatura
- **Sistema de puntaje** con feedback positivo y negativo
- **Resaltado visual** de errores en el código
- **Gráficos interactivos** con distribución de resultados
- **Exportación** de reportes en JSON
- **Interfaz responsive** con Bootstrap 5.3
- **Accesibilidad** incorporada con ARIA

## 📋 Reglas de Validación

### Errores Críticos (-2 a -5 puntos)
1. **Estructura HTML básica**: DOCTYPE, html, head, body correctos (-5 pts)
2. **Etiquetas cerradas**: Todas las etiquetas deben cerrarse correctamente (-3 pts)
3. **Secuencia lógica semántica**: Orden correcto h1→h2→h3, header con h1, nav sin encabezados (-3 pts)
4. **Único H1**: Solo puede haber un elemento `<h1>` por documento
5. **LI dentro de UL**: Todos los `<li>` deben estar dentro de `<ul>`
6. **href solo en A**: El atributo `href` solo en elementos `<a>`
7. **src solo en IMG**: El atributo `src` solo en elementos `<img>`
8. **Imágenes con alt**: Todas las imágenes deben tener atributo `alt` declarado
9. **Botones en formularios**: Los `<button>` deben estar dentro de `<form>`
10. **Sin tablas**: Prohibido usar `<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<td>`, `<th>`
11. **Sin etiquetas visuales**: Prohibido `<u>`, `<b>`, `<i>`
12. **Estructura mínima**: Debe contener `<header>`, `<nav>`, `<main>`, `<footer>`
13. **Estructura NAV**: Los elementos `<nav>` deben seguir la estructura `nav > ul > li > a`
14. **Título del documento**: Debe existir `<title>` en `<head>`
15. **Codificación UTF-8**: Debe tener `<meta charset="UTF-8">`
16. **Controles multimedia**: `<audio>` y `<video>` deben tener `controls`, `<video>` debe tener `muted`

### Advertencias (-1 punto)
15. **Etiquetas semánticas**: Preferir elementos semánticos vs. `<div>`/`<span>`
16. **Nombres de archivo**: Solo minúsculas, guiones, sin espacios ni caracteres especiales
17. **Tamaño de imágenes**: Máximo 500KB por imagen
18. **Nombres de documentos**: Mismas reglas para archivos HTML referenciados
19. **Meta viewport**: Debe incluir viewport responsive

## 🎯 Sistema de Puntaje

- **Aprobación**: ≥ 60%
- **Acierto**: +1 punto por regla cumplida
- **Error crítico**: -2 puntos
- **Advertencia**: -1 punto
- **Estructura mínima**: +2 puntos (por ser fundamental)

## 🛠️ Instalación y Uso

### Requisitos
- Servidor web (Apache, Nginx, o servidor local como MAMP, XAMPP)
- Navegador moderno con soporte para ES6+

### Instalación
1. Descarga o clona todos los archivos del proyecto
2. Coloca los archivos en el directorio web de tu servidor
3. Accede a `index.html` desde tu navegador

### Estructura de Archivos
```
corrector-web/
├── index.html          # Interfaz principal
├── styles.css          # Estilos personalizados
├── app.js             # Lógica principal de la aplicación
├── rules.js           # Definición de reglas y configuración
└── README.md          # Documentación
```

### Dependencias CDN
- Bootstrap 5.3.0 (CSS y JS)
- Chart.js (gráficos)
- FontAwesome 6.4.0 (iconos)

## 💻 Guía de Uso

### Para Estudiantes

1. **Preparar el código**
   - Copia tu código HTML completo
   - Incluye CSS inline si tienes

2. **Analizar**
   - Pega el código en el editor
   - Presiona "Analizar" o usa `Ctrl+Enter`

3. **Revisar resultados**
   - Revisa el puntaje y porcentaje
   - Examina la tabla de hallazgos
   - Haz clic en los hallazgos para ver el código resaltado

4. **Corregir y mejorar**
   - Sigue las sugerencias proporcionadas
   - Vuelve a analizar después de hacer cambios

### Para Profesores

1. **Configurar criterios**
   - Edita `rules.js` para ajustar puntajes
   - Modifica `config.passingScore` para cambiar el umbral de aprobación

2. **Exportar reportes**
   - Los estudiantes pueden descargar reportes JSON
   - Usa "Copiar Feedback" para obtener texto formateado

## 🧪 Casos de Prueba

### HTML de Prueba Básico
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Página Web</title>
</head>
<body>
    <header>
        <h1>Título Principal</h1>
        <nav>
            <ul>
                <li><a href="inicio.html">Inicio</a></li>
                <li><a href="acerca.html">Acerca</a></li>
                <li><a href="contacto.html">Contacto</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section>
            <h2>Contenido Principal</h2>
            <article>
                <h3>Artículo</h3>
                <p>Contenido del artículo...</p>
                <img src="imagen.jpg" alt="Descripción">
            </article>
        </section>
        
        <aside>
            <h3>Barra Lateral</h3>
            <p>Contenido adicional...</p>
        </aside>
    </main>
    
    <footer>
        <form>
            <button type="submit">Enviar</button>
        </form>
    </footer>
</body>
</html>
```

### HTML con Errores Comunes
```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>
    <!-- Error: Secuencia de encabezados incorrecta -->
    <h2>Subtítulo antes de h1</h2>
    <h1>Primer Título</h1>
    <h1>Segundo Título</h1>
    
    <!-- Error: Header mal estructurado -->
    <header>
        <h2>Debería ser h1</h2>
        <nav>
            <h3>Encabezado en nav (incorrecto)</h3>
            <li>Item sin ul</li>
            <li>Otro item sin ul</li>
        </nav>
    </header>
    
    <!-- Error: NAV mal estructurado -->
    <nav>
        <a href="inicio.html">Inicio</a>
        <a href="acerca.html">Acerca</a>
    </nav>
    
    <!-- Error: Orden semántico incorrecto -->
    <footer>
        <p>Footer antes de main</p>
    </footer>
    
    <main>
        <!-- Error: Salto de nivel h1 → h3 -->
        <h3>Debería ser h2</h3>
    </main>
    
    <li>Item sin lista</li>
    
    <div href="enlace.html">Enlace incorrecto</div>
    
    <button>Botón fuera de formulario</button>
    
    <table>
        <tr><td>Tabla prohibida</td></tr>
    </table>
    
    <b>Texto en negrita</b>
    <i>Texto en cursiva</i>
    
    <!-- Error: Imágenes sin alt -->
    <img src="imagen1.jpg">
    <img src="imagen2.png" alt="">
    <img>
    
    <audio src="audio.mp3"></audio>
    <video src="video.mp4"></video>
</body>
</html>
```

## ⚙️ Configuración Avanzada

### Modificar Puntajes
Edita `rules.js` para ajustar los puntajes:

```javascript
const VALIDATION_RULES = {
    config: {
        passingScore: 70,        // Cambiar umbral de aprobación
        defaultSuccessPoints: 2, // Cambiar puntos por acierto
        defaultErrorPoints: -3   // Cambiar puntos por error
    },
    // ...
};
```

### Agregar Nuevas Reglas
```javascript
newRule: {
    id: 'nueva-regla',
    descripcion: 'Descripción de la nueva regla',
    tipo: 'error', // 'error' o 'warning'
    puntaje_ok: 1,
    puntaje_error: -2,
    detectar: function(document, rawHtml) {
        // Lógica de validación
        return {
            passed: true/false,
            matches: [elementos],
            message: 'Mensaje descriptivo',
            suggestion: 'Sugerencia de mejora'
        };
    }
}
```

## 🔧 Solución de Problemas

### Problemas Comunes

**El análisis no funciona**
- Verifica que el HTML tenga estructura básica válida
- Revisa la consola del navegador para errores
- Asegúrate de que todas las dependencias CDN se carguen

**Imágenes no se validan**
- Las imágenes deben ser accesibles vía HTTP/HTTPS
- Se requiere CORS para verificar tamaño de imágenes externas
- Imágenes data: URI no se validan por tamaño

**El gráfico no aparece**
- Verifica que Chart.js se haya cargado correctamente
- Revisa la consola para errores de JavaScript

### Limitaciones Conocidas

- **Parsing HTML**: Usa DOMParser que puede ser permisivo con HTML malformado
- **Validación de imágenes**: Limitada por políticas CORS
- **CSS externo**: No analiza archivos CSS externos, solo CSS inline
- **JavaScript**: No ejecuta ni valida código JavaScript del estudiante

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Características Requeridas
- ES6+ (Arrow functions, const/let, template literals)
- Fetch API
- Promise/async-await
- CSS Grid y Flexbox

## 🤝 Contribución

### Para Desarrolladores

1. **Fork** el repositorio
2. **Crear rama** para nueva funcionalidad
3. **Implementar** cambios con tests
4. **Documentar** nuevas características
5. **Pull request** con descripción detallada

### Para Educadores

1. **Reportar bugs** con ejemplos específicos
2. **Sugerir reglas** nuevas con justificación pedagógica
3. **Compartir casos de uso** exitosos
4. **Proponer mejoras** en la interfaz

## 📄 Licencia

Este proyecto está bajo licencia MIT. Eres libre de usar, modificar y distribuir el código con atribución apropiada.

## 👥 Créditos

- **Bootstrap**: Framework CSS
- **Chart.js**: Gráficos interactivos
- **FontAwesome**: Iconografía
- **MDN Web Docs**: Referencia para validaciones HTML

## 📞 Soporte

Para reportar problemas o solicitar ayuda:

1. **Issues GitHub**: Para bugs y solicitudes de características
2. **Documentación**: Revisa este README primero
3. **Ejemplos**: Usa los casos de prueba incluidos

---

**¡Feliz codificación y aprendizaje! 🎓**
