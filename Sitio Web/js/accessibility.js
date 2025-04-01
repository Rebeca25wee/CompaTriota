// Estilos CSS integrados
const accessibilityStyles = `
<style>
.accessibility-container {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
    display: flex;
    gap: 10px;
    background-color: rgba(51, 51, 51, 0.8);
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.accessibility-btn {
    background-color: #333;
    border: 2px solid #555;
    color: white;
    padding: 8px 12px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    cursor: pointer;
    border-radius: 5px;
    outline: none;
    transition: all 0.3s ease;
}

.accessibility-btn:hover {
    background-color: #444;
    transform: scale(1.05);
}

.accessibility-btn:active {
    background-color: #222;
    transform: scale(0.95);
}
</style>
`;

// Insertar estilos en el documento
document.head.insertAdjacentHTML('beforeend', accessibilityStyles);

// Variables globales
let currentFontSizeMultiplier = 1;
let speechSynthesisInstance = null;

// Función para aumentar el tamaño de fuente
function increaseFontSize() {
    currentFontSizeMultiplier += 0.1;
    
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, li, a, label, td, th, caption');
    
    textElements.forEach(element => {
        if (element.textContent.trim() !== '') {
            const originalSize = parseFloat(window.getComputedStyle(element).fontSize);
            element.style.fontSize = `${originalSize * currentFontSizeMultiplier}px`;
        }
    });
}

// Función para disminuir el tamaño de fuente
function decreaseFontSize() {
    if (currentFontSizeMultiplier > 0.7) {
        currentFontSizeMultiplier -= 0.1;
        
        const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, li, a, label, td, th, caption');
        
        textElements.forEach(element => {
            if (element.textContent.trim() !== '') {
                const originalSize = parseFloat(window.getComputedStyle(element).fontSize);
                element.style.fontSize = `${originalSize * currentFontSizeMultiplier}px`;
            }
        });
    }
}

// Función de alto contraste inteligente
function toggleHighContrast() {
    const body = document.body;
    const isHighContrast = body.classList.toggle('high-contrast');
    const elements = document.querySelectorAll('body, *');
    
    if (isHighContrast) {
        elements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const bgColor = computedStyle.backgroundColor;
            const bgRGB = bgColor.match(/\d+/g);
            
            if (bgRGB) {
                const brightness = (parseInt(bgRGB[0]) * 299 + 
                                    parseInt(bgRGB[1]) * 587 + 
                                    parseInt(bgRGB[2]) * 114) / 1000;
                
                if (brightness > 125) {
                    element.style.backgroundColor = '#000';
                    element.style.color = '#fff';
                } else {
                    element.style.backgroundColor = '#fff';
                    element.style.color = '#000';
                }
            }
        });
    } else {
        elements.forEach(element => {
            element.style.backgroundColor = '';
            element.style.color = '';
        });
    }
}

// Función de lectura en voz alta solo para texto seleccionado
function readSelectedText() {
    if ('speechSynthesis' in window) {
        if (speechSynthesisInstance) {
            window.speechSynthesis.cancel();
            speechSynthesisInstance = null;
            return;
        }
        
        const selectedText = window.getSelection().toString().trim();
        
        if (selectedText) {
            const utterance = new SpeechSynthesisUtterance(selectedText);
            
            utterance.lang = 'es-ES';
            utterance.rate = 0.9;
            
            utterance.onend = () => {
                speechSynthesisInstance = null;
            };
            
            window.speechSynthesis.speak(utterance);
            speechSynthesisInstance = utterance;
        } else {
            alert('Por favor, selecciona primero el texto que quieres leer');
        }
    } else {
        alert('Tu navegador no soporta lectura en voz alta');
    }
}

// Función para detener lectura en voz alta
function stopReadAloud() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        speechSynthesisInstance = null;
    }
}

// Crear botones de accesibilidad
function createAccessibilityButtons() {
    const container = document.createElement('div');
    container.className = 'accessibility-container';
    
    const createButton = (text, onClick) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'accessibility-btn';
        button.onclick = onClick;
        return button;
    };
    
    const increaseBtn = createButton('A+', increaseFontSize);
    const decreaseBtn = createButton('A-', decreaseFontSize);
    const contrastBtn = createButton('Alto Contraste', toggleHighContrast);
    const readAloudBtn = createButton('Leer Sel.', readSelectedText);
    const stopReadBtn = createButton('Parar', stopReadAloud);
    
    container.appendChild(readAloudBtn);
    container.appendChild(stopReadBtn);
    
    document.body.appendChild(container);
}

// Inicializar botones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', createAccessibilityButtons);