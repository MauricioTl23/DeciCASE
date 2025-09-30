document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('objetivosForm');
    const btnGenerar = document.getElementById('btnGenerar');
    const tablaDiv = document.getElementById('tabla_dinamica');
    const tablaFinalDiv = document.getElementById('tabla_final');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const oblig = Number(document.getElementById('obligatorios').value);
        const des = Number(document.getElementById('deseados').value);
        const estr = Number(document.getElementById('estrategias').value);

        if (oblig < 1 || des < 1 || estr < 2) {
            alert("❌ Objetivos deben ser mayores a 0 y estrategias mayores a 1.");
            return;
        }

        if (!confirm(`Confirma tus valores:\n📌 Obligatorios: ${oblig}\n📌 Deseados: ${des}\n📌 Estrategias: ${estr}`)) return;

        btnGenerar.disabled = true;
        document.getElementById('obligatorios').readOnly = true;
        document.getElementById('deseados').readOnly = true;
        document.getElementById('estrategias').readOnly = true;

        // --- Primera tabla: Objetivos con criterios ---
        let html = "<h3>Tabla de Objetivos</h3>";
        html += "<table border='1' style='margin:20px auto; border-collapse:collapse; text-align:center;'>";
        html += "<tr><th>#</th><th>Tipo</th><th>Nombre</th><th>Criterio</th></tr>";

        let contador = 1;
        function agregarFilas(tipo, cantidad) {
            for (let i = 1; i <= cantidad; i++) {
                html += `<tr>
                            <td>${contador++}</td>
                            <td>${tipo}</td>
                            <td><input type="text" placeholder="${tipo} ${i}"></td>
                            <td>`;
                if (tipo === "Estrategia") {
                    html += ``; // Estrategias quedan en blanco
                } else {
                    html += `<label><input type="radio" name="criterio_${contador}" value="mayor"> Mayor</label>
                             <label><input type="radio" name="criterio_${contador}" value="menor"> Menor</label>`;
                }
                html += `</td></tr>`;
            }
        }

        agregarFilas("Obligatorio", oblig);
        agregarFilas("Deseado", des);
        agregarFilas("Estrategia", estr);

        html += "</table>";
        html += `<div style="text-align:center; margin-top:15px;">
                    <button id="guardarTabla">GUARDAR</button>
                 </div>`;

        tablaDiv.innerHTML = html;

        const btnGuardarTabla = tablaDiv.querySelector('#guardarTabla');
        btnGuardarTabla.addEventListener('click', function () {
            const filas = tablaDiv.querySelectorAll('table tr');
            let valid = true;
            let resultados = [];
            let estrategiasList = [];

            filas.forEach((fila, index) => {
                if (index === 0) return;
                const tipo = fila.cells[1].innerText;
                const nombreInput = fila.cells[2].querySelector('input');
                const nombre = nombreInput.value.trim();

                if (!nombre) {
                    valid = false;
                    nombreInput.style.borderColor = "red";
                } else {
                    nombreInput.style.borderColor = "#aaa";
                }

                if (tipo === "Estrategia") estrategiasList.push(nombre);
                resultados.push({ tipo, nombre });
            });

            if (!valid) {
                alert("❌ Completa todos los nombres.");
                return;
            }

            filas.forEach((fila, index) => {
                if (index === 0) return;
                fila.querySelectorAll('input[type="text"]').forEach(input => input.readOnly = true);
                fila.querySelectorAll('input[type="radio"]').forEach(input => input.disabled = false);
            });
            btnGuardarTabla.disabled = true;

            // --- Segunda tabla: Asignación de objetivos a estrategias ---
            let htmlFinal = "<h3>Asignación de Objetivos a Estrategias</h3>";
            htmlFinal += "<table border='1' style='margin:20px auto; border-collapse:collapse; text-align:center;'>";
            htmlFinal += "<tr><th>Estrategias</th>";
            resultados.filter(r => r.tipo !== "Estrategia").forEach(col => htmlFinal += `<th>${col.nombre}</th>`);
            htmlFinal += "</tr>";

            estrategiasList.forEach(estrategia => {
                htmlFinal += `<tr><td>${estrategia}</td>`;
                resultados.filter(r => r.tipo !== "Estrategia").forEach(() => htmlFinal += `<td><input type="number" placeholder="valor"></td>`);
                htmlFinal += "</tr>";
            });

            htmlFinal += "</table>";
            htmlFinal += `<div style="text-align:center; margin-top:15px;">
                            <button id="guardarFinal">GUARDAR</button>
                          </div>`;

            tablaFinalDiv.innerHTML = htmlFinal;

            const btnGuardarFinal = tablaFinalDiv.querySelector('#guardarFinal');
            btnGuardarFinal.addEventListener('click', function () {
                const filasFinal = tablaFinalDiv.querySelectorAll('table tr');
                let validFinal = true;

                filasFinal.forEach((fila, index) => {
                    if (index === 0) return;
                    for (let c = 1; c < fila.cells.length; c++) {
                        const input = fila.cells[c].querySelector('input');
                        if (!input.value.trim()) {
                            validFinal = false;
                            input.style.borderColor = "red";
                        } else {
                            input.style.borderColor = "#aaa";
                        }
                    }
                });

                if (!validFinal) {
                    alert("Completa todas las asignaciones.");
                    return;
                }

                filasFinal.forEach((fila, index) => {
                    if (index === 0) return;
                    fila.querySelectorAll('input').forEach(input => input.readOnly = true);
                });
                btnGuardarFinal.disabled = true;

                // --- Tabla de frecuencia ---
                const numColsOriginal = oblig + des - 1;
                let numColsActual = numColsOriginal;
                const numRows = numColsOriginal * 2;

                let freqHtml = "<h3>Tabla de Importancia Relativa</h3>";
                freqHtml += "<table border='1' style='margin:20px auto; border-collapse:collapse; text-align:center;'>";

                let verificar = 1;
                let filaBloque = 0;
                let bloqueNum = 1;

                for (let fila = 1; fila <= numRows; fila++) {
                    freqHtml += "<tr>";
                    filaBloque++;

                    for (let col = 1; col <= numColsOriginal; col++) {
                        if (col <= numColsOriginal - numColsActual) {
                            freqHtml += "<td></td>";
                            continue;
                        }
                        let valor = (filaBloque === 1) ? verificar : verificar + (col - (numColsOriginal - numColsActual));
                        const radioName = `bloque${bloqueNum}_col${col}`;
                        freqHtml += `<td>${valor}<br><input type="radio" name="${radioName}" value="${valor}"></td>`;
                    }

                    freqHtml += "</tr>";

                    if (filaBloque === 2 && numColsActual > 1) {
                        numColsActual--;
                        filaBloque = 0;
                        verificar++;
                        bloqueNum++;
                    }
                }

                freqHtml += "</table>";

                // --- Después de generar la tabla de frecuencia ---
                const freqContainer = document.createElement('div');
                freqContainer.innerHTML = freqHtml;
                tablaFinalDiv.appendChild(freqContainer);

                // --- Botón para calcular la tabla de conteo ---
                const btnCalcularConteo = document.createElement("button");
                btnCalcularConteo.textContent = "CALCULAR";
                btnCalcularConteo.style.display = "block";
                btnCalcularConteo.style.margin = "20px auto";

                btnCalcularConteo.addEventListener("click", function () {
                    const radios = freqContainer.querySelectorAll("input[type='radio']");
                    // Verificar que todos los grupos tengan una selección
                    const nombresRadios = new Set();
                    radios.forEach(radio => nombresRadios.add(radio.name));
                    let todosSeleccionados = true;
                    nombresRadios.forEach(name => {
                        const grupo = freqContainer.querySelectorAll(`input[name='${name}']`);
                        if (![...grupo].some(r => r.checked)) todosSeleccionados = false;
                    });
                    if (!todosSeleccionados) {
                        alert("❌ Faltan selecciones en la tabla de Importancia Relativa.");
                        return;
                    }

                    if (!confirm("¿Estás de acuerdo con la selección de la Importancia Relativa?")) return;

                    // Bloquear todos los radios
                    radios.forEach(radio => radio.disabled = true);

                    // Generar tabla de conteo incluyendo valores no seleccionados
                    const conteo = {};
                    radios.forEach(radio => {
                        if (radio.checked) {
                            const val = Number(radio.value);
                            conteo[val] = (conteo[val] || 0) + 1;
                        }
                    });

                    const maxValor = Math.max(...Array.from(radios).map(r => Number(r.value)));
                    let total = 0;
                    let htmlConteo = "<h3>Conteo de Selecciones</h3>";
                    htmlConteo += "<table border='1' style='margin:20px auto; border-collapse:collapse; text-align:center;'>";
                    htmlConteo += "<tr><th>Valor</th><th>Frecuencia</th></tr>";

                    for (let i = 1; i <= maxValor; i++) {
                        const count = conteo[i] || 0;
                        htmlConteo += `<tr><td>${i}</td><td>${count}</td></tr>`;
                        total += count;
                    }

                    htmlConteo += `<tr style="font-weight:bold;"><td>Total</td><td>${total}</td></tr>`;
                    htmlConteo += "</table>";

                    const conteoDiv = document.createElement("div");
                    conteoDiv.innerHTML = htmlConteo;
                    tablaFinalDiv.appendChild(conteoDiv);

                    // --- Bloquear el botón para que no se vuelva a calcular ---
                    btnCalcularConteo.disabled = true;

                    const btnCalcularDecision = document.createElement("button");
                    btnCalcularDecision.textContent = "CALCULAR DECISION";
                    btnCalcularDecision.style.display = "block";
                    btnCalcularDecision.style.margin = "20px auto";

                    btnCalcularDecision.addEventListener("click", function () {
                        // Tomar criterios de la primera tabla
                        const filasObjetivos = tablaDiv.querySelectorAll("table tr");
                        const criterios = [];

                        filasObjetivos.forEach((fila, index) => {
                            if (index === 0) return;
                            const tipo = fila.cells[1].innerText;
                            if (tipo !== "Estrategia") {
                                const radios = fila.querySelectorAll('input[type="radio"]');
                                let criterio = null;
                                radios.forEach(radio => { if (radio.checked) criterio = radio.value; });
                                criterios.push(criterio);
                            }
                        });

                        // Tomar valores de la segunda tabla
                        const filasValores = tablaFinalDiv.querySelectorAll("table")[0].querySelectorAll("tr");
                        const valores = [];
                        for (let i = 1; i < filasValores.length; i++) {
                            const fila = filasValores[i];
                            const filaValores = [];
                            for (let j = 1; j < fila.cells.length; j++) {
                                const val = Number(fila.cells[j].querySelector("input").value);
                                filaValores.push(val);
                            }
                            valores.push(filaValores);
                        }

                        const numEstrategias = valores.length;
                        const numObjetivos = criterios.length;

                        // Inicializar matriz de conteo
                        const conteo = [];
                        for (let i = 0; i < numEstrategias; i++) {
                            conteo.push(new Array(numObjetivos).fill(0));
                        }

                        // Comparaciones por objetivo
                        for (let j = 0; j < numObjetivos; j++) {
                            for (let i = 0; i < numEstrategias - 1; i++) {
                                for (let k = i + 1; k < numEstrategias; k++) {
                                    const valI = valores[i][j];
                                    const valK = valores[k][j];
                                    const criterio = criterios[j];

                                    if (valI === valK) {
                                        conteo[i][j] += 1; // solo el primero recibe +1
                                    } else if (criterio === "mayor") {
                                        if (valI > valK) conteo[i][j] += 1;
                                        else conteo[k][j] += 1;
                                    } else if (criterio === "menor") {
                                        if (valI < valK) conteo[i][j] += 1;
                                        else conteo[k][j] += 1;
                                    }
                                }
                            }
                        }

                        // Generar tabla de conteo
                        let htmlConteo = "<h3>Tabla de Comparación por Objetivo</h3>";
                        htmlConteo += "<table border='1' style='margin:20px auto; border-collapse:collapse; text-align:center;'>";
                        htmlConteo += "<tr><th>Estrategia</th>";
                        for (let j = 0; j < numObjetivos; j++) htmlConteo += `<th>Obj ${j + 1}</th>`;
                        htmlConteo += "</tr>";

                        const sumaColumna = new Array(numObjetivos).fill(0);
                        for (let i = 0; i < numEstrategias; i++) {
                            htmlConteo += `<tr><td>${i + 1}</td>`;
                            for (let j = 0; j < numObjetivos; j++) {
                                htmlConteo += `<td>${conteo[i][j]}</td>`;
                                sumaColumna[j] += conteo[i][j];
                            }
                            htmlConteo += "</tr>";
                        }

                        // Fila de sumatoria
                        htmlConteo += "<tr style='font-weight:bold; background-color:#f0f0f0;'><td>Total</td>";
                        for (let j = 0; j < numObjetivos; j++) {
                            htmlConteo += `<td>${sumaColumna[j]}</td>`;
                        }
                        htmlConteo += "</tr></table>";

                        const conteoDiv = document.createElement("div");
                        conteoDiv.innerHTML = htmlConteo;
                        tablaFinalDiv.appendChild(conteoDiv);

                        // --- Vector de Conteo de Selecciones ---
                        const radios = tablaFinalDiv.querySelectorAll("input[type='radio']");
                        const conteoSelecciones = {};
                        radios.forEach(radio => {
                            if (radio.checked) {
                                const val = Number(radio.value);
                                conteoSelecciones[val] = (conteoSelecciones[val] || 0) + 1;
                            }
                        });

                        const conteoArray = [];
                        const maxValor = Math.max(...Object.keys(conteoSelecciones));
                        for (let i = 1; i <= maxValor; i++) {
                            conteoArray.push(conteoSelecciones[i] || 0);
                        }

                        // --- Generar tabla pivote con estética ---
                        let htmlPivote = "<h3>Tabla Final</h3>";
                        htmlPivote += "<table border='1' style='margin:20px auto; border-collapse:collapse; text-align:center;'>";

                        // Cabecera
                        htmlPivote += "<tr><th rowspan='2'>I.R.</th>";
                        for (let j = 0; j < numEstrategias; j++) {
                            htmlPivote += `<th colspan='2'>E${j + 1}</th>`;
                        }
                        htmlPivote += "</tr><tr>";
                        for (let j = 0; j < numEstrategias; j++) {
                            htmlPivote += "<th>ER</th><th>EP</th>";
                        }
                        htmlPivote += "</tr>";

                        // Transpuesta de la matriz de conteo
                        const transpuesta = [];
                        for (let j = 0; j < numObjetivos; j++) {
                            transpuesta[j] = [];
                            for (let i = 0; i < numEstrategias; i++) {
                                transpuesta[j][i] = conteo[i][j];
                            }
                        }

                        // Filas principales
                        const sumaMultiplicaciones = new Array(numEstrategias).fill(0);
                        for (let i = 0; i < conteoArray.length; i++) {
                            htmlPivote += "<tr>";
                            const pivote = conteoArray[i];
                            htmlPivote += `<td>${pivote}</td>`; // pivote

                            for (let j = 0; j < numEstrategias; j++) {
                                const val = transpuesta[i][j] || 0;
                                const mult = pivote * val;
                                htmlPivote += `<td>${val}</td><td>${mult}</td>`;
                                sumaMultiplicaciones[j] += mult;
                            }
                            htmlPivote += "</tr>";
                        }

                        // Fila total
                        htmlPivote += "<tr style='font-weight:bold; background-color:#f0f0f0;'><td>Total</td>";
                        for (let j = 0; j < numEstrategias; j++) {
                            htmlPivote += `<td colspan='2'>${sumaMultiplicaciones[j]}</td>`;
                        }
                        htmlPivote += "</tr>";

                        htmlPivote += "</table>";

                        const pivoteDiv = document.createElement("div");
                        pivoteDiv.innerHTML = htmlPivote;
                        tablaFinalDiv.appendChild(pivoteDiv);

                        alert("✔ Cálculo de decisión realizado");
                        btnCalcularDecision.disabled = true;
                    });

                    // Agregar el botón debajo de la tabla de conteo
                    tablaFinalDiv.appendChild(btnCalcularDecision);
                });

                // Agregar el botón debajo de la tabla de frecuencia
                tablaFinalDiv.appendChild(btnCalcularConteo);
            });
        });
    });
});
