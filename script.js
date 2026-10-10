document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const btnText = submitBtn.querySelector('span');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Disable button and show spinner
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'block';

        // Gather data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('Datos de la encuesta:', data);

        //const airtableUrl = 'https://api.airtable.com/v0/app8mJMASi6hWJyrR/tbl8RHPT5yzPxThbV';
        //const airtableToken = 'YOUR_AIRTABLE_TOKEN_HERE';

        // Mapeamos los datos al formato de Airtable. 
        // IMPORTANTE: Los nombres a la izquierda deben coincidir exactamente con los nombres de tus columnas en Airtable.
        const record = {
            fields: {
                "IDEstudiante": data.id_estudiante,
                "NivelSatisfaccion": Number(data.nivel_satisfaccion),
                "ClaridadContenido": Number(data.claridad_contenido),
                "AplicabilidadPractica": Number(data.aplicabilidad_practica),
                "ComentariosAdicionales": data.comentarios_adicionales || ""
            }
        };

        const webhookUrl = 'https://javier-automation-proyect.app.n8n.cloud/webhook/6a49f7cf-d154-402e-8258-b5b429ae7841';

        //const airtableRequest = fetch(airtableUrl, {
        //    method: 'POST',
        //    headers: {
        //        'Authorization': `Bearer ${airtableToken}`,
        //        'Content-Type': 'application/json'
        //    },
        //    body: JSON.stringify({ records: [record] })
        //}).then(response => {
        //    if (!response.ok) return response.json().then(err => { throw err; });
        //    return response.json();
        //});

        const webhookRequest = fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) throw new Error('Error en el Webhook de n8n');
            return response.text();
        });

        Promise.all([webhookRequest])
            .then(() => {
                // Ocultar formulario y mostrar mensaje de éxito
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
            })
            .catch(error => {
                console.error('Error enviando los datos:', error);
                alert('Hubo un error al enviar la encuesta (revisa la consola para más detalles).');
                // Restaurar estado del botón
                submitBtn.disabled = false;
                btnText.style.display = 'block';
                spinner.style.display = 'none';
            });
    });
});
