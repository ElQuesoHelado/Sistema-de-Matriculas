function course_capitalize(str) {
    str = str.toLowerCase();
    const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
    return str.split(" ").map((str) => {
        if (str.search("^[ivIV]+$") != -1)
            return str.toUpperCase();
        return str.length > 3 ? capitalize(str) : str;
    }).join(" ");
}
DataTable.defaults.layout = {
    topStart: 'pageLength',
    topEnd: 'search',
    bottomStart: 'info',
    bottomEnd: 'paging',
    bottom: null
};

const _TABLES_CACHE = {};
const _TABLE_MATRICULADOS_COLUMNS = [
    {title: "Código", data: "codigo"},
    {title: "Créditos", data: "creditos"},
    {title: "Curso", data: "nombre"},
    {title: "Docente", data: "prof_apellido"},
    {data: "prof_nombre"},
    {title: "Semestre", data: "semestre"},
];
const _TABLE_MATRICULADOS_COLUMNSDEF = [
    {
        render: (data, row, type) => course_capitalize(data),
        targets: 2
    },
    {
        render: (data, row, type) => type["prof_nombre"] + " " + data,
        targets: [3, 4]
    },
    {
        visible: false,
        targets: 4
    },
    {
        searchable: false,
        targets: [1,5]
    }
];
const _TABLE_MATRICULABLES_COLUMNS = [
    {title: "Código", data: "codigo"},
    {title: "Curso", data: "nombre"},
    {title: "Semestre", data: "semestre"},
    {title: "Créditos", data: "creditos"},
];
const _TABLE_MATRICULABLES_COLUMNSDEF = [
    {
        render: (data, row, type) => course_capitalize(data),
        targets: 1
    },
    {
        searchable: false,
        targets: [2,3]
    }
];
const _TABLE_MATRICULAS_COLUMNS = [
    {title: "Código", data: "codigo"},
    {title: "Curso", data: "nombre"},
    {title: "Semestre", data: "semestre"},
    {title: "Créditos", data: "creditos"},
    {
        data: null,
        orderable: false,
        render: DataTable.render.select(),
    }
];
const _TABLE_MATRICULAS_COLUMNSDEF = [
    {
        render: (data, row, type) => course_capitalize(data),
        targets: 1
    },
    {
        searchable: false,
        targets: [2,3]
    },
    {
        targets: 4,
        checkboxes: true
    }
];
const _TABLE_MATRICULAS_LAYOUT = {
    topStart: () => {
        let creditos = document.createElement("div");
        creditos.innerHTML = '<b>Creditos: <span id="creditos"></span></b>';
        return creditos;
    },
    bottomStart: 'info',
    bottomEnd: 'paging',
    bottom2End: {
        buttons: [
            {
                extend: "selected",
                text: "Matricular",
                action: matricularse
            }
        ]
    }

};
const _TABLE_LLEVADOS_COLUMNS = [
    {title: "Código", data: "codigo"},
    {title: "Curso", data: "nombre"},
    {title: "Semestre", data: "semestre"},
    {title: "Créditos", data: "creditos"},
    {title: "Notas", data: "nota"},
    {title: "N° matrícula", data: "numero"},
];
const _TABLE_LLEVADOS_COLUMNSDEF = [
    {
        render: (data, row, type) => course_capitalize(data),
        targets: 1,
    },
    {
        createdCell: function (td, cellData, rowData, row, col) {
            if (cellData < 10.5) {
                $(td).css('color', 'red');
                $(td).css('font-weight', 'bold')
            }
        },
        targets: 4
    },
    {
        searchable: false,
        targets: [2,3,4,5]
    }
];

const _TABLE_LANGUAGE = {
    lengthMenu: "Mostrar _MENU_ registros por página",
    zeroRecords: "Ningún registro encontrado",
    info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
    infoEmpty: "Ningún registro encontrado",
    infoFiltered: "(filtrados desde _MAX_ registros totales)",
    search: "Buscar:",
    loadingRecords: "Cargando...",
    paginate: {
        first: "Primero",
        last: "Último",
        next: "Siguiente",
        previous: "Anterior"
    },
    select: {
        rows: ""
    }
};

/*columns, columnsdef, layout */
const _TABLES_COLUMNS = {
    1: [_TABLE_LLEVADOS_COLUMNS, _TABLE_LLEVADOS_COLUMNSDEF, null],
    2: [_TABLE_MATRICULADOS_COLUMNS, _TABLE_MATRICULADOS_COLUMNSDEF, null],
    3: [_TABLE_MATRICULABLES_COLUMNS, _TABLE_MATRICULABLES_COLUMNSDEF, null],
    4: [_TABLE_MATRICULAS_COLUMNS, _TABLE_MATRICULAS_COLUMNSDEF, _TABLE_MATRICULAS_LAYOUT],
};

function matricularse(e, dt, node, config) {
    const cods = Array.from(dt.cells(dt.rows({selected:true}).indexes(), 0).data());
    $.ajax(
        {
            url: "/matricular",
            contentType: "application/json",
            data: JSON.stringify(cods),
            method: "post"
        }
    ).done(data => {
        show_toast("Usted se matriculó", false);
        document.getElementById("perfil").click();
        loadAllTables();
    }).fail(xhr => {
        show_toast(xhr.responseText);
    });
}

function loadAllTables() {
    const rest_tables = [
        ["/historial", 1],
        ["/matriculados", 2],
        ["/matriculables", 3],
        ["/matriculables", 4],
    ];

    rest_tables.forEach(table => $.ajax(
        {
            url: table[0],
            method: "get",
        }
    ).done(data => {
        const id = table[1];
        _MENUS_HTML[id] = create_div('<table class="table" id="table"></table>');
        _TABLES_CACHE[id] = data;
        reload_menu(id);
    }).fail(() => {
        _MENUS_HTML[table[1]] = create_div(`Error al obtener table del url ${table[0]}`);
    }));
}

loadAllTables();