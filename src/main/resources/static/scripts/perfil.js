function primer_caracter_mayuscula(str) {
    str = str.toLowerCase();
    const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
    return str.split(" ").map((str) => {
        if(str.search("^[ivIV]+$") != -1)
            return str.toUpperCase();
        return capitalize(str);
    }).join(" ");
}

function mostrar_promedio(data, type, row) {
    return parseFloat(data).toFixed(0);
}

function manejar_notas(data, type, row) {
    return data.toString().trim().charAt(0) == "-" ? "Aún no disponible" : data;
}

const columnData1 = [
    {title: "Codigo", data: "codigo"},
    {title: "Curso", data: "nombre"},
    {title: "1° Unidad", data: "nota1"},
    {title: "2° Unidad", data: "nota2"},
    {title: "3° Unidad", data: "nota3"},
    {title: "Semestre", data: "semestre"},
    {title: "DNI Docente", data: "dni_prof"},
    {title: "Docente", data: "prof_nombre"},
    {data: "prof_apellido"},
];

const columnDef1 = [
    {
        render: (data, type, row) => data + " " + row["prof_apellido"],
        targets: 7
    },
    {
        render: (data, row, type) => primer_caracter_mayuscula(data),
        targets: 1
    },
    {
        render: manejar_notas,
        targets: [2,3,4]
    },
    {visible: false, targets: 8}
];
const column1 = [columnData1, columnDef1];

const columnData2 = [
    {title: "Codigo", data: "codigo"},
    {title: "Curso", data: "nombre"},
    {title: "Creditos", data: "creditos"},
    {title: "Semestre", data: "semestre"},
    {title: "DNI Docente", data: "codigo_doc"},
    {title: "Nombre Docente", data: "docente_nombre"},
    {data: "docente_apellido"},
];
const columnDef2 = [
    {
        render: (data, type, row) => data + " " + row["docente_apellido"],
        targets: 5
    },
    {
        render: (data, type, row) => primer_caracter_mayuscula(data),
        targets: 1
    },
    {visible: false, targets: 6}
];
const column2 = [columnData2, columnDef2];

const columnData3 = [
    {title: "Codigo", data: "codigo"},
    {title: "Curso", data: "nombre"},
    {title: "1° Unidad", data: "nota1"},
    {title: "2° Unidad", data: "nota2"},
    {title: "3° Unidad", data: "nota3"},
    {title: "Promedio", data: "promedio"},
    {title: "Semestre", data: "semestre"},
];
const columnDef3 = [
    {
        render: (data, row, type) => primer_caracter_mayuscula(data),
        targets: 1,
    },
    {
        render: mostrar_promedio,
        targets: 5
    },
    {
        render: manejar_notas,
        targets: [2,3,4]
    },
];
const column3 = [columnData3, columnDef3];

function toggleSubmenu(id) {
    var submenu = document.getElementById(id);
    if (submenu.style.display === 'block') {
        submenu.style.display = 'none';
    } else {
        submenu.style.display = 'block';
    }
}

function requestTable(url, header, column) {
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
                columns: column[0],
                columnDefs: column[1]
            }
        )
    });
}

function verCursosAprobados() {
    requestTable("/aprobados", "Cursos aprobados", column1);
}

function verCursosReprobados() {
    requestTable("/reprobados", "Cursos reprobados", column1);
}

function verPromedios() {
    requestTable("/promedios", "Promedios", column3);
}

function verMatriculados() {
    requestTable("/matriculados", "Matriculados", column1);
}

function verMatriculables() {
    requestTable("/matriculables", "Matriculables", column2);
}

function verHistorial() {
    requestTable("/historial", "Historial", column1);
}

function cerrarSesion() {
    window.location.href="/";
}

