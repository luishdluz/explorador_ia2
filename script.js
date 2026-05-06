const MAKE_URL = "https://hook.us2.make.com/he6fyt7r4tacv91y0qlqdxt8x9uvw6ff";



$(document).ready(function() {

    $("#btn-diccionario").on("click", function() {
    const diccionarioHtml = `
        <div class="agent-header">
            <div class="avatar-mini">G</div>
            <span>GEMA - Diccionario SQL Server</span>
        </div>
        <div class="text">
            Estructura técnica de: <code>IndicadoresCalidad_Banxico</code>
            <div class="table-responsive" style="margin-top: 15px;">
                <table style="width:100%; border-collapse: collapse; font-size: 0.8rem; border: 1px solid #e2e8f0;">
                    <thead>
                        <tr style="background: var(--azul-piif); color: white;">
                            <th style="padding: 8px; text-align: left;">Columna</th>
                            <th style="padding: 8px; text-align: left;">Tipo</th>
                            <th style="padding: 8px; text-align: left;">Definición</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>claveSector</b></td><td>varchar(2)</td><td>ID del Sector Financiero</td></tr>
                        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>nombre_sector</b></td><td>varchar(100)</td><td>Nombre del Sector</td></tr>
                        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>ncorto_institucion</b></td><td>varchar(46)</td><td>Nombre corto de la institución</td></tr>
                        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>nombre_agr_formulario</b></td><td>varchar(40)</td><td>Nombre del formulario</td></tr>
                        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>periodo_evaluacion</b></td><td>int</td><td>Periodo de información (YYYYMM)</td></tr>
                        <tr style="background: #f8fafc;"><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>calif_tfor</b></td><td>decimal</td><td>Promedio General</td></tr>
                        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>calif_ind1</b></td><td>decimal</td><td>Indicador de extemporaneidad</td></tr>
                        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>calif_ind2</b></td><td>decimal</td><td>Indicador de reenvíos</td></tr>
                        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>calif_ind3</b></td><td>decimal</td><td>Indicador de retransmisiones</td></tr>
                        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>calif_ind4</b></td><td>decimal</td><td>Indicador de motivos de retransmisión</td></tr>
                        <tr><td style="padding: 6px; border-bottom: 1px solid #eee;"><b>calif_ind5</b></td><td>decimal</td><td>Indicador de oportunidad de aclaraciones</td></tr>
                    </tbody>
                </table>
            </div>
            <p style="margin-top:10px; font-size: 0.75rem; color: #64748b;"><i>Datos obtenidos de GEMA</i></p>
        </div>
    `;

    const msgDiv = $('<div class="message agent-message"></div>').html(diccionarioHtml);
    $("#chat-window").append(msgDiv);
    $("#chat-window").animate({ scrollTop: $("#chat-window")[0].scrollHeight }, 800);
});
    
    // Listeners de eventos
    $("#send-btn").on("click", ejecutarConsulta);
    $("#user-input").on("keypress", function(e) { 
        if(e.which == 13) ejecutarConsulta(); 
    });

    function ejecutarConsulta() {
        const query = $("#user-input").val().trim();
        if (!query) return;

        appendMessage(query, 'user');
        $("#user-input").val("");
        $("#loading-overlay").css("display", "flex");

        fetch(MAKE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "consulta": query })
        })
        .then(res => res.json())
        .then(data => {
            $("#loading-overlay").hide();
            procesarRespuesta(data);
        })
        .catch(err => {
            $("#loading-overlay").hide();
            appendMessage("Error conectando con el servicio de datos.", 'agent');
            console.error("Error en Fetch:", err);
        });
    }

    function appendMessage(text, sender) {
    // Definimos las iniciales y el nombre según el remitente
    const avatarChar = (sender === 'user') ? 'L' : 'O';
    const displayName = (sender === 'user') ? 'Luis Antonio' : 'ORION';

    // Construimos el HTML anidando el encabezado y el texto dentro del mismo div de mensaje
    const msgHtml = `
        <div class="message ${sender}-message">
            <div class="agent-header" style="${sender === 'user' ? 'color: white; border-bottom: 1px solid rgba(255,255,255,0.2);' : ''}">
                <div class="avatar-mini" style="${sender === 'user' ? 'background: var(--azul-claro); color: var(--azul-piif);' : ''}">
                    ${avatarChar}
                </div>
                <span>${displayName}</span>
            </div>
            <div class="text">
                ${text}
            </div>
        </div>
    `;

    $("#chat-window").append(msgHtml);
    scrollChat();
}

    function scrollChat() {
        $("#chat-window").stop().animate({ 
            scrollTop: $("#chat-window")[0].scrollHeight 
        }, 800);
    }

    function setQuery(text) {
    $("#user-input").val(text);
    $("#user-input").focus();
}



    function procesarRespuesta(res) {
        const { visualizacion, config_ia, datos_puros } = res;
        
        // Verificación de seguridad si no hay datos
        if (!datos_puros || datos_puros.length === 0) {
            appendMessage("La consulta no devolvió resultados para los filtros aplicados.", 'agent');
            return;
        }

        const uniqueID = "vis_" + Date.now(); 
        const titulo = config_ia && config_ia.title ? config_ia.title : "Resultados de Consulta";
        
        appendMessage(`Aquí tienes los resultados:`, 'agent');

        const cardHtml = `
            <div class="data-card agent-message"> 
                <div id="${uniqueID}" style="width:100%; min-height: 300px;"></div>
                <div class="table-responsive mt-2">
                    <table id="table_${uniqueID}" class="display" style="width:100%"></table>
                </div>
            </div>
        `;
        $("#chat-window").append(cardHtml);

        if (visualizacion === "chart") {
            renderChart(uniqueID, config_ia, datos_puros);
        } else {
            renderTable(`table_${uniqueID}`, datos_puros);
        }
        scrollChat();
    }

    function renderChart(containerId, config, data) {
        // Ocultar la tabla en el contenedor de la gráfica
        $(`#table_${containerId}`).closest('.table-responsive').hide();

        if (typeof Highcharts === 'undefined') {
            $(`#${containerId}`).html("<p class='text-danger'>Error: Highcharts no cargado.</p>");
            return;
        }

        // 1. Identificar la métrica (la columna que no es texto ni periodo)
        const metricKey = Object.keys(data[0]).find(key => 
            !['periodo_evaluacion', 'ncorto_institucion', 'nombre_agr_formulario', 'claveSector', 'claveFormulario'].includes(key)
        ) || 'calif_tfor';

        // 2. Agrupar datos por Institución para crear series comparativas
        const seriesMap = {};
        data.forEach(item => {
            const nombreInst = item.ncorto_institucion || 'General';
            if (!seriesMap[nombreInst]) seriesMap[nombreInst] = [];
            
            seriesMap[nombreInst].push({
                name: item.periodo_evaluacion,
                y: parseFloat(item[metricKey] || 0)
            });
        });

        const series = Object.keys(seriesMap).map(name => ({
            name: name,
            data: seriesMap[name].map(pt => pt.y)
        }));

        // 3. Categorías (Eje X)
        const categories = [...new Set(data.map(i => i.periodo_evaluacion))].sort();

        Highcharts.chart(containerId, {
            chart: { type: config.type || 'line', borderRadius: 15 },
            title: { text: config.title || "Comparativa" },
            xAxis: { categories: categories },
            yAxis: { title: { text: 'Calificación' }, min: 0, max: 10 },
            tooltip: { shared: true, crosshairs: true },
            series: series,
            credits: { enabled: false }
        });
    }

    function renderTable(tableId, data) {
        // Eliminar el contenedor de la gráfica si es solo tabla
        const containerPrefix = tableId.replace('table_', '');
        $(`#${containerPrefix}`).hide();

        const columns = Object.keys(data[0]).map(key => ({
            title: key.toUpperCase().replace(/_/g, ' '),
            data: key
        }));

        $(`#${tableId}`).DataTable({
            data: data,
            columns: columns,
            dom: 'Bfrtip',
            language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
            pageLength: 5,
            ordering: true,
            responsive: true,
            className: 'compact stripe hover'
        });
    }
});