let turnos = [];

const horaSelect =
document.getElementById('hora');

function generarHoras(){

horaSelect.innerHTML =
'<option value="">Seleccione Hora</option>';

let hora = 7;
let minutos = 0;

while(hora < 18){

let textoHora =
String(hora).padStart(2,'0')
+
':'
+
String(minutos).padStart(2,'0');

let option =
document.createElement('option');

option.value = textoHora;

option.textContent = textoHora;

horaSelect.appendChild(option);

minutos += 45;

if(minutos >= 60){

hora++;

minutos -= 60;

}

}

}

generarHoras();

function agregarTurno(){

const paciente =
document.getElementById('paciente')
.value
.trim()
.toUpperCase();

const profesional =
document.getElementById('profesional')
.value
.trim()
.toUpperCase();

const fecha =
document.getElementById('fecha').value;

const hora =
document.getElementById('hora').value;

if(
!paciente ||
!profesional ||
!fecha ||
!hora
){

alert("Complete todos los campos");

return;

}

const sesionesProfesional =
turnos.filter(
t => t.profesional === profesional
);

if(sesionesProfesional.length >= 12){

alert("Máximo 12 sesiones");

return;

}

const pacienteMismoDia =
turnos.find(
t =>
t.paciente === paciente &&
t.fecha === fecha
);

if(pacienteMismoDia){

alert("El paciente ya tiene sesión ese día");

return;

}

const profesionalesPaciente =
[
...new Set(
turnos
.filter(
t => t.paciente === paciente
)
.map(
t => t.profesional
)
)
];

if(
!profesionalesPaciente.includes(profesional)
&& profesionalesPaciente.length >= 5
){

alert("Máximo 5 profesionales");

return;

}

const cruce =
turnos.find(
t =>
t.profesional === profesional &&
t.fecha === fecha &&
t.hora === hora
);

if(cruce){

alert("Ese profesional ya tiene una cita en esa hora");

return;

}

turnos.push({
paciente,
profesional,
fecha,
hora
});

actualizarTabla();

}

function actualizarTabla(){

let html = "";

turnos.forEach((turno,index)=>{

const inicio =
new Date(`${turno.fecha}T${turno.hora}`);

const fin =
new Date(
inicio.getTime() + 45 * 60000
);

const horaFin =
fin.toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit'
});

html += `
<tr>

<td>${turno.paciente}</td>

<td>${turno.profesional}</td>

<td>${turno.fecha}</td>

<td>${turno.hora}</td>

<td>${horaFin}</td>

<td>

<button onclick="eliminarTurno(${index})">
Eliminar
</button>

</td>

</tr>
`;

});

document.getElementById('tabla').innerHTML =
html;

limpiarFormulario();

}

function eliminarTurno(index){

turnos.splice(index,1);

actualizarTabla();

}

function limpiarFormulario(){

document.getElementById('paciente').value = "";

document.getElementById('profesional').value = "";

document.getElementById('fecha').value = "";

document.getElementById('hora').value = "";

}

function descargarPDF(){

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

doc.setFontSize(18);

doc.text("Reporte de Turnos",20,20);

doc.setFontSize(12);

let y = 40;

turnos.forEach((t,index)=>{

const inicio =
new Date(`${t.fecha}T${t.hora}`);

const fin =
new Date(
inicio.getTime() + 45 * 60000
);

const horaFin =
fin.toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit'
});

doc.text(
`${index+1}. ${t.paciente}`,
20,
y
);

doc.text(
`Profesional: ${t.profesional}`,
20,
y + 7
);

doc.text(
`Fecha: ${t.fecha}`,
20,
y + 14
);

doc.text(
`Hora Inicio: ${t.hora}`,
20,
y + 21
);

doc.text(
`Hora Fin: ${horaFin}`,
20,
y + 28
);

y += 40;

});

doc.save("Turnos.pdf");

}