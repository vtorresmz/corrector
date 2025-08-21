// Configuración de reglas de validación
const VALIDATION_RULES = {
    // Configuración general
    config: {
        passingScore: 60,
        defaultSuccessPoints: 1,
        defaultErrorPoints: -2
    },

    // Definición de reglas
    rules: {
        uniqueH1: {
            id: 'unique-h1',
            descripcion: 'Único H1 por documento',
            tipo: 'error',
            puntaje_ok: 1,
            puntaje_error: -2,
            detectar: function(document, rawHtml) {
                const h1Elements = document.querySelectorAll('h1');
                const count = h1Elements.length;
                
                if (count === 0) {
                    return {
                        passed: false,
                        matches: [],
                        message: 'No se encontró ningún elemento H1. El documento debe tener exactamente un H1.',
                        suggestion: 'Agrega un elemento <h1> con el título principal del documento.'
                    };
                } else if (count === 1) {
                    return {
                        passed: true,
                        matches: [h1Elements[0]],
                        message: 'Correcto: El documento tiene exactamente un elemento H1.',
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: Array.from(h1Elements),
                        message: `Error: Se encontraron ${count} elementos H1. Solo debe haber uno.`,
                        suggestion: 'Utiliza H2, H3, etc. para los subtítulos. El H1 debe ser único y contener el título principal.'
                    };
                }
            }
        },

        liInUl: {
            id: 'li-in-ul',
            descripcion: 'LI dentro de UL',
            tipo: 'error',
            puntaje_ok: 1,
            puntaje_error: -2,
            detectar: function(document, rawHtml) {
                const allLi = document.querySelectorAll('li');
                const invalidLi = [];
                
                allLi.forEach(li => {
                    const parent = li.parentElement;
                    if (!parent || parent.tagName !== 'UL') {
                        invalidLi.push(li);
                    }
                });
                
                if (invalidLi.length === 0) {
                    return {
                        passed: true,
                        matches: Array.from(allLi),
                        message: `Correcto: Todos los elementos LI (${allLi.length}) están dentro de elementos UL.`,
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: invalidLi,
                        message: `Error: ${invalidLi.length} elementos LI no están dentro de UL.`,
                        suggestion: 'Envuelve todos los elementos <li> dentro de elementos <ul>. Los <li> no pueden estar sueltos o dentro de <ol>.'
                    };
                }
            }
        },

        hrefOnlyInA: {
            id: 'href-only-in-a',
            descripcion: 'href solo en etiquetas A',
            tipo: 'error',
            puntaje_ok: 1,
            puntaje_error: -2,
            detectar: function(document, rawHtml) {
                const elementsWithHref = document.querySelectorAll('[href]');
                const invalidElements = [];
                
                elementsWithHref.forEach(element => {
                    if (element.tagName !== 'A') {
                        invalidElements.push(element);
                    }
                });
                
                if (invalidElements.length === 0) {
                    return {
                        passed: true,
                        matches: Array.from(elementsWithHref),
                        message: `Correcto: Todos los atributos href (${elementsWithHref.length}) están en elementos A.`,
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: invalidElements,
                        message: `Error: ${invalidElements.length} elementos con href no son etiquetas A.`,
                        suggestion: 'El atributo href solo debe usarse en elementos <a>. Para otros elementos usa atributos apropiados como src, data-*, etc.'
                    };
                }
            }
        },

        srcOnlyInImg: {
            id: 'src-only-in-img',
            descripcion: 'src solo en IMG',
            tipo: 'error',
            puntaje_ok: 1,
            puntaje_error: -2,
            detectar: function(document, rawHtml) {
                const elementsWithSrc = document.querySelectorAll('[src]');
                const invalidElements = [];
                const imgWithoutSrc = document.querySelectorAll('img:not([src]), img[src=""]');
                
                elementsWithSrc.forEach(element => {
                    if (element.tagName !== 'IMG') {
                        invalidElements.push(element);
                    }
                });
                
                if (invalidElements.length === 0 && imgWithoutSrc.length === 0) {
                    return {
                        passed: true,
                        matches: Array.from(elementsWithSrc),
                        message: `Correcto: Todos los atributos src están en elementos IMG válidos.`,
                        suggestion: null
                    };
                } else {
                    const errors = [];
                    if (invalidElements.length > 0) {
                        errors.push(`${invalidElements.length} elementos con src no son IMG`);
                    }
                    if (imgWithoutSrc.length > 0) {
                        errors.push(`${imgWithoutSrc.length} elementos IMG sin src válido`);
                    }
                    
                    return {
                        passed: false,
                        matches: [...invalidElements, ...imgWithoutSrc],
                        message: `Error: ${errors.join(', ')}.`,
                        suggestion: 'El atributo src solo debe usarse en elementos <img>, y cada <img> debe tener un src válido y no vacío.'
                    };
                }
            }
        },

        buttonsInForms: {
            id: 'buttons-in-forms',
            descripcion: 'Botones dentro de formularios',
            tipo: 'error',
            puntaje_ok: 1,
            puntaje_error: -2,
            detectar: function(document, rawHtml) {
                const allButtons = document.querySelectorAll('button');
                const invalidButtons = [];
                
                allButtons.forEach(button => {
                    let parent = button.parentElement;
                    let inForm = false;
                    
                    while (parent) {
                        if (parent.tagName === 'FORM') {
                            inForm = true;
                            break;
                        }
                        parent = parent.parentElement;
                    }
                    
                    if (!inForm) {
                        invalidButtons.push(button);
                    }
                });
                
                if (invalidButtons.length === 0) {
                    return {
                        passed: true,
                        matches: Array.from(allButtons),
                        message: `Correcto: Todos los botones (${allButtons.length}) están dentro de formularios.`,
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: invalidButtons,
                        message: `Error: ${invalidButtons.length} botones no están dentro de un elemento FORM.`,
                        suggestion: 'Envuelve todos los elementos <button> dentro de elementos <form>, o usa elementos <a> para acciones de navegación.'
                    };
                }
            }
        },

        noTables: {
            id: 'no-tables',
            descripcion: 'Prohibido usar tablas',
            tipo: 'error',
            puntaje_ok: 1,
            puntaje_error: -2,
            detectar: function(document, rawHtml) {
                const tableElements = document.querySelectorAll('table, thead, tbody, tfoot, tr, td, th');
                
                if (tableElements.length === 0) {
                    return {
                        passed: true,
                        matches: [],
                        message: 'Correcto: No se utilizaron elementos de tabla.',
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: Array.from(tableElements),
                        message: `Error: Se encontraron ${tableElements.length} elementos de tabla prohibidos.`,
                        suggestion: 'Usa CSS Grid o Flexbox para el layout. Las tablas solo deben usarse para datos tabulares reales.'
                    };
                }
            }
        },

        noVisualTags: {
            id: 'no-visual-tags',
            descripcion: 'Evitar etiquetas visuales',
            tipo: 'error',
            puntaje_ok: 1,
            puntaje_error: -2,
            detectar: function(document, rawHtml) {
                const visualTags = document.querySelectorAll('u, b, i');
                
                if (visualTags.length === 0) {
                    return {
                        passed: true,
                        matches: [],
                        message: 'Correcto: No se utilizaron etiquetas visuales (<u>, <b>, <i>).',
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: Array.from(visualTags),
                        message: `Error: Se encontraron ${visualTags.length} etiquetas visuales prohibidas.`,
                        suggestion: 'Usa CSS para estilos visuales y etiquetas semánticas: <strong> en lugar de <b>, <em> en lugar de <i>, CSS text-decoration para subrayado.'
                    };
                }
            }
        },

        semanticTags: {
            id: 'semantic-tags',
            descripcion: 'Preferir etiquetas semánticas HTML5',
            tipo: 'warning',
            puntaje_ok: 1,
            puntaje_error: -1,
            detectar: function(document, rawHtml) {
                const divs = document.querySelectorAll('div');
                const spans = document.querySelectorAll('span');
                const semanticTags = document.querySelectorAll('header, nav, main, section, article, aside, footer, figure, figcaption');
                
                const totalGeneric = divs.length + spans.length;
                const semanticCount = semanticTags.length;
                
                // Si hay muchos divs/spans y pocos elementos semánticos, es un problema
                const ratio = totalGeneric > 0 ? semanticCount / totalGeneric : 1;
                
                if (totalGeneric <= 3 || ratio >= 0.3) {
                    return {
                        passed: true,
                        matches: Array.from(semanticTags),
                        message: `Correcto: Buen uso de etiquetas semánticas (${semanticCount} semánticas vs ${totalGeneric} genéricas).`,
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: Array.from(divs).slice(0, 5), // Muestra solo los primeros 5
                        message: `Advertencia: Uso excesivo de DIV/SPAN (${totalGeneric}) con pocas etiquetas semánticas (${semanticCount}).`,
                        suggestion: 'Reemplaza algunos <div> con elementos semánticos: <header>, <nav>, <main>, <section>, <article>, <aside>, <footer>.'
                    };
                }
            }
        },

        requiredStructure: {
            id: 'required-structure',
            descripcion: 'Estructura mínima requerida',
            tipo: 'error',
            puntaje_ok: 2,
            puntaje_error: -3,
            detectar: function(document, rawHtml) {
                const requiredElements = ['header', 'nav', 'main', 'footer'];
                const missingElements = [];
                const foundElements = [];
                
                requiredElements.forEach(tagName => {
                    const element = document.querySelector(tagName);
                    if (element) {
                        foundElements.push(element);
                    } else {
                        missingElements.push(tagName);
                    }
                });
                
                if (missingElements.length === 0) {
                    return {
                        passed: true,
                        matches: foundElements,
                        message: 'Correcto: El documento contiene todos los elementos estructurales requeridos.',
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: foundElements,
                        message: `Error: Faltan elementos estructurales: ${missingElements.join(', ')}.`,
                        suggestion: `Agrega los elementos faltantes: ${missingElements.map(el => `<${el}>`).join(', ')}. Son obligatorios para una estructura semántica correcta.`
                    };
                }
            }
        },

        validFilenames: {
            id: 'valid-filenames',
            descripcion: 'Nombres de archivo válidos',
            tipo: 'warning',
            puntaje_ok: 1,
            puntaje_error: -1,
            detectar: function(document, rawHtml) {
                const elementsWithFiles = document.querySelectorAll('[href], [src]');
                const invalidFiles = [];
                const validPattern = /^[a-z0-9._-]+$/;
                
                elementsWithFiles.forEach(element => {
                    const url = element.getAttribute('href') || element.getAttribute('src');
                    if (url && !url.startsWith('http') && !url.startsWith('//') && !url.startsWith('#')) {
                        const filename = url.split('/').pop().split('?')[0].split('#')[0];
                        if (filename && !validPattern.test(filename)) {
                            invalidFiles.push(element);
                        }
                    }
                });
                
                if (invalidFiles.length === 0) {
                    return {
                        passed: true,
                        matches: [],
                        message: 'Correcto: Todos los nombres de archivo son válidos.',
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: invalidFiles,
                        message: `Error: ${invalidFiles.length} archivos con nombres inválidos.`,
                        suggestion: 'Los nombres de archivo deben usar solo minúsculas, números, guiones (-), puntos (.) y guiones bajos (_). Sin espacios, tildes o Ñ.'
                    };
                }
            }
        },

        imageSize: {
            id: 'image-size',
            descripcion: 'Imágenes ≤ 500KB',
            tipo: 'warning',
            puntaje_ok: 1,
            puntaje_error: -1,
            detectar: function(document, rawHtml) {
                const images = document.querySelectorAll('img[src]');
                const results = {
                    passed: true,
                    matches: [],
                    message: 'Verificación de tamaño de imágenes completada.',
                    suggestion: null
                };
                
                // Esta validación se hará de forma asíncrona en el código principal
                // ya que requiere peticiones HTTP
                return results;
            }
        },

        documentTitle: {
            id: 'document-title',
            descripcion: 'Título del documento',
            tipo: 'error',
            puntaje_ok: 1,
            puntaje_error: -2,
            detectar: function(document, rawHtml) {
                const title = document.querySelector('head title');
                
                if (!title) {
                    return {
                        passed: false,
                        matches: [],
                        message: 'Error: No se encontró elemento <title> en el <head>.',
                        suggestion: 'Agrega un elemento <title> dentro del <head> con el título del documento.'
                    };
                } else if (!title.textContent.trim()) {
                    return {
                        passed: false,
                        matches: [title],
                        message: 'Error: El elemento <title> está vacío.',
                        suggestion: 'El <title> debe contener un texto descriptivo del contenido del documento.'
                    };
                } else {
                    return {
                        passed: true,
                        matches: [title],
                        message: `Correcto: El documento tiene un título válido: "${title.textContent.trim()}".`,
                        suggestion: null
                    };
                }
            }
        },

        utf8Encoding: {
            id: 'utf8-encoding',
            descripcion: 'Codificación UTF-8',
            tipo: 'error',
            puntaje_ok: 1,
            puntaje_error: -2,
            detectar: function(document, rawHtml) {
                const metaCharset = document.querySelector('meta[charset]');
                const metaHttpEquiv = document.querySelector('meta[http-equiv="Content-Type"]');
                
                let hasValidCharset = false;
                let foundElement = null;
                
                if (metaCharset) {
                    const charset = metaCharset.getAttribute('charset').toLowerCase();
                    if (charset === 'utf-8') {
                        hasValidCharset = true;
                        foundElement = metaCharset;
                    }
                }
                
                if (!hasValidCharset && metaHttpEquiv) {
                    const content = metaHttpEquiv.getAttribute('content');
                    if (content && content.toLowerCase().includes('charset=utf-8')) {
                        hasValidCharset = true;
                        foundElement = metaHttpEquiv;
                    }
                }
                
                if (hasValidCharset) {
                    return {
                        passed: true,
                        matches: [foundElement],
                        message: 'Correcto: Se encontró declaración de codificación UTF-8.',
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: [],
                        message: 'Error: No se encontró declaración de codificación UTF-8.',
                        suggestion: 'Agrega <meta charset="UTF-8"> al inicio del elemento <head>.'
                    };
                }
            }
        },

        mediaControls: {
            id: 'media-controls',
            descripcion: 'Medios con controles',
            tipo: 'error',
            puntaje_ok: 1,
            puntaje_error: -2,
            detectar: function(document, rawHtml) {
                const audioElements = document.querySelectorAll('audio');
                const videoElements = document.querySelectorAll('video');
                const invalidElements = [];
                
                audioElements.forEach(audio => {
                    if (!audio.hasAttribute('controls')) {
                        invalidElements.push(audio);
                    }
                });
                
                videoElements.forEach(video => {
                    if (!video.hasAttribute('controls') || !video.hasAttribute('muted')) {
                        invalidElements.push(video);
                    }
                });
                
                const totalMedia = audioElements.length + videoElements.length;
                
                if (totalMedia === 0) {
                    return {
                        passed: true,
                        matches: [],
                        message: 'No se encontraron elementos multimedia.',
                        suggestion: null
                    };
                } else if (invalidElements.length === 0) {
                    return {
                        passed: true,
                        matches: [...audioElements, ...videoElements],
                        message: `Correcto: Todos los elementos multimedia (${totalMedia}) tienen los atributos requeridos.`,
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: invalidElements,
                        message: `Error: ${invalidElements.length} elementos multimedia sin atributos requeridos.`,
                        suggestion: 'Los elementos <audio> y <video> deben tener "controls". Los <video> también deben tener "muted".'
                    };
                }
            }
        },

        validDocumentNames: {
            id: 'valid-document-names',
            descripcion: 'Nombres de documentos válidos',
            tipo: 'warning',
            puntaje_ok: 1,
            puntaje_error: -1,
            detectar: function(document, rawHtml) {
                const links = document.querySelectorAll('a[href], link[href]');
                const invalidDocs = [];
                const validPattern = /^[a-z0-9._-]+$/;
                
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('//')) {
                        const filename = href.split('/').pop().split('?')[0].split('#')[0];
                        if (!validPattern.test(filename)) {
                            invalidDocs.push(link);
                        }
                    }
                });
                
                if (invalidDocs.length === 0) {
                    return {
                        passed: true,
                        matches: [],
                        message: 'Correcto: Todos los nombres de documentos HTML son válidos.',
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: invalidDocs,
                        message: `Error: ${invalidDocs.length} documentos HTML con nombres inválidos.`,
                        suggestion: 'Los nombres de archivos HTML deben seguir las mismas reglas: solo minúsculas, números, guiones y puntos.'
                    };
                }
            }
        },

        navStructure: {
            id: 'nav-structure',
            descripcion: 'Estructura NAV > UL > LI > A',
            tipo: 'error',
            puntaje_ok: 1,
            puntaje_error: -2,
            detectar: function(document, rawHtml) {
                const navElements = document.querySelectorAll('nav');
                const invalidNavs = [];
                const validNavs = [];
                
                if (navElements.length === 0) {
                    return {
                        passed: true,
                        matches: [],
                        message: 'No se encontraron elementos NAV para validar.',
                        suggestion: null
                    };
                }
                
                navElements.forEach(nav => {
                    let isValid = true;
                    const issues = [];
                    
                    // Verificar que tenga UL como hijo directo
                    const directUls = Array.from(nav.children).filter(child => child.tagName === 'UL');
                    if (directUls.length === 0) {
                        isValid = false;
                        issues.push('no tiene elementos UL como hijos directos');
                    }
                    
                    // Verificar estructura UL > LI > A en cada UL
                    const uls = nav.querySelectorAll('ul');
                    uls.forEach(ul => {
                        const lis = ul.querySelectorAll('li');
                        lis.forEach(li => {
                            // Verificar que LI sea hijo directo de UL
                            if (li.parentElement !== ul) {
                                return; // Skip si no es hijo directo
                            }
                            
                            // Verificar que LI tenga A como hijo directo
                            const directAs = Array.from(li.children).filter(child => child.tagName === 'A');
                            if (directAs.length === 0) {
                                isValid = false;
                                issues.push('tiene elementos LI sin enlaces A como hijos directos');
                            }
                        });
                    });
                    
                    // Verificar que no haya elementos A directos en NAV (fuera de la estructura)
                    const directAs = Array.from(nav.children).filter(child => child.tagName === 'A');
                    if (directAs.length > 0) {
                        isValid = false;
                        issues.push('tiene enlaces A como hijos directos (deben estar en LI)');
                    }
                    
                    // Verificar que no haya otros elementos de navegación mal estructurados
                    const allAs = nav.querySelectorAll('a');
                    allAs.forEach(a => {
                        const li = a.parentElement;
                        const ul = li ? li.parentElement : null;
                        
                        if (!li || li.tagName !== 'LI' || !ul || ul.tagName !== 'UL') {
                            isValid = false;
                            if (!issues.includes('tiene enlaces A fuera de la estructura UL > LI')) {
                                issues.push('tiene enlaces A fuera de la estructura UL > LI');
                            }
                        }
                    });
                    
                    if (isValid) {
                        validNavs.push(nav);
                    } else {
                        invalidNavs.push(nav);
                    }
                });
                
                if (invalidNavs.length === 0) {
                    return {
                        passed: true,
                        matches: validNavs,
                        message: `Correcto: Todos los elementos NAV (${navElements.length}) siguen la estructura NAV > UL > LI > A.`,
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: invalidNavs,
                        message: `Error: ${invalidNavs.length} de ${navElements.length} elementos NAV no siguen la estructura correcta.`,
                        suggestion: 'Los elementos NAV deben seguir la estructura semántica: <nav><ul><li><a href="...">Enlace</a></li></ul></nav>. No coloques enlaces directamente en NAV.'
                    };
                }
            }
        },

        htmlStructure: {
            id: 'html-structure',
            descripcion: 'Estructura HTML básica válida',
            tipo: 'error',
            puntaje_ok: 2,
            puntaje_error: -5,
            detectar: function(document, rawHtml) {
                const issues = [];
                
                // Verificar DOCTYPE
                if (!rawHtml.trim().toLowerCase().startsWith('<!doctype html>')) {
                    issues.push('falta declaración DOCTYPE html');
                }
                
                // Verificar elementos fundamentales
                const html = document.querySelector('html');
                const head = document.querySelector('head');
                const body = document.querySelector('body');
                
                if (!html) {
                    issues.push('falta elemento <html>');
                }
                if (!head) {
                    issues.push('falta elemento <head>');
                }
                if (!body) {
                    issues.push('falta elemento <body>');
                }
                
                // Verificar que head esté antes que body
                if (head && body) {
                    const headIndex = Array.from(html.children).indexOf(head);
                    const bodyIndex = Array.from(html.children).indexOf(body);
                    if (headIndex > bodyIndex) {
                        issues.push('<head> debe ir antes que <body>');
                    }
                }
                
                // Verificar etiquetas mal cerradas o malformadas
                const openTags = (rawHtml.match(/<[^/>][^>]*>/g) || []).length;
                const closeTags = (rawHtml.match(/<\/[^>]+>/g) || []).length;
                const selfClosing = (rawHtml.match(/<[^>]*\/>/g) || []).length;
                
                // Tolerancia para etiquetas auto-cerrantes HTML5
                const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
                let voidCount = 0;
                voidElements.forEach(tag => {
                    const regex = new RegExp(`<${tag}[^>]*>`, 'gi');
                    voidCount += (rawHtml.match(regex) || []).length;
                });
                
                const expectedCloseTags = openTags - voidCount - selfClosing;
                if (Math.abs(closeTags - expectedCloseTags) > 2) { // Tolerancia de 2
                    issues.push('posibles etiquetas mal cerradas o malformadas');
                }
                
                if (issues.length === 0) {
                    return {
                        passed: true,
                        matches: [html, head, body].filter(el => el),
                        message: 'Correcto: La estructura HTML básica es válida.',
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: [],
                        message: `Error crítico: ${issues.join(', ')}.`,
                        suggestion: 'Asegúrate de tener un documento HTML bien formado con <!DOCTYPE html>, <html>, <head> y <body> correctamente estructurados.'
                    };
                }
            }
        },

        closedTags: {
            id: 'closed-tags',
            descripcion: 'Etiquetas correctamente cerradas',
            tipo: 'error',
            puntaje_ok: 1,
            puntaje_error: -3,
            detectar: function(document, rawHtml) {
                const issues = [];
                
                // Verificar etiquetas comunes que deben cerrarse
                const requiredClosedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 'a', 'header', 'nav', 'main', 'footer', 'section', 'article', 'aside', 'ul', 'ol', 'li'];
                
                requiredClosedTags.forEach(tag => {
                    const openRegex = new RegExp(`<${tag}[^>]*>`, 'gi');
                    const closeRegex = new RegExp(`</${tag}>`, 'gi');
                    
                    const openMatches = rawHtml.match(openRegex) || [];
                    const closeMatches = rawHtml.match(closeRegex) || [];
                    
                    // Filtrar etiquetas auto-cerrantes
                    const selfClosingMatches = rawHtml.match(new RegExp(`<${tag}[^>]*/>`, 'gi')) || [];
                    const actualOpenTags = openMatches.length - selfClosingMatches.length;
                    
                    if (actualOpenTags !== closeMatches.length) {
                        issues.push(`<${tag}>: ${actualOpenTags} abiertas, ${closeMatches.length} cerradas`);
                    }
                });
                
                // Verificar etiquetas obviamente mal cerradas en el HTML
                const badClosingPatterns = [
                    /<h1[^>]*><h1[^>]*>/gi, // h1 dobles
                    /<\/[^>]+>[^<]*<\/[^>]+>/gi // posibles cierres duplicados
                ];
                
                let malformedFound = false;
                badClosingPatterns.forEach(pattern => {
                    if (pattern.test(rawHtml)) {
                        malformedFound = true;
                    }
                });
                
                if (malformedFound) {
                    issues.push('patrones de etiquetas malformadas detectados');
                }
                
                if (issues.length === 0) {
                    return {
                        passed: true,
                        matches: [],
                        message: 'Correcto: Las etiquetas están correctamente cerradas.',
                        suggestion: null
                    };
                } else {
                    return {
                        passed: false,
                        matches: [],
                        message: `Error: Etiquetas mal cerradas - ${issues.slice(0, 3).join(', ')}${issues.length > 3 ? '...' : ''}.`,
                        suggestion: 'Revisa que cada etiqueta de apertura tenga su correspondiente etiqueta de cierre. Usa un editor con resaltado de sintaxis para detectar errores.'
                    };
                }
            }
        },

        validViewport: {
            id: 'valid-viewport',
            descripcion: 'Meta viewport para responsive',
            tipo: 'warning',
            puntaje_ok: 1,
            puntaje_error: -1,
            detectar: function(document, rawHtml) {
                const viewport = document.querySelector('meta[name="viewport"]');
                
                if (!viewport) {
                    return {
                        passed: false,
                        matches: [],
                        message: 'Error: Falta la etiqueta meta viewport.',
                        suggestion: 'Agrega <meta name="viewport" content="width=device-width, initial-scale=1.0"> en el <head> para diseño responsive.'
                    };
                } else {
                    const content = viewport.getAttribute('content');
                    if (!content || !content.includes('width=device-width')) {
                        return {
                            passed: false,
                            matches: [viewport],
                            message: 'Error: Meta viewport no tiene configuración responsive.',
                            suggestion: 'Usa content="width=device-width, initial-scale=1.0" en la meta viewport.'
                        };
                    } else {
                        return {
                            passed: true,
                            matches: [viewport],
                            message: 'Correcto: Meta viewport configurada para responsive.',
                            suggestion: null
                        };
                    }
                }
            }
        }
    }
};

// Función para obtener todas las reglas
function getAllRules() {
    return VALIDATION_RULES.rules;
}

// Función para obtener configuración
function getConfig() {
    return VALIDATION_RULES.config;
}

// Función para calcular puntaje total
function calculateTotalScore(results) {
    let totalScore = 0;
    let passedRules = 0;
    let failedRules = 0;
    
    results.forEach(result => {
        if (result.passed) {
            totalScore += result.rule.puntaje_ok;
            passedRules++;
        } else {
            totalScore += result.rule.puntaje_error;
            failedRules++;
        }
    });
    
    return {
        totalScore,
        passedRules,
        failedRules,
        percentage: Math.max(0, Math.min(100, ((totalScore + (failedRules * Math.abs(VALIDATION_RULES.config.defaultErrorPoints))) / (results.length * VALIDATION_RULES.config.defaultSuccessPoints)) * 100))
    };
}

// Función para determinar el estado de aprobación
function getPassingStatus(score) {
    const config = getConfig();
    if (score >= config.passingScore) {
        return { status: 'passed', label: 'Aprobado', class: 'success' };
    } else if (score >= config.passingScore * 0.5) {
        return { status: 'warning', label: 'Mejorable', class: 'warning' };
    } else {
        return { status: 'failed', label: 'Reprobado', class: 'danger' };
    }
}
