// Estado global de la aplicación
let currentResults = [];
let currentChart = null;
let currentHighlights = [];

// Elementos del DOM
const elements = {
    codeInput: null,
    btnAnalyze: null,
    btnClear: null,
    btnDownloadReport: null,
    btnCopyFeedback: null,
    emptyState: null,
    resultsContainer: null,
    scoreDisplay: null,
    scoreProgress: null,
    scoreStatus: null,
    passedCount: null,
    failedCount: null,
    findingsTable: null,
    codeViewer: null,
    highlightedCode: null,
    resultsChart: null
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    bindEvents();
    setupInitialState();
});

// Inicializar referencias a elementos del DOM
function initializeElements() {
    elements.codeInput = document.getElementById('codeInput');
    elements.btnAnalyze = document.getElementById('btnAnalyze');
    elements.btnClear = document.getElementById('btnClear');
    elements.btnDownloadReport = document.getElementById('btnDownloadReport');
    elements.btnCopyFeedback = document.getElementById('btnCopyFeedback');
    elements.emptyState = document.getElementById('emptyState');
    elements.resultsContainer = document.getElementById('resultsContainer');
    elements.scoreDisplay = document.getElementById('scoreDisplay');
    elements.scoreProgress = document.getElementById('scoreProgress');
    elements.scoreStatus = document.getElementById('scoreStatus');
    elements.passedCount = document.getElementById('passedCount');
    elements.failedCount = document.getElementById('failedCount');
    elements.findingsTable = document.getElementById('findingsTable');
    elements.codeViewer = document.getElementById('codeViewer');
    elements.highlightedCode = document.getElementById('highlightedCode');
    elements.resultsChart = document.getElementById('resultsChart');
}

// Vincular eventos
function bindEvents() {
    elements.btnAnalyze.addEventListener('click', analyzeCode);
    elements.btnClear.addEventListener('click', clearCode);
    elements.btnDownloadReport.addEventListener('click', downloadReport);
    elements.btnCopyFeedback.addEventListener('click', copyFeedback);
    
    // Evento para el teclado (Ctrl+Enter para analizar)
    elements.codeInput.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            analyzeCode();
        }
    });
}

// Configurar estado inicial
function setupInitialState() {
    showEmptyState();
}

// Mostrar estado vacío
function showEmptyState() {
    elements.emptyState.classList.remove('d-none');
    elements.resultsContainer.classList.add('d-none');
    elements.codeViewer.classList.add('d-none');
}

// Mostrar resultados
function showResults() {
    elements.emptyState.classList.add('d-none');
    elements.resultsContainer.classList.remove('d-none');
    elements.resultsContainer.classList.add('fade-in-up');
}

// Limpiar código y resultados
function clearCode() {
    elements.codeInput.value = '';
    currentResults = [];
    currentHighlights = [];
    
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
    
    showEmptyState();
    elements.codeInput.focus();
}

// Analizar código principal
async function analyzeCode() {
    const code = elements.codeInput.value.trim();
    
    if (!code) {
        showAlert('Por favor, ingresa código HTML para analizar.', 'warning');
        elements.codeInput.focus();
        return;
    }
    
    setLoadingState(true);
    
    try {
        // Validaciones previas antes del parsing
        const preValidationIssues = validateBasicStructure(code);
        
        // Parsear HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(code, 'text/html');
        
        // Verificar errores de parsing más estrictos
        const parserErrors = doc.querySelectorAll('parsererror');
        if (parserErrors.length > 0) {
            showAlert('El código HTML contiene errores de sintaxis graves que impiden el análisis.', 'danger');
            setLoadingState(false);
            return;
        }
        
        // Ejecutar validaciones
        const results = await runValidations(doc, code);
        
        // Agregar issues de pre-validación si los hay
        if (preValidationIssues.length > 0) {
            results.unshift(...preValidationIssues);
        }
        
        currentResults = results;
        
        // Mostrar resultados
        displayResults(results);
        displayChart(results);
        displayHighlightedCode(code, results);
        showResults();
        
    } catch (error) {
        console.error('Error durante el análisis:', error);
        showAlert('Ocurrió un error durante el análisis del código.', 'danger');
    } finally {
        setLoadingState(false);
    }
}

// Validar estructura básica antes del parsing
function validateBasicStructure(code) {
    const issues = [];
    
    // Verificar casos críticos de HTML malformado
    const criticalPatterns = [
        {
            pattern: /<h[1-6][^>]*>\s*<h[1-6][^>]*>/gi,
            message: 'Etiquetas de encabezado anidadas o mal cerradas',
            ruleId: 'malformed-headers'
        },
        {
            pattern: /<(div|p|span)[^>]*>\s*<\1[^>]*>/gi,
            message: 'Etiquetas duplicadas o mal anidadas',
            ruleId: 'malformed-nesting'
        },
        {
            pattern: /<\/[^>]+>\s*<\/[^>]+>/gi,
            message: 'Múltiples etiquetas de cierre consecutivas',
            ruleId: 'malformed-closing'
        }
    ];
    
    criticalPatterns.forEach(({ pattern, message, ruleId }) => {
        if (pattern.test(code)) {
            issues.push({
                ruleId: ruleId,
                rule: {
                    id: ruleId,
                    descripcion: 'HTML malformado detectado',
                    tipo: 'error',
                    puntaje_ok: 0,
                    puntaje_error: -5
                },
                passed: false,
                matches: [],
                message: `Error crítico: ${message}`,
                suggestion: 'Revisa la estructura HTML y asegúrate de que las etiquetas estén correctamente cerradas y anidadas.'
            });
        }
    });
    
    return issues;
}

// Ejecutar todas las validaciones
async function runValidations(document, rawHtml) {
    const rules = getAllRules();
    const results = [];
    
    for (const [ruleKey, rule] of Object.entries(rules)) {
        try {
            const result = rule.detectar(document, rawHtml);
            results.push({
                ruleId: rule.id,
                rule: rule,
                ...result
            });
        } catch (error) {
            console.error(`Error en regla ${rule.id}:`, error);
            results.push({
                ruleId: rule.id,
                rule: rule,
                passed: false,
                matches: [],
                message: 'Error interno durante la validación.',
                suggestion: 'Contacta al profesor si este error persiste.'
            });
        }
    }
    
    // Validaciones asíncronas (como tamaño de imágenes)
    await runAsyncValidations(document, rawHtml, results);
    
    return results;
}

// Validaciones asíncronas
async function runAsyncValidations(document, rawHtml, results) {
    // Validación de tamaño de imágenes
    const images = document.querySelectorAll('img[src]');
    if (images.length > 0) {
        const imageSizeResults = await validateImageSizes(images);
        
        // Actualizar resultado de image-size
        const imageSizeResultIndex = results.findIndex(r => r.ruleId === 'image-size');
        if (imageSizeResultIndex !== -1) {
            results[imageSizeResultIndex] = {
                ...results[imageSizeResultIndex],
                ...imageSizeResults
            };
        }
    }
}

// Validar tamaños de imágenes
async function validateImageSizes(images) {
    const oversizedImages = [];
    const unverifiableImages = [];
    let checkedImages = 0;
    
    for (const img of images) {
        const src = img.getAttribute('src');
        
        if (!src || src.startsWith('data:')) {
            continue;
        }
        
        try {
            if (src.startsWith('http') && !src.startsWith('https://')) {
                unverifiableImages.push(img);
                continue;
            }
            
            const response = await fetch(src, { method: 'HEAD' });
            const contentLength = response.headers.get('content-length');
            
            if (contentLength) {
                const sizeKB = parseInt(contentLength) / 1024;
                if (sizeKB > 500) {
                    oversizedImages.push(img);
                }
                checkedImages++;
            } else {
                unverifiableImages.push(img);
            }
        } catch (error) {
            unverifiableImages.push(img);
        }
    }
    
    const passed = oversizedImages.length === 0;
    let message = '';
    
    if (checkedImages === 0) {
        message = 'No se pudieron verificar los tamaños de las imágenes.';
    } else if (passed) {
        message = `Correcto: Todas las imágenes verificadas (${checkedImages}) son ≤ 500KB.`;
    } else {
        message = `Error: ${oversizedImages.length} imágenes superan los 500KB.`;
    }
    
    if (unverifiableImages.length > 0) {
        message += ` ${unverifiableImages.length} imágenes no verificables.`;
    }
    
    return {
        passed,
        matches: oversizedImages,
        message,
        suggestion: passed ? null : 'Optimiza las imágenes para que pesen menos de 500KB. Usa herramientas de compresión o formatos más eficientes como WebP.'
    };
}

// Mostrar resultados en la interfaz
function displayResults(results) {
    const scoreData = calculateTotalScore(results);
    const status = getPassingStatus(scoreData.percentage);
    
    // Actualizar puntaje
    elements.scoreDisplay.textContent = Math.round(scoreData.totalScore);
    elements.scoreProgress.style.width = `${scoreData.percentage}%`;
    elements.scoreProgress.className = `progress-bar bg-${status.class}`;
    elements.scoreStatus.textContent = status.label;
    elements.scoreStatus.className = `badge bg-${status.class}`;
    
    // Actualizar contadores
    elements.passedCount.textContent = scoreData.passedRules;
    elements.failedCount.textContent = scoreData.failedRules;
    
    // Mostrar tabla de hallazgos
    displayFindingsTable(results);
}

// Mostrar tabla de hallazgos
function displayFindingsTable(results) {
    const tbody = elements.findingsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    // Ordenar resultados: errores primero, luego por severidad
    const sortedResults = results.sort((a, b) => {
        if (a.passed !== b.passed) {
            return a.passed ? 1 : -1;
        }
        if (a.rule.tipo !== b.rule.tipo) {
            return a.rule.tipo === 'error' ? -1 : 1;
        }
        return 0;
    });
    
    sortedResults.forEach((result, index) => {
        const row = createFindingRow(result, index);
        tbody.appendChild(row);
    });
}

// Crear fila de hallazgo
function createFindingRow(result, index) {
    const row = document.createElement('tr');
    row.className = 'finding-row';
    row.dataset.resultIndex = index;
    
    const severity = result.passed ? 'success' : (result.rule.tipo === 'error' ? 'error' : 'warning');
    const severityIcon = result.passed ? 'fa-check-circle' : (result.rule.tipo === 'error' ? 'fa-times-circle' : 'fa-exclamation-triangle');
    const points = result.passed ? `+${result.rule.puntaje_ok}` : result.rule.puntaje_error;
    const pointsClass = result.passed ? 'text-success' : 'text-danger';
    
    // Calcular línea aproximada
    const lineInfo = getElementLine(result.matches[0], elements.codeInput.value);
    
    row.innerHTML = `
        <td>
            <span class="severity-badge severity-${severity}">
                <i class="fas ${severityIcon} me-1"></i>
                ${result.passed ? 'OK' : result.rule.tipo.toUpperCase()}
            </span>
        </td>
        <td>
            <strong>${result.rule.descripcion}</strong>
            <br>
            <small class="text-muted">${result.message}</small>
            ${result.suggestion ? `<br><small class="text-info"><i class="fas fa-lightbulb me-1"></i>${result.suggestion}</small>` : ''}
        </td>
        <td>
            <small class="text-muted">${result.rule.id}</small>
        </td>
        <td class="text-center">
            ${lineInfo ? `<span class="badge bg-secondary">${lineInfo}</span>` : '-'}
        </td>
        <td class="text-center">
            <strong class="${pointsClass}">${points}</strong>
        </td>
    `;
    
    // Agregar evento de click para resaltado
    row.addEventListener('click', () => {
        highlightInCode(result, index);
    });
    
    return row;
}

// Obtener número de línea aproximado de un elemento
function getElementLine(element, code) {
    if (!element || !code) return null;
    
    try {
        const elementHTML = element.outerHTML;
        const truncatedHTML = elementHTML.substring(0, 50);
        const lines = code.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(truncatedHTML.substring(0, 20))) {
                return i + 1;
            }
        }
        
        return null;
    } catch (error) {
        return null;
    }
}

// Resaltar en código
function highlightInCode(result, resultIndex) {
    if (!elements.highlightedCode) return;
    
    // Quitar selección previa de la tabla
    const prevSelected = elements.findingsTable.querySelector('.table-active');
    if (prevSelected) {
        prevSelected.classList.remove('table-active');
    }
    
    // Seleccionar fila actual
    const currentRow = elements.findingsTable.querySelector(`[data-result-index="${resultIndex}"]`);
    if (currentRow) {
        currentRow.classList.add('table-active');
    }
    
    // Scroll al visor de código
    elements.codeViewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Resaltar líneas relacionadas
    setTimeout(() => {
        const lines = elements.highlightedCode.querySelectorAll('.code-line');
        
        // Quitar resaltados previos
        lines.forEach(line => {
            line.classList.remove('error-line', 'success-line');
        });
        
        // Agregar nuevo resaltado
        result.matches.forEach(element => {
            const lineNum = getElementLine(element, elements.codeInput.value);
            if (lineNum && lines[lineNum - 1]) {
                const lineClass = result.passed ? 'success-line' : 'error-line';
                lines[lineNum - 1].classList.add(lineClass);
                
                // Scroll a la primera línea resaltada
                if (element === result.matches[0]) {
                    lines[lineNum - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }, 100);
}

// Mostrar código con resaltado
function displayHighlightedCode(code, results) {
    if (!elements.highlightedCode) return;
    
    // Limpiar contenido previo
    elements.highlightedCode.innerHTML = '';
    
    // Crear elemento pre y code para Highlight.js
    const preElement = document.createElement('pre');
    const codeElement = document.createElement('code');
    codeElement.className = 'html';
    
    // Escapar HTML para evitar renderizado
    codeElement.textContent = code;
    preElement.appendChild(codeElement);
    
    // Aplicar Highlight.js
    if (typeof hljs !== 'undefined') {
        hljs.highlightBlock(codeElement);
    }
    
    elements.highlightedCode.appendChild(preElement);
    
    // Agregar números de línea y resaltado de errores
    addLineNumbersAndHighlighting(elements.highlightedCode, code, results);
    
    elements.codeViewer.classList.remove('d-none');
}

// Agregar números de línea y resaltado
function addLineNumbersAndHighlighting(container, code, results) {
    const lines = code.split('\n');
    const preElement = container.querySelector('pre');
    const codeElement = container.querySelector('code');
    
    // Crear wrapper para líneas numeradas
    const lineWrapper = document.createElement('div');
    lineWrapper.className = 'code-line-wrapper';
    
    // Obtener el HTML resaltado por Highlight.js
    const highlightedHTML = codeElement.innerHTML;
    const highlightedLines = highlightedHTML.split('\n');
    
    lines.forEach((line, index) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'code-line';
        lineDiv.dataset.lineNumber = index + 1;
        
        const lineNumber = document.createElement('span');
        lineNumber.className = 'line-number';
        lineNumber.textContent = index + 1;
        
        const lineContent = document.createElement('span');
        lineContent.className = 'line-content';
        
        // Usar línea resaltada si está disponible, sino usar texto plano
        if (highlightedLines[index] !== undefined) {
            lineContent.innerHTML = highlightedLines[index] || '&nbsp;';
        } else {
            lineContent.textContent = line || ' ';
        }
        
        lineDiv.appendChild(lineNumber);
        lineDiv.appendChild(lineContent);
        
        lineWrapper.appendChild(lineDiv);
    });
    
    // Reemplazar contenido
    container.innerHTML = '';
    container.appendChild(lineWrapper);
}

// Mostrar gráfico
function displayChart(results) {
    if (!elements.resultsChart) return;
    
    const ctx = elements.resultsChart.getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (currentChart) {
        currentChart.destroy();
    }
    
    // Preparar datos
    const passedCount = results.filter(r => r.passed).length;
    const failedCount = results.filter(r => !r.passed).length;
    
    // Datos por tipo de regla
    const ruleTypes = {};
    results.forEach(result => {
        const type = result.rule.tipo;
        const status = result.passed ? 'passed' : 'failed';
        const key = `${type}_${status}`;
        
        if (!ruleTypes[key]) {
            ruleTypes[key] = 0;
        }
        ruleTypes[key]++;
    });
    
    currentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Aprobadas', 'Fallidas'],
            datasets: [{
                data: [passedCount, failedCount],
                backgroundColor: ['#198754', '#dc3545'],
                borderColor: ['#198754', '#dc3545'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Estado de carga
function setLoadingState(loading) {
    const spinner = elements.btnAnalyze.querySelector('.spinner-border');
    const icon = elements.btnAnalyze.querySelector('.fas');
    const text = elements.btnAnalyze.querySelector('i').nextSibling;
    
    if (loading) {
        elements.btnAnalyze.disabled = true;
        elements.btnAnalyze.classList.add('loading');
        spinner.classList.remove('d-none');
        icon.classList.add('d-none');
        text.textContent = ' Analizando...';
    } else {
        elements.btnAnalyze.disabled = false;
        elements.btnAnalyze.classList.remove('loading');
        spinner.classList.add('d-none');
        icon.classList.remove('d-none');
        text.textContent = ' Analizar';
    }
}

// Descargar reporte
function downloadReport() {
    if (currentResults.length === 0) {
        showAlert('No hay resultados para descargar.', 'warning');
        return;
    }
    
    const scoreData = calculateTotalScore(currentResults);
    const status = getPassingStatus(scoreData.percentage);
    
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalScore: scoreData.totalScore,
            percentage: scoreData.percentage,
            status: status.status,
            passedRules: scoreData.passedRules,
            failedRules: scoreData.failedRules
        },
        results: currentResults.map(result => ({
            ruleId: result.ruleId,
            ruleName: result.rule.descripcion,
            ruleType: result.rule.tipo,
            passed: result.passed,
            message: result.message,
            suggestion: result.suggestion,
            points: result.passed ? result.rule.puntaje_ok : result.rule.puntaje_error
        }))
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-validacion-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('Reporte descargado exitosamente.', 'success');
}

// Copiar feedback
function copyFeedback() {
    if (currentResults.length === 0) {
        showAlert('No hay resultados para copiar.', 'warning');
        return;
    }
    
    const scoreData = calculateTotalScore(currentResults);
    const status = getPassingStatus(scoreData.percentage);
    
    let feedback = `CORRECCIÓN DE CÓDIGO HTML/CSS\n`;
    feedback += `=====================================\n\n`;
    feedback += `RESUMEN:\n`;
    feedback += `- Puntaje: ${scoreData.totalScore} puntos\n`;
    feedback += `- Porcentaje: ${scoreData.percentage.toFixed(1)}%\n`;
    feedback += `- Estado: ${status.label}\n`;
    feedback += `- Reglas aprobadas: ${scoreData.passedRules}\n`;
    feedback += `- Reglas fallidas: ${scoreData.failedRules}\n\n`;
    
    feedback += `HALLAZGOS DETALLADOS:\n`;
    feedback += `=====================\n\n`;
    
    currentResults.forEach((result, index) => {
        const status = result.passed ? '✅ CORRECTO' : (result.rule.tipo === 'error' ? '❌ ERROR' : '⚠️ ADVERTENCIA');
        const points = result.passed ? `+${result.rule.puntaje_ok}` : result.rule.puntaje_error;
        
        feedback += `${index + 1}. [${status}] ${result.rule.descripcion} (${points} pts)\n`;
        feedback += `   ${result.message}\n`;
        if (result.suggestion) {
            feedback += `   💡 Sugerencia: ${result.suggestion}\n`;
        }
        feedback += `\n`;
    });
    
    feedback += `\nGenerado por: Corrector de Código HTML/CSS\n`;
    feedback += `Fecha: ${new Date().toLocaleString('es-ES')}\n`;
    
    navigator.clipboard.writeText(feedback).then(() => {
        showAlert('Feedback copiado al portapapeles.', 'success');
    }).catch(() => {
        // Fallback para navegadores que no soportan clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = feedback;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showAlert('Feedback copiado al portapapeles.', 'success');
    });
}

// Mostrar alerta
function showAlert(message, type = 'info') {
    // Crear elemento de alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
    alert.setAttribute('role', 'alert');
    
    const icon = type === 'success' ? 'check-circle' : 
                type === 'danger' ? 'exclamation-triangle' : 
                type === 'warning' ? 'exclamation-circle' : 'info-circle';
    
    alert.innerHTML = `
        <i class="fas fa-${icon} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Utilidades adicionales
function sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
    showAlert('Ocurrió un error inesperado. Recarga la página e intenta nuevamente.', 'danger');
});

// Service Worker registration (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Solo registrar SW si existe el archivo
        // navigator.serviceWorker.register('/sw.js');
    });
}
