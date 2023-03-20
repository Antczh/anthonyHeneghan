$("#homeBtn").click(function () {
  // window.location.reload();
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      console.log(res);
    },
  });
});
