function identity_if_number(str) {
  return str.search("^[0-9]+$") == -1 ? null : str;
}

function error_msg(text) {
  $("#error-text").text(text);
  bootstrap.Toast.getOrCreateInstance("#error-toast").show();
}

$("#loginForm").on(
  "submit", function() {
    const username = identity_if_number($("#username").val());
    if(username == null) {
      error_msg("Debe ingresar un CUI válido");
      return false;
    }

    return true;
  }
);

$(() => {
  const params = new URLSearchParams(window.location.search);
  console.log("AA");
  if(params.has("error")) {
    error_msg(params.get("error"));
  }
});