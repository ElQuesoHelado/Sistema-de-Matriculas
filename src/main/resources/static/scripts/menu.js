function create_div(content) {
  return `<div class="d-inline-block rounded border p-3 bg-white">${content}</div>`;
}

function default_div() {
  return create_div('<span class="spinner-border text-slider"></span>');
}

const _MENUS_HTML = {
  0: default_div(),
  1: default_div(),
  2: default_div(),
  3: default_div(),
  4: default_div(),
};

let _ACTUAL_ID = 0;
let _MIN_CREDITOS = 0;
let _MAX_CREDITOS = 0;

function save_profile() {
  const reprobados = parseInt($("#reprobados").html());
  if(reprobados > 0) {
    _MIN_CREDITOS = 1;
    _MAX_CREDITOS = 18;
  } else {
    _MIN_CREDITOS = 22;
    _MAX_CREDITOS = 26;
  }
  _MENUS_HTML[0] = $("#main-content").html();
}

function show_toast(msg, iserror=true) {
  const toasttext = document.getElementById("toast-text");
  toasttext.textContent = msg;
  toasttext.classList.value = "";
  if(iserror) {
    toasttext.classList.add("text-danger");
  } else {
    toasttext.classList.add("text-success");
  }
  const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById("error-toast"));
  toast.show();
}

function reload_menu(id) {
  if(id == _ACTUAL_ID)
    $("#main-content").html(_MENUS_HTML[_ACTUAL_ID]);
}

/**
 * 
 * @param {HTMLButtonElement} self 
 * @param {*} id
 */
function change_menu(self, id) {
  $(".active").removeClass("active");
  self.classList.add("active");

  if(id in _MENUS_HTML) {
    $("#main-content").html(_MENUS_HTML[id]);
    _ACTUAL_ID = id;
    if(id != 0) {
      const table = $("#table").DataTable(
        {
          data: _TABLES_CACHE[id],
          columns: _TABLES_COLUMNS[id][0],
          columnDefs: _TABLES_COLUMNS[id][1],
          language: _TABLE_LANGUAGE,
          select: {
            style: "multi",
            selector: "td:last-child"
          },
          layout: (_TABLES_COLUMNS[id][2] != null ? _TABLES_COLUMNS[id][2] : DataTable.defaults.layout),
        }
      );

      if(id == 4) {
        const creditos = $("#creditos");
        creditos.html(_MAX_CREDITOS);
        table.on("select", (e, dt, type, indexes) => {
          const ncreditos = parseInt(creditos.html());
          const creditoactual = parseInt(dt.cells(indexes, 3).data()[0]);
          if(ncreditos - creditoactual < 0) {
            dt[type](indexes).deselect();
          } else {
            creditos.html(ncreditos - creditoactual);
          }
        });
        table.on("deselect", (e, dt, type, indexes) => {
          const ncreditos = parseInt(creditos.html());
          const creditoactual = parseInt(dt.cells(indexes, 3).data()[0]);
          creditos.html(ncreditos + creditoactual);
        });
        /*
        
         table.on("select", (e, dt, type, indexes) => {
          const ncreditos = parseInt(creditos.html());
          const creditosactuales = Array.from(dt.cells(indexes, 3).data()).map(x => parseInt(x));
          creditosactuales.forEach(x => {
            if(ncreditos - creditoactual < 0) {
              dt[type](x).deselect();
            } else {
              creditos.html(ncreditos - x);
            }
          });
        });
        table.on("deselect", (e, dt, type, indexes) => {
          const ncreditos = parseInt(creditos.html());
          const creditoactual = parseInt(dt.cells(indexes, 3).data()[0]);
          creditos.html(ncreditos + creditoactual);
        });
        */
      }
    }
  } else
    console.error(`Request menu id ${id} don't exists`);
}

function  logout() {
  //Spring Security se encarga del logout en esa URI especificamente
  window.location.href = "/logout";
}

$(save_profile);