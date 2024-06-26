const columns1 = [
    {title: "Codigo", data: "codigo"},
    {title: "Curso", data: "nombre"},
    {title: "1° Unidad", data: "nota1"},
    {title: "2° Unidad", data: "nota2"},
    {title: "3° Unidad", data: "nota3"},
    {title: "Semestre", data: "semestre"},
    {title: "DNI Docente", data: "dni_prof"},
    {title: "Nombre Docente", data: "prof_nombre"},
    {title: "Apellido Docente", data: "prof_apellido"},
];

const columns2 = [
    {title: "Codigo", data: "codigo"},
    {title: "Curso", data: "nombre"},
    {title: "Creditos", data: "creditos"},
    {title: "Semestre", data: "semestre"},
    {title: "DNI Docente", data: "codigo_doc"},
    {title: "Nombre Docente", data: "docente_nombre"},
    {title: "Apellido Docente", data: "docente_apellido"},
];

const columns3 = [
    {title: "Codigo", data: "codigo"},
    {title: "Curso", data: "nombre"},
    {title: "1° Unidad", data: "nota1"},
    {title: "2° Unidad", data: "nota2"},
    {title: "3° Unidad", data: "nota3"},
    {title: "Promedio", data: "promedio"},
    {title: "Semestre", data: "semestre"},
];

function toggleSubmenu(id) {
    var submenu = document.getElementById(id);
    if (submenu.style.display === 'block') {
        submenu.style.display = 'none';
    } else {
        submenu.style.display = 'block';
    }
}

function requestTable(url, header, columns) {
    $.ajax({
        url: url,
        method: "get",
        data: {
            cui: cui
        }
    }).done(data => {
        $("#content").html(
          `<h2>${header}</h2><table id="table"></table>`
        );
        $("#table").DataTable(
            {
                data: data,
                columns: columns
            }
        )
    });
}

function verCursosAprobados() {
    requestTable("/aprobados", "Cursos aprobados", columns1);
}

function verCursosReprobados() {
    requestTable("/reprobados", "Cursos reprobados", columns1);
}

function verPromedios() {
    requestTable("/promedios", "Promedios", columns3);
}

function verMatriculados() {
    requestTable("/matriculados", "Matriculables", columns1);
}

function verMatriculables() {
    requestTable("/matriculables", "Matriculables", columns2);
}

function verHistorial() {
    requestTable("/historial", "Historial", columns1);
}

function cerrarSesion() {
    window.location.href="/";
}

