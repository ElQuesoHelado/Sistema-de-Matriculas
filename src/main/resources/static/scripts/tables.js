function course_capitalize(str) {
  str = str.toLowerCase();
  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
  return str.split(" ").map((str) => {
      if(str.search("^[ivIV]+$") != -1)
          return str.toUpperCase();
      return str.length > 3 ? capitalize(str) : str;
  }).join(" ");
}

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
    targets: [3,4]
  },
  {
    visible: false,
    targets: 4
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
  }
};

const _TABLES_COLUMNS = {
  2: [_TABLE_MATRICULADOS_COLUMNS, _TABLE_MATRICULADOS_COLUMNSDEF],
  3: [_TABLE_MATRICULABLES_COLUMNS, _TABLE_MATRICULABLES_COLUMNSDEF],
};

function loadAllTables() {
  const rest_tables = [
    ["/matriculados", 2],
    ["/matriculables", 3],
  ];

  rest_tables.forEach(table => $.ajax(
    {
      url: table[0],
      method: "get",
      data: {
        cui: _CUI
      }
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