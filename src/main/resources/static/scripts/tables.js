const TABLES_CACHE = {};

function loadAllTables(cui) {
  const rest_tables = [
    "/aprobados",
    "/reprobados",
    "/promedios",
    "/matriculados",
    "/matriculables",
    "/historial",
  ];

  rest_tables.forEach(table => $.ajax(
    {
      url: table,
      method: "get",
      data: {
        cui,
      }
    }).done(data => TABLES_CACHE[table] = data));
}

loadAllTables(cui);