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
};

let _ACTUAL_ID = 0;

function save_profile() {
  _MENUS_HTML[0] = $("#main-content").html();
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
      $("#table").DataTable(
        {
          data: _TABLES_CACHE[id],
          columns: _TABLES_COLUMNS[id][0],
          columnDefs: _TABLES_COLUMNS[id][1],
          language: _TABLE_LANGUAGE
        }
      );
    }
  } else
    console.error(`Request menu id ${id} don't exists`);
}

function  logout() {
  //Spring Security se encarga del logout en esa URI especificamente
  window.location.href = "/logout";
}

$(save_profile);