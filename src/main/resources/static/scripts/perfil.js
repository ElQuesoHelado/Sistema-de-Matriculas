function primer_caracter_mayuscula(str) {
    str = str.toLowerCase();
    const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
    return str.split(" ").map((str) => {
        if(str.search("^[ivIV]+$") != -1)
            return str.toUpperCase();
        return str.length > 3 ? capitalize(str) : str;
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
    {data: "dni_prof"},
    {data: "prof_nombre"},
    {data: "prof_apellido"},
];

const columnDef1 = [
    {
        render: (data, row, type) => primer_caracter_mayuscula(data),
        targets: 1
    },
    {
        render: manejar_notas,
        targets: [2,3,4]
    },
    {visible: false, targets: [8, 6, 7]}
];
const column1 = [columnData1, columnDef1];

const columnData2 = [
    {title: "Codigo", data: "codigo"},
    {title: "Curso", data: "nombre"},
    {title: "Creditos", data: "creditos"},
    {title: "Semestre", data: "semestre"},
    {data: "codigo_doc"},
    {data: "docente_nombre"},
    {data: "docente_apellido"},
];
const columnDef2 = [
    {
        render: (data, type, row) => primer_caracter_mayuscula(data),
        targets: 1
    },
    {visible: false, targets: [4, 5, 6]}
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

function getTable(url, header, column) {
    if(!(url in TABLES_CACHE)) {
        console.error(`Failed to get ${url}`);
        loadAllTables(cui);
        return;
    }

    $("#content").html(`<h2>${header}</h2><table id="table"></table>`);
    let table = $("#table").DataTable(
        {
            data: TABLES_CACHE[url],
            columns: column[0],
            columnDefs: column[1]
        });
}

function verPerfil() {
    $("#content").html(`<p>Tu CUI es ${cui}</p><p>Tu promedio es ${promedio}</p>`);
}

function verCursosAprobados() {
    getTable("/aprobados", "Cursos aprobados", column1);
}

function verCursosReprobados() {
    getTable("/reprobados", "Cursos reprobados", column1);
}

function verPromedios() {
    getTable("/promedios", "Promedios", column3);
}

function verMatriculados() {
    getTable("/matriculados", "Matriculados", column1);
}

function verMatriculables() {
    getTable("/matriculables", "Matriculables", column2);
}

function verHistorial() {
    getTable("/historial", "Historial", column1);
}

function cerrarSesion() {
    window.location.href="/";
}

$(verPerfil);