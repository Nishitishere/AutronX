var glassName = "";

let allData = {
  Panel: "None",
  Material: "None",
  Module: "None",
  glassTitle: "Black",
  frame: "Chrome",
  Quantity: "None",
};
var boxSize = 0;
var mod = 0;
var obj = 1;
var n = 1;
var box1Capacity = 0;
var box2Capacity = 0;
var box1lis = {};
var box2lis = {};
let customerRequirement = {};
let design = "";
$(document).ready(function () {
  $(".right-bar").addClass("hide");
  $(".quantity-switch").addClass("hide");
  $("#colorSec").removeClass("button");
  $("#buildbtn").removeClass("button");
  $("#buildbtn").click(function () {
    design = "buildBtn";
    $(".navbar").addClass("hide");
    $("#watermark").removeClass("hide");
    $(".right-bar").removeClass("hide");
    $(".rmenu-item:first-child").removeClass("disabled");
    allData.Panel = "Edge";
    $("#colorSec").removeClass("button");
    $("#buildbtn").addClass("button");

    // set edge or class what is selected to set border in buttons conditionally
    $('#maindiv').removeClass("color");
    $('#maindiv').addClass("edge");

  });
  $("#colorSec").click(function () {
    design = "color";
    $(".navbar").addClass("hide");
    $("#watermark").removeClass("hide");
    $(".right-bar").removeClass("hide");
    $(".rmenu-item:first-child").removeClass("disabled");
    allData.Panel = "Color";
    $("#colorSec").addClass("button");
    $("#buildbtn").removeClass("button");

    // set edge or class what is selected to set border in buttons conditionally
    $('#maindiv').removeClass("edge");
    $('#maindiv').addClass("color");

  });
  $("#GetEmail").click(function () {
    allData.Quantity = "glass";
    let val = document.getElementById("QuantityValue").value;
    allData.Quantity = val;
    if (val > 0) {
      for (const i in allData) {
        if (allData[i] == 0) {
          delete allData[i];
        }
      }
      loadData(allData);
      var getValue = document.getElementById("email-verify");
      if (getValue.value != "") {
        getValue.value = "";
      }
      $(".rmenu-material").addClass("hide");
      $(".rmenu-module").addClass("hide");
      $(".accessories-rmenu").addClass("hide");
      $(".rmenu-icon").addClass("hide");
      $(".rmenu-glass").addClass("hide");
      $(".rmenu-frame").addClass("hide");
      $(".rmenu-item-round").addClass("hide");

      $(".verify-email").css("display", "inline-block");
      // $("#GetEmail").css("display", "none");
      $("#GetEmail").addClass("hide");

      $(".quantity-switch").addClass("hide");
    } else {
      customAlert("Important! Please Select the quantity..");
    }
  });
  $(".mod-close").click(function () {
    $("#myModal").removeClass("show");
  });
  // selecting material
  $(".material").click(function () {
    $(".tp-close").removeClass("show");
    $(".rmenu-material").removeClass("show");
    $(".rmenu-icon").removeClass("show");
    $(".rmenu-module").removeClass("show");
    $(".rmenu-glass").removeClass("show");
    $(".rmenu-frame").removeClass("show");
    $(".accessories-rmenu").removeClass("show");
    $(".close").removeClass("show");
    $(".closetwo").removeClass("show");
    $(".closethree").removeClass("show");

    $(".tp-close").addClass("show");
    $("#GetEmail").attr("disabled", "true");
    $("#email-verify").attr("disabled", "true");
    $("#GetImg").attr("disabled", "true");
    $(".rmenu-material").removeClass("hide");
    $(".rmenu-material").addClass("show");
  });

  var mat = "g";
  // for selecting any item on going back
  $(document).on("click", ".rmenu-item", function () {
    $(".tp-close").removeClass("show");
    $(".rmenu-material").removeClass("show");
    $(".rmenu-module").removeClass("show");
    $(".rmenu-glass").removeClass("show");
    $(".rmenu-icon").removeClass("show");
    $(".rmenu-frame").removeClass("show");
    $(".accessories-rmenu").removeClass("show");
    // $(".rmenu-wall").removeClass("show");
    $(".close").removeClass("show");
    $(".closetwo").removeClass("show");
    $(".closethree").removeClass("show");

    if ($(this).attr("title") == "material") {
      $(".tp-close").addClass("show");
      $("#GetEmail").attr("disabled", "true");
      $("#email-verify").attr("disabled", "true");
      $("#email-verify").css("display", "none");
      $("#GetImg").attr("disabled", "true");
      $("#GetImg").css("display", "none");
      $(".rmenu-material").removeClass("hide");
      $(".rmenu-material").addClass("show");
      $("#GetEmail").addClass("hide");
      $(".quantity-switch").addClass("hide");
      $(".sub-module").removeClass("hiden-border");

      $(".accessories").removeClass("active");
      $(".size").removeClass("active");
      $(".glass").removeClass("active");
      $(".frame").removeClass("active");
      $(".icon").removeClass("active");
      $(".material").addClass("active");
    }

    if ($(this).attr("title") == "module") {
      $(".tp-close").addClass("show");
      $("#GetEmail").attr("disabled", "true");
      $("#email-verify").attr("disabled", "true");
      $("#email-verify").css("display", "none");
      $("#GetImg").attr("disabled", "true");
      $("#GetImg").css("display", "none");
      $(".rmenu-module").removeClass("hide");
      $(".rmenu-module").addClass("show");
      $("#GetEmail").addClass("hide");
      $("#email-verify").value = "";
      $(".quantity-switch").removeClass("hide");
      $(".sub-module").removeClass("hiden-border");

      $(".material").removeClass("active");
      $(".accessories").removeClass("active");
      $(".glass").removeClass("active");
      $(".frame").removeClass("active");
      $(".icon").removeClass("active");
      $(".size").addClass("active");
    }
    if ($(this).attr("title") == "accessories") {
      $(".tp-close").addClass("show");
      $("#GetEmail").attr("disabled", "true");
      $("#email-verify").attr("disabled", "true");
      $("#email-verify").css("display", "none");
      $("#GetImg").attr("disabled", "true");
      $("#GetImg").css("display", "none");
      $(".accessories-rmenu").removeClass("hide");
      $(".accessories-rmenu").addClass("show");
      $(".closetwo").addClass("show");
      $(".closethree").addClass("show");
      $(".close").addClass("show");
      $("#GetEmail").addClass("hide");
      $(".sub-module").removeClass("hiden-border");

      $(".rmenu-item:nth-child(4)").removeClass("disabled");
      $(".rmenu-item:nth-child(5)").removeClass("disabled");
      $(".rmenu-item:nth-child(6)").removeClass("disabled");
      $(".rmenu-item:nth-child(7)").removeClass("disabled");

      $(".material").removeClass("active");
      $(".size").removeClass("active");
      $(".glass").removeClass("active");
      $(".frame").removeClass("active");
      $(".icon").removeClass("active");
      $(".accessories").addClass("active");
    }
    if ($(this).attr("title") == "icon") {
      $(".tp-close").addClass("show");

      $("#GetEmail").attr("disabled", "true");
      $("#email-verify").attr("disabled", "true");
      $("#email-verify").css("display", "none");
      $("#GetImg").attr("disabled", "true");
      $("#GetImg").css("display", "none");
      $(".rmenu-icon").removeClass("hide");
      $(".rmenu-icon").addClass("show");
      $(".closetwo").addClass("show");
      $(".closethree").addClass("show");
      $(".close").addClass("show");
      $("#GetEmail").addClass("hide");
      $(".quantity-switch").removeClass("hide");
      $(".sub-module").removeClass("hiden-border");

      $(".rmenu-item:nth-child(4)").removeClass("disabled");
      $(".rmenu-item:nth-child(5)").removeClass("disabled");
      $(".rmenu-item:nth-child(6)").removeClass("disabled");
      $(".rmenu-item:nth-child(7)").removeClass("disabled");

      $(".material").removeClass("active");
      $(".size").removeClass("active");
      $(".glass").removeClass("active");
      $(".frame").removeClass("active");
      $(".accessories").removeClass("active");
      $(".icon").addClass("active");
    }
    if ($(this).attr("title") == "glass") {
      $("#GetEmail").removeAttr("disabled");
      $("#email-verify").removeAttr("disabled");
      $("#email-verify").css("display", "none");
      $("#GetImg").removeAttr("disabled");
      $("#GetImg").css("display", "none");
      $(".rmenu-glass").removeClass("hide");
      $(".rmenu-glass").addClass("show");
      $("#GetEmail").removeClass("hide");
      $(".quantity-switch").removeClass("hide");

      $(".material").removeClass("active");
      $(".size").removeClass("active");
      $(".accessories").removeClass("active");
      $(".frame").removeClass("active");
      $(".icon").removeClass("active");
      $(".glass").addClass("active");
      $(".sub-module").addClass("hiden-border");
    }
    if ($(this).attr("title") == "frame") {
      $("#GetEmail").removeAttr("disabled");
      $("#email-verify").removeAttr("disabled");
      $("#email-verify").css("display", "none");
      $("#GetImg").removeAttr("disabled");
      $("#GetImg").css("display", "none");
      $(".rmenu-frame").removeClass("hide");
      $(".rmenu-frame").addClass("show");
      $("#GetEmail").removeClass("hide");
      $(".quantity-switch").removeClass("hide");
      $(".sub-module").addClass("hiden-border");

      $(".material").removeClass("active");
      $(".size").removeClass("active");
      $(".glass").removeClass("active");
      $(".accessories").removeClass("active");
      $(".icon").removeClass("active");
      $(".frame").addClass("active");
    }
  });
  $(".rmenu-item-material").click(function () {
    $(".rmenu-item:nth-child(2)").removeClass("disabled");
    $(".starter-template").removeClass("hide");
    $(".module").addClass("hide");
    $(".module").removeClass("module-display");

    for (const key in customerRequirement) {
      delete customerRequirement[key];
    }

    for (const key in box1lis) {
      delete box1lis[key];
    }

    for (const key in box2lis) {
      delete box2lis[key];
    }

    for (const key in allData) {
      for (let j = 0; n > j; j++) {
        if (key === "Accessories-" + j) {
          delete allData[key];
        }
      }
    }
    n = 1;
    obj = 1;
    if ($(this).attr("title") == "glass") {
      material = "g";
      $(".gl").addClass("hide");
      glassName = "Glass Color";
      for (const key in allData) {
        if (key === "glassTitle") {
          allData["Glass Color"] = allData["glassTitle"];
          delete allData["glassTitle"];
          break;
        }
        if (key === "Acrylic") {
          allData["Glass Color"] = allData["Acrylic"];
          delete allData["Acrylic"];
          break;
        }
      }

      $(".rmenu-item-material:nth-child(2)").removeClass("active");
      $(".rmenu-item-material:nth-child(1)").addClass("active");
      allData.Material = "Glass";
    }

    if ($(this).attr("title") == "acrylic") {
      material = "a";
      $(".gl").removeClass("hide");
      glassName = "Acrylic";
      for (const key in allData) {
        if (key === "glassTitle") {
          allData["Acrylic"] = allData["glassTitle"];
          delete allData["glassTitle"];
          break;
        }
        if (key === "Glass Color") {
          allData["Acrylic"] = allData["Glass Color"];
          delete allData["Glass Color"];
          break;
        }
      }

      $(".rmenu-item-material:nth-child(1)").removeClass("active");
      $(".rmenu-item-material:nth-child(2)").addClass("active");
      allData.Material = "Acrylic";
    }
  });
  $(".rmenu-item-module").click(function () {
    boxSize = 0;
    box1Capacity = 0;
    box2Capacity = 0;
    for (const key in customerRequirement) {
      delete customerRequirement[key];
    }

    for (const key in box1lis) {
      delete box1lis[key];
    }

    for (const key in box2lis) {
      delete box2lis[key];
    }

    for (const key in allData) {
      for (let j = 0; n > j; j++) {
        if (key === "Accessories-" + j) {
          delete allData[key];
        }
      }
    }
    n = 1;
    obj = 1;
    $(".starter-template").addClass("hide");
    $(".rmenu-item:nth-child(3)").removeClass("disabled");
    $(".module").removeClass("module-2");
    $(".module").removeClass("module-4");
    $(".module").removeClass("module-6");
    $(".module").removeClass("module-8");
    $(".module").removeClass("module-10");
    $(".module").removeClass("module-12");
    $(".module").removeClass("hide");
    $(".module").addClass("module-display");

    $(".l2").removeClass("hide");
    $(".l3").removeClass("hide");
    $(".l4").removeClass("hide");
    if ($(this).attr("title") == 2) {
      boxSize = 2;
      mod = 0;
      box1Capacity = 0;
      box2Capacity = 0;
      $(".module").addClass("module-2");
      $(".module").html('<div class="sub-module-f sub-module"></div>');
      $(".l3").addClass("hide");
      $(".l4").addClass("hide");

      $(".rmenu-item-module:nth-child(1)").addClass("active");
      $(".rmenu-item-module:nth-child(2)").removeClass("active");
      $(".rmenu-item-module:nth-child(3)").removeClass("active");
      $(".rmenu-item-module:nth-child(4)").removeClass("active");
      $(".rmenu-item-module:nth-child(5)").removeClass("active");
      $(".rmenu-item-module:nth-child(6)").removeClass("active");

      allData.Module = 2;
    }
    if ($(this).attr("title") == 4) {
      boxSize = 4;
      box1Capacity = 0;
      box2Capacity = 0;
      mod = 0;
      $(".module").addClass("module-4");
      $(".module").html('<div class="sub-module-se sub-module"></div>');
      $(".l4").addClass("hide");

      $(".rmenu-item-module:nth-child(2)").addClass("active");
      $(".rmenu-item-module:nth-child(1)").removeClass("active");
      $(".rmenu-item-module:nth-child(3)").removeClass("active");
      $(".rmenu-item-module:nth-child(4)").removeClass("active");
      $(".rmenu-item-module:nth-child(5)").removeClass("active");
      $(".rmenu-item-module:nth-child(6)").removeClass("active");

      allData.Module = 4;
    }
    if ($(this).attr("title") == 6) {
      boxSize = 6;
      box1Capacity = 0;
      box2Capacity = 0;
      mod = 0;
      $(".module").addClass("module-6");
      $(".module").html('<div class="sub-module-th sub-module"></div>');

      $(".rmenu-item-module:nth-child(3)").addClass("active");
      $(".rmenu-item-module:nth-child(2)").removeClass("active");
      $(".rmenu-item-module:nth-child(1)").removeClass("active");
      $(".rmenu-item-module:nth-child(4)").removeClass("active");
      $(".rmenu-item-module:nth-child(5)").removeClass("active");
      $(".rmenu-item-module:nth-child(6)").removeClass("active");

      allData.Module = 6;
    }
    if ($(this).attr("title") == 8) {
      boxSize = 8;
      box1Capacity = 0;
      box2Capacity = 0;
      mod = 0;
      $(".module").addClass("module-8");
      $(".module").html('<div class="sub-module-fo sub-module"></div>');

      $(".rmenu-item-module:nth-child(4)").addClass("active");
      $(".rmenu-item-module:nth-child(2)").removeClass("active");
      $(".rmenu-item-module:nth-child(3)").removeClass("active");
      $(".rmenu-item-module:nth-child(1)").removeClass("active");
      $(".rmenu-item-module:nth-child(5)").removeClass("active");
      $(".rmenu-item-module:nth-child(6)").removeClass("active");
      allData.Module = 8;
    }
    // if ($(this).attr("title") == 10) {
    //   boxSize = 10;
    //   box1Capacity = 0;
    //   box2Capacity = 0;
    //   mod = 0;
    //   $(".module").addClass("module-10");
    //   $(".module").html('<div class="sub-module-pi sub-module"></div>');

    //   $(".rmenu-item-module:nth-child(5)").addClass("active");
    //   $(".rmenu-item-module:nth-child(2)").removeClass("active");
    //   $(".rmenu-item-module:nth-child(3)").removeClass("active");
    //   $(".rmenu-item-module:nth-child(1)").removeClass("active");
    //   $(".rmenu-item-module:nth-child(4)").removeClass("active");
    //   $(".rmenu-item-module:nth-child(6)").removeClass("active");
    //   allData.Module = 10;
    // }
    if ($(this).attr("title") == 12) {
      mod = 12;
      box1Capacity = 0;
      box2Capacity = 0;
      boxSize = 12;
      $(".module").addClass("module-12");
      $(".module").html(
        '<div class="sub-module-th sub-module"></div><div class="sub-module-fi sub-module"></div>'
      );
      // $(".sub-module-fi").css("margin-top", "20px");

      // $(".rmenu-item-module:nth-child(6)").addClass("active");
      $(".rmenu-item-module:nth-child(2)").removeClass("active");
      $(".rmenu-item-module:nth-child(3)").removeClass("active");
      $(".rmenu-item-module:nth-child(4)").removeClass("active");
      $(".rmenu-item-module:nth-child(1)").removeClass("active");
      $(".rmenu-item-module:nth-child(5)").addClass("active");
      allData.Module = 12;
    }
  });

  $(".rmenu-item-icon").click(function () {
    if (boxSize > 0) {
      if ($(this).attr("title") == "usb") {
        if (boxSize >= 1) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 1) {
              box1mod12(1, ".sub-module-th", box1lis, "usb", "USB");
            } else if (6 >= box2Capacity + 1) {
              box1mod21(1, ".sub-module-fi", box2lis, "usb", "USB");
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            box2modAll(1, "usb", "USB");
          }
        } else {
          customAlert("Adding 1 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "ethernet") {
        if (boxSize >= 1) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 1) {
              box1mod12(1, ".sub-module-th", box1lis, "ethernet", "Ethernet");
            } else if (6 >= box2Capacity + 1) {
              box1mod21(1, ".sub-module-fi", box2lis, "ethernet", "Ethernet");
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            box2modAll(1, "ethernet", "Ethernet");
          }
        } else {
          customAlert("Adding 1 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "telephone") {
        if (boxSize >= 1) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 1) {
              box1mod12(1, ".sub-module-th", box1lis, "telephone", "Telephone");
            } else if (6 >= box2Capacity + 1) {
              box1mod21(1, ".sub-module-fi", box2lis, "telephone", "Telephone");
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            box2modAll(1, "telephone", "Telephone");
          }
        } else {
          customAlert("Adding 1 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "tv") {
        if (boxSize >= 1) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 1) {
              box1mod12(1, ".sub-module-th", box1lis, "tv", "TV");
            } else if (6 >= box2Capacity + 1) {
              box1mod21(1, ".sub-module-fi", box2lis, "tv", "TV");
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            box2modAll(1, "tv", "TV");
          }
        } else {
          customAlert("Adding 1 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "switch2") {
        if (boxSize >= 2) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 2) {
              switch2box1(2, ".sub-module-th", box1lis, "switch", "2 Switch");
            } else if (6 >= box2Capacity + 2) {
              switch2box2(2, ".sub-module-fi", box2lis, "switch", "2 Switch");
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            switch2(2, "switch", "2 Switch");
          }
        } else {
          customAlert("Adding 2 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "switch2-1-16A") {
        if (boxSize >= 2) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 2) {
              switch2box1(
                2,
                ".sub-module-th",
                box1lis,
                "switch",
                "2 Switch (1-16A)"
              );
            } else if (6 >= box2Capacity + 2) {
              switch2box2(
                2,
                ".sub-module-fi",
                box2lis,
                "switch",
                "2 Switch (1-16A)"
              );
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            switch2(2, "switch", "2 Switch (1-16A)");
          }
        } else {
          customAlert("Adding 2 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "switch2-1-2way") {
        if (boxSize >= 2) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 2) {
              switch2box1(
                2,
                ".sub-module-th",
                box1lis,
                "switch",
                "2 Switch (1-2way)"
              );
            } else if (6 >= box2Capacity + 2) {
              switch2box2(
                2,
                ".sub-module-fi",
                box2lis,
                "switch",
                "2 Switch (1-2way)"
              );
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            switch2(2, "switch", "2 Switch (1-2way)");
          }
        } else {
          customAlert("Adding 2 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "switch2-2-16A") {
        if (boxSize >= 2) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 2) {
              switch2box1(
                2,
                ".sub-module-th",
                box1lis,
                "switch",
                "2 Switch (2-16A)"
              );
            } else if (6 >= box2Capacity + 2) {
              switch2box2(
                2,
                ".sub-module-fi",
                box2lis,
                "switch",
                "2 Switch (2-16A)"
              );
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            switch2(2, "switch", "2 Switch (2-16A)");
          }
        } else {
          customAlert("Adding 2 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "pin-3-socket-amp") {
        if (boxSize >= 2) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 2) {
              box1mod12(
                2,
                ".sub-module-th",
                box1lis,
                "pin-3-socket-amp",
                "3 Pin Socket"
              );
            } else if (6 >= box2Capacity + 2) {
              box1mod21(
                2,
                ".sub-module-fi",
                box2lis,
                "pin-3-socket-amp",
                "3 Pin Socket"
              );
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            box2modAll(2, "pin-3-socket-amp", "3 Pin Socket");
          }
        } else {
          customAlert("Adding 2 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "socket-6-amp") {
        if (boxSize >= 2) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 2) {
              box1mod12(
                2,
                ".sub-module-th",
                box1lis,
                "socket-6-amp",
                "6 Amp Socket"
              );
            } else if (6 >= box2Capacity + 2) {
              box1mod21(
                2,
                ".sub-module-fi",
                box2lis,
                "socket-6-amp",
                "6 Amp Socket"
              );
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            box2modAll(2, "socket-6-amp", "6 Amp Socket");
          }
        } else {
          customAlert("Adding 2 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "socket-16-amp") {
        if (boxSize >= 2) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 2) {
              box1mod12(
                2,
                ".sub-module-th",
                box1lis,
                "socket-16-amp",
                "16 Amp Socket"
              );
            } else if (6 >= box2Capacity + 2) {
              box1mod21(
                2,
                ".sub-module-fi",
                box2lis,
                "socket-16-amp",
                "16 Amp Socket"
              );
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            box2modAll(2, "socket-16-amp", "16 Amp Socket");
          }
        } else {
          customAlert("Adding 2 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "bell") {
        if (boxSize >= 2) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 2) {
              box1mod12(2, ".sub-module-th", box1lis, "bell", "Bell");
            } else if (6 >= box2Capacity + 2) {
              box1mod21(2, ".sub-module-fi", box2lis, "bell", "Bell");
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            box2modAll(2, "bell", "Bell");
          }
        } else {
          customAlert("Adding 2 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "curtain") {
        if (boxSize >= 2) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 2) {
              box1mod12(2, ".sub-module-th", box1lis, "curtain", "Curtain");
            } else if (6 >= box2Capacity + 2) {
              box1mod21(2, ".sub-module-fi", box2lis, "curtain", "Curtain");
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            box2modAll(2, "curtain", "Curtain");
          }
        } else {
          customAlert("Adding 2 Module item is not possible!");
        }
      }

      if ($(this).attr("title") == "Dimme2") {
        if (boxSize >= 2) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 2) {
              dimme2box1(
                2,
                ".sub-module-th",
                box1lis,
                "Dimme2",
                "2 Dimme"
              );
            } else if (6 >= box2Capacity + 2) {
              dimme2box2(
                2,
                ".sub-module-fi",
                box2lis,
                "Dimme2",
                "2 Dimme"
              );
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            dimme2(2, "Dimme2", "2 Dimme");
          }
        } else {
          customAlert("Adding 2 Module item is not possible!");
        }
      }

      if ($(this).attr("title") == "A-C-usb") {
        if (boxSize >= 2) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 2) {
              usbACbox1(
                2,
                ".sub-module-th",
                box1lis,
                "usbAC",
                "A-C USB"
              );
            } else if (6 >= box2Capacity + 2) {
              usbACbox2(
                2,
                ".sub-module-fi",
                box2lis,
                "usbAC",
                "A-C USB"
              );
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            usbAC(2, "usbAC", "A-C USB");
          }
        } else {
          customAlert("Adding 2 Module item is not possible!");
        }
      }

      if ($(this).attr("title") == "Scene4") {
        if (boxSize >= 2) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 2) {
              scene4box1(
                2,
                ".sub-module-th",
                box1lis,
                "scene4",
                "4 Scene Controller"
              );
            } else if (6 >= box2Capacity + 2) {
              scene4box2(
                2,
                ".sub-module-fi",
                box2lis,
                "scene4",
                "4 Scene Controller"
              );
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            scene4(2, "scene4", "4 Scene Controller");
          }
        } else {
          customAlert("Adding 2 Module item is not possible!");
        }
      }

      if ($(this).attr("title") == "Switch4") {
        if (boxSize >= 4) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 4) {
              // box1mod12(4, ".sub-module-th", box1lis, "switch4", "4 Switch");
              switch4box1(4, ".sub-module-th", box1lis, "switch4", "4 Switch");
            } else if (6 >= box2Capacity + 4) {
              // box1mod21(4, ".sub-module-fi", box2lis, "switch4", "4 Switch");
              switch4box2(4, ".sub-module-fi", box2lis, "switch4", "4 Switch");
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            boxSize -= 4;
            switch4(n);
            customerRequirement["sub-element-" + n] = 4;
            n++;
            allData["Accessories-" + obj] = "4 Switch";
            obj++;
          }
        } else {
          customAlert("Adding 4 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "Switch4-fan1") {
        if (boxSize >= 4) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 4) {
              switch4fan1box1(
                4,
                ".sub-module-th",
                box1lis,
                "switch4fan1",
                "4 Switch + 1 fan"
              );
            } else if (6 >= box2Capacity + 4) {
              switch4fan1box2(
                4,
                ".sub-module-fi",
                box2lis,
                "switch4fan1",
                "4 Switch + 1 fan"
              );
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            // box2modAll(4, "Switch4-fan1", "4 Switch + 1 fan");
            boxSize -= 4;
            Switch4fan1(n);
            customerRequirement["sub-element-" + n] = 4;
            n++;
            allData["Accessories-" + obj] = "4 Switch + 1 Fan";
            obj++;
          }
        } else {
          customAlert("Adding 4 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "Switch6") {
        if (boxSize >= 4) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 4) {
              // box1mod12(4, ".sub-module-th", box1lis, "Switch6", "6 Switch");
              switch6box1(4, ".sub-module-th", box1lis, "switch6", "6 Switch");
            } else if (6 >= box2Capacity + 4) {
              switch6box2(4, ".sub-module-fi", box2lis, "switch6", "6 Switch");
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            // box2modAll(4, "Switch6", "6 Switch");
            boxSize -= 4;
            switch6(n);
            customerRequirement["sub-element-" + n] = 4;
            n++;
            allData["Accessories-" + obj] = "6 Switch";
            obj++;
          }
        } else {
          customAlert("Adding 4 Module item is not possible!");
        }
      }
      if ($(this).attr("title") == "switch8") {
        if (boxSize >= 6) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 6) {
              // box1mod12(6, ".sub-module-th", box1lis, "switch8", "8 Switch");
              switch8box1(6, ".sub-module-th", box1lis, "switch8", "8 Switch");
            } else if (6 >= box2Capacity + 6) {
              // box1mod21(6, ".sub-module-fi", box2lis, "switch8", "8 Switch");
              switch8box2(6, ".sub-module-fi", box2lis, "switch8", "8 Switch");
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            // box2modAll(6, "switch8", "8 Switch");
            boxSize -= 6;
            switch8(n);
            customerRequirement["sub-element-" + n] = 6;
            n++;
            allData["Accessories-" + obj] = "8 Switch";
            obj++;
          }
        } else {
          customAlert("Adding 6 Module item is not possible!");
        }
      }

      if ($(this).attr("title") == "switch10") {
        if (boxSize == 8) {
          if (mod == 12) {
            if (boxSize > 8 && 8 >= box1Capacity + 8) {
              // box1mod12(6, ".sub-module-th", box1lis, "switch8", "8 Switch");
              switch10box1(8, ".sub-module-th", box1lis, "switch10", "10 Switch");
            } else if (8 >= box2Capacity + 8) {
              // box1mod21(6, ".sub-module-fi", box2lis, "switch8", "8 Switch");
              switch10box2(8, ".sub-module-fi", box2lis, "switch10", "10 Switch");
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            // box2modAll(6, "switch8", "8 Switch");
            boxSize -= 8;
            switch10(n);
            customerRequirement["sub-element-" + n] = 8;
            n++;
            allData["Accessories-" + obj] = "10 Switch";
            obj++;
          }
        } else {
          customAlert("10 Swtich only supports in 8 module!");
        }
      }


      if ($(this).attr("title") == "switch4-fan2") {
        if (boxSize >= 6) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 6) {
              switch4fan2box1(
                6,
                ".sub-module-th",
                box1lis,
                "switch4fan2",
                "4 Switch + 2 fan"
              );
            } else if (6 >= box2Capacity + 6) {
              switch4fan2box2(
                6,
                ".sub-module-fi",
                box2lis,
                "switch4fan2",
                "4 Switch + 2 fan"
              );
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            boxSize -= 6;
            Switch4fan2(n);
            customerRequirement["sub-element-" + n] = 6;
            n++;
            allData["Accessories-" + obj] = "6 Switch + 1 Fan";
            obj++;
          }
        } else {
          customAlert("Adding 6 Module item is not possible!");
        }
      }


      if ($(this).attr("title") == "switch6-fan1") {
        if (boxSize >= 6) {
          if (mod == 12) {
            if (boxSize > 6 && 6 >= box1Capacity + 6) {
              switch6fan1box1(
                6,
                ".sub-module-th",
                box1lis,
                "switch6fan1",
                "6 Switch + 1 fan"
              );
            } else if (6 >= box2Capacity + 6) {
              switch6fan1box2(
                6,
                ".sub-module-fi",
                box2lis,
                "switch6fan1",
                "6 Switch + 1 fan"
              );
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            // box2modAll(6, "switch6-fan1", "6 Switch + 1 fan");
            boxSize -= 6;
            Switch6fan1(n);
            customerRequirement["sub-element-" + n] = 6;
            n++;
            allData["Accessories-" + obj] = "6 Switch + 1 Fan";
            obj++;
          }
        } else {
          customAlert("Adding 6 Module item is not possible!");
        }
      }


      if ($(this).attr("title") == "switch6-fan2") {
        if (boxSize == 8) {
          if (mod == 12) {
            if (boxSize > 8 && 8 >= box1Capacity + 8) {
              switch6fan2box1(
                8,
                ".sub-module-th",
                box1lis,
                "switch6fan2",
                "6 Switch + 2 fan"
              );
            } else if (8 >= box2Capacity + 8) {
              switch6fan2box2(
                8,
                ".sub-module-fi",
                box2lis,
                "switch6fan2",
                "6 Switch + 2 fan"
              );
            } else {
              customAlert("No Space availabe!");
            }
          } else {
            // box2modAll(6, "switch6-fan1", "6 Switch + 1 fan");
            boxSize -= 8;
            Switch6fan2(n);
            customerRequirement["sub-element-" + n] = 8;
            n++;
            allData["Accessories-" + obj] = "6 Switch + 2 Fan";
            obj++;
          }
        } else {
          customAlert("This item is only supported in 8 Module size!");
        }
      }
    } else {
      customAlert("You can not add more accessories...");
    }
  });

  $("body").on("click", ".close", function () {
    if ($(this).attr("title") == "ele1") {
      if (mod == 12) {
        $(".sub-element-1").addClass("hide");
        var num1 = getObjectValue(box1lis, "sub-element-1");

        if (num1 != null) {
          box1(num1, "Accessories-1");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-1");
          box2(num2, "Accessories-1");
        }
      } else {
        $(".sub-element-1").addClass("hide");
        var num = getObjectValue(customerRequirement, "sub-element-1");
        otherBox(num, "Accessories-1");
      }
    }
    if ($(this).attr("title") == "ele2") {
      if (mod == 12) {
        $(".sub-element-2").addClass("hide");
        var num1 = getObjectValue(box1lis, "sub-element-2");
        if (num1 != null) {
          box1(num1, "Accessories-2");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-2");
          box2(num2, "Accessories-2");
        }
      } else {
        $(".sub-element-2").addClass("hide");
        var num = getObjectValue(customerRequirement, "sub-element-2");
        otherBox(num, "Accessories-2");
      }
    }
    if ($(this).attr("title") == "ele3") {
      if (mod == 12) {
        $(".sub-element-3").addClass("hide");
        var num1 = getObjectValue(box1lis, "sub-element-3");
        if (num1 != null) {
          box1(num1, "Accessories-3");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-3");
          box2(num2, "Accessories-3");
        }
      } else {
        $(".sub-element-3").addClass("hide");
        var num = getObjectValue(customerRequirement, "sub-element-3");
        otherBox(num, "Accessories-3");
      }
    }
    if ($(this).attr("title") == "ele4") {
      if (mod == 12) {
        $(".sub-element-4").addClass("hide");
        var num1 = getObjectValue(box1lis, "sub-element-4");
        if (num1 != null) {
          box1(num1, "Accessories-4");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-4");
          box2(num2, "Accessories-4");
        }
      } else {
        $(".sub-element-4").addClass("hide");
        var num = getObjectValue(customerRequirement, "sub-element-4");
        otherBox(num, "Accessories-4");
      }
    }
    if ($(this).attr("title") == "ele5") {
      if (mod == 12) {
        $(".sub-element-5").addClass("hide");
        var num1 = getObjectValue(box1lis, "sub-element-5");
        if (num1 != null) {
          box1(num1, "Accessories-5");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-5");
          box2(num2, "Accessories-5");
        }
      } else {
        $(".sub-element-5").addClass("hide");
        var num = getObjectValue(customerRequirement, "sub-element-5");
        otherBox(num, "Accessories-5");
      }
    }
    if ($(this).attr("title") == "ele6") {
      if (mod == 12) {
        $(".sub-element-6").addClass("hide");
        var num1 = getObjectValue(box1lis, "sub-element-6");
        if (num1 != null) {
          box1(num1, "Accessories-6");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-6");
          box2(num2, "Accessories-6");
        }
      } else {
        $(".sub-element-6").addClass("hide");
        var num = getObjectValue(customerRequirement, "sub-element-6");
        otherBox(num, "Accessories-6");
      }
    }
    if ($(this).attr("title") == "ele7") {
      if (mod == 12) {
        $(".sub-element-7").addClass("hide");
        var num1 = getObjectValue(box1lis, "sub-element-7");
        if (num1 != null) {
          box1(num1, "Accessories-7");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-7");
          box2(num2, "Accessories-7");
        }
      } else {
        $(".sub-element-7").addClass("hide");
        var num = getObjectValue(customerRequirement, "sub-element-7");
        otherBox(num, "Accessories-7");
      }
    }
    if ($(this).attr("title") == "ele8") {
      if (mod == 12) {
        $(".sub-element-8").addClass("hide");
        var num1 = getObjectValue(box1lis, "sub-element-8");
        if (num1 != null) {
          box1(num1, "Accessories-8");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-8");
          box2(num2, "Accessories-8");
        }
      } else {
        $(".sub-element-8").addClass("hide");
        var num = getObjectValue(customerRequirement, "sub-element-8");
        otherBox(num, "Accessories-8");
      }
    }
    if ($(this).attr("title") == "ele9") {
      $(".sub-element-9").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-9");
        if (num1 != null) {
          box1(num1, "Accessories-9");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-9");
          box2(num2, "Accessories-9");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-9");
        otherBox(num, "Accessories-9");
      }
    }
    if ($(this).attr("title") == "ele10") {
      $(".sub-element-10").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-10");
        if (num1 != null) {
          box1(num1, "Accessories-10");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-10");
          box2(num2, "Accessories-10");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-10");
        otherBox(num, "Accessories-10");
      }
    }
    if ($(this).attr("title") == "ele11") {
      $(".sub-element-11").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-11");
        if (num1 != null) {
          box1(num1, "Accessories-11");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-11");
          box2(num2, "Accessories-11");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-11");
        otherBox(num, "Accessories-11");
      }
    }
    if ($(this).attr("title") == "ele12") {
      $(".sub-element-12").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-12");
        if (num1 != null) {
          box1(num1, "Accessories-12");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-12");
          box2(num2, "Accessories-12");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-12");
        otherBox(num, "Accessories-12");
      }
    }
    if ($(this).attr("title") == "ele13") {
      $(".sub-element-13").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-13");
        if (num1 != null) {
          box1(num1, "Accessories-13");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-13");
          box2(num2, "Accessories-13");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-13");
        otherBox(num, "Accessories-13");
      }
    }
    if ($(this).attr("title") == "ele14") {
      $(".sub-element-14").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-14");
        if (num1 != null) {
          box1(num1, "Accessories-14");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-14");
          box2(num2, "Accessories-14");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-14");
        otherBox(num, "Accessories-14");
      }
    }
    if ($(this).attr("title") == "ele15") {
      $(".sub-element-15").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-15");
        if (num1 != null) {
          box1(num1, "Accessories-15");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-15");
          box2(num2, "Accessories-15");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-15");
        otherBox(num, "Accessories-15");
      }
    }
    if ($(this).attr("title") == "ele16") {
      $(".sub-element-16").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-16");
        if (num1 != null) {
          box1(num1, "Accessories-16");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-16");
          box2(num2, "Accessories-16");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-16");
        otherBox(num, "Accessories-16");
      }
    }
    if ($(this).attr("title") == "ele17") {
      $(".sub-element-17").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-17");
        if (num1 != null) {
          box1(num1, "Accessories-17");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-17");
          box2(num2, "Accessories-17");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-17");
        otherBox(num, "Accessories-17");
      }
    }
    if ($(this).attr("title") == "ele18") {
      $(".sub-element-18").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-18");
        if (num1 != null) {
          box1(num1, "Accessories-18");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-18");
          box2(num2, "Accessories-18");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-18");
        otherBox(num, "Accessories-18");
      }
    }
    if ($(this).attr("title") == "ele19") {
      $(".sub-element-19").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-19");
        if (num1 != null) {
          box1(num1, "Accessories-19");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-19");
          box2(num2, "Accessories-19");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-19");
        otherBox(num, "Accessories-19");
      }
    }
    if ($(this).attr("title") == "ele20") {
      $(".sub-element-20").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-20");
        if (num1 != null) {
          box1(num1, "Accessories-20");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-20");
          box2(num2, "Accessories-20");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-20");
        otherBox(num, "Accessories-20");
      }
    }
    if ($(this).attr("title") == "ele21") {
      $(".sub-element-21").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-21");
        if (num1 != null) {
          box1(num1, "Accessories-21");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-21");
          box2(num2, "Accessories-21");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-21");
        otherBox(num, "Accessories-21");
      }
    }
    if ($(this).attr("title") == "ele22") {
      $(".sub-element-22").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-22");
        if (num1 != null) {
          box1(num1, "Accessories-22");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-22");
          box2(num2, "Accessories-22");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-22");
        otherBox(num, "Accessories-22");
      }
      customAlert(
        "You have exceded maximum number of attempts! Please Start from selecting Material Again..."
      );
    }
    if ($(this).attr("title") == "ele23") {
      $(".sub-element-23").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-23");
        if (num1 != null) {
          box1(num1, "Accessories-23");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-23");
          box2(num2, "Accessories-23");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-23");
        otherBox(num, "Accessories-23");
      }
      customAlert(
        "You have exceded maximum number of attempts! Please Start from selecting Material Again..."
      );
    }
    if ($(this).attr("title") == "ele24") {
      $(".sub-element-24").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-24");
        if (num1 != null) {
          box1(num1, "Accessories-24");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-24");
          box2(num2, "Accessories-24");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-24");
        otherBox(num, "Accessories-24");
      }
      customAlert(
        "You have exceded maximum number of attempts! Please Start from selecting Material Again..."
      );
    }
    if ($(this).attr("title") == "ele25") {
      $(".sub-element-25").addClass("hide");
      if (mod == 12) {
        var num1 = getObjectValue(box1lis, "sub-element-25");
        if (num1 != null) {
          box1(num1, "Accessories-25");
        } else {
          var num2 = getObjectValue(box2lis, "sub-element-25");
          box2(num2, "Accessories-25");
        }
      } else {
        var num = getObjectValue(customerRequirement, "sub-element-25");
        otherBox(num, "Accessories-25");
      }
      customAlert(
        "You have exceded maximum number of attempts! Please Start from selecting Material Again..."
      );
    }
  });

  $("body").on("click", ".closetwo", function () {
    var a = $(this).attr("title").split(",");
    $("div.sub-element-" + a[0] + ">div.sw-ele-" + a[1]).html("");
    $("div.sub-element-" + a[0] + ">div.sw-ele-" + a[1]).html(
      '<button type="button" class="closetwo" title="' +
      a +
      '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>'
    );
    $(".closetwo").addClass("show");
    const droppableElementData = $(
      "div.sub-element-" + a[0] + ">div.sw-ele-" + a[1]
    ).attr("data-droppable-class");
    if (
      design == "color" ||
      droppableElementData === "fan" ||
      droppableElementData === "dimmer"
    ) {
      $("div.sub-element-" + a[0] + ">div.sw-ele-" + a[1]).removeClass(
        "backgroundNone"
      );
      $("div.sub-element-" + a[0] + ">div.sw-ele-" + a[1]).addClass(
        "switch2Image"
      );
      $("div.sub-element-" + a[0] + ">div.sw-ele-" + a[1]).removeAttr("style");
    } else {
      $("div.sub-element-" + a[0] + ">div.sw-ele-" + a[1]).removeClass(
        "hiden-border"
      );
    }
  });
  $("body").on("click", ".closethree", function () {
    var a = $(this).attr("title").split(",");
    $("div.sub-element-" + a[0] + ">div.sw-ele-" + a[1]).html("");
    $("div.sub-element-" + a[0] + ">div.sw-ele-" + a[1]).html(
      '<button type="button" class="closethree" title="' +
      a +
      '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>'
    );
    $(".closethree").addClass("show");
    $("div.sub-element-" + a[0] + ">div.sw-ele-" + a[1]).removeClass(
      "hiden-border"
    );
  });

  $(".rmenu-item-glass").click(function () {
    $(".module").removeClass("module-black");
    $(".module").removeClass("module-white");
    $(".module").removeClass("module-gray");
    $(".module").removeClass("module-RoyalBlue");
    $(".module").removeClass("module-Gold");
    $(".module").removeClass("module-LightGray");
    if ($(this).attr('title') == "black") {
      $(".module").addClass("module-black");
      allData[glassName] = "Black";
    }
    if ($(this).attr('title') == "white") {
      $(".module").addClass("module-white");
      allData[glassName] = "White";
    }
    if ($(this).attr('title') == "gray") {
      $(".module").addClass("module-gray");
      allData[glassName] = "Gray";
    }
    if ($(this).attr('title') == "RoyalBlue") {
      $(".module").addClass("module-RoyalBlue");
      allData[glassName] = "Royal Blue";
    }
    if ($(this).attr('title') == "Gold") {
      $(".module").addClass("module-Gold");
      allData[glassName] = "Gold";
    }
    if ($(this).attr('title') == "LightGray") {
      $(".module").addClass("module-LightGray");
      allData[glassName] = "Light Gray";
    }
  });

  $(".rmenu-item-frame").click(function () {
    $(".module").removeClass("module-fsblack");
    $(".module").removeClass("module-fgold");
    $(".module").removeClass("module-fgray");
    $(".module").removeClass("module-fRosegold");
    $(".module").removeClass("module-fChrome");
    $(".module").removeClass("module-fsilver");
    if ($(this).attr('title') == "black") {
      $(".module").addClass("module-fsblack");
      allData.frame = "Black";
    }
    if ($(this).attr('title') == "gold") {
      $(".module").addClass("module-fgold");
      allData.frame = "Gold";
    }
    if ($(this).attr('title') == "gray") {
      $(".module").addClass("module-fgray");
      allData.frame = "Gray";
    }
    if ($(this).attr('title') == "Rosegold") {
      $(".module").addClass("module-fRosegold");
      allData.frame = "Rose gold";
    }
    if ($(this).attr('title') == "chrome") {
      $(".module").addClass("module-fChrome");
      allData.frame = "Chrome";
    }
    if ($(this).attr('title') == "Silver") {
      $(".module").addClass("module-fsilver");
      allData.frame = "Silver";
    }
  });

  function incrementValue(e) {
    e.preventDefault();
    var fieldName = $(e.target).data("field");
    var parent = $(e.target).closest("div");
    var currentVal = parseInt(
      parent.find("input[name=" + fieldName + "]").val(),
      10
    );

    if (!isNaN(currentVal)) {
      parent.find("input[name=" + fieldName + "]").val(currentVal + 1);
    } else {
      parent.find("input[name=" + fieldName + "]").val(0);
    }
  }

  function decrementValue(e) {
    e.preventDefault();
    var fieldName = $(e.target).data("field");
    var parent = $(e.target).closest("div");
    var currentVal = parseInt(
      parent.find("input[name=" + fieldName + "]").val(),
      10
    );

    if (!isNaN(currentVal) && currentVal > 0) {
      parent.find("input[name=" + fieldName + "]").val(currentVal - 1);
    } else {
      parent.find("input[name=" + fieldName + "]").val(0);
    }
  }

  $(".input-group").on("click", ".button-plus", function (e) {
    incrementValue(e);
  });

  $(".input-group").on("click", ".button-minus", function (e) {
    decrementValue(e);
  });
});

function closebtn(p) {
  $(".sub-element-" + p).append(
    '<button type="button" class="close" title="' +
    "ele" +
    p +
    '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>'
  );
}
function closetwo(n, m, closeClass) {
  $("div.sub-element-" + n + ">div.sw-ele-" + m).append(
    '<button type="button" class=" ' +
    closeClass +
    '"title="' +
    n +
    "," +
    m +
    '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>'
  );
}
function getObjectValue(obj, key) {
  return Object.values(obj).find((value) => obj[key] === value);
}
function customAlert(note) {
  var al = document.getElementById("alertBoxContainer");
  al.style.display = "grid";
  var ele = document.getElementById("text");
  ele.innerText = note;
}
function cancelAlert() {
  var al = document.getElementById("alertBoxContainer");
  al.style.display = "none";
}
// function to generate table
function loadData(allData) {
  const ifd = document.getElementById("iframe-download");
  const iframedocument = ifd.contentDocument;
  const tableBody = iframedocument.getElementById("tableData");
  let dataHtml = "";
  for (const key in allData) {
    dataHtml += `<tr><td>${key}</td><td>${allData[key]}</td></tr>`;
  }
  tableBody.innerHTML = dataHtml;
}
// function of 12 module and box 1
function box1mod12(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box1Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}

// function of 12 module and box 2
function box1mod21(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box2Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}

function box2modAll(bsize, addcls, dataName) {
  boxSize -= bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(".sub-module").append(node);
  node.classList.add(addcls);
  closebtn(n);
  customerRequirement["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}

function box1(cap, accessoriesName) {
  box1Capacity -= cap;
  boxSize += cap;
  allData[accessoriesName] = "0";
}
function box2(cap, accessoriesName) {
  box2Capacity -= cap;
  boxSize += cap;
  allData[accessoriesName] = "0";
}
function otherBox(cap, accessoriesName) {
  boxSize += cap;
  allData[accessoriesName] = "0";
}

/////////            functions for custom images
function switch2(bsize, addcls, dataName) {
  boxSize -= bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(".sub-module").append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch2-2 switch2-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch2-2 switch2-d sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(2);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closebtn(n);
  customerRequirement["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function switch2box1(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box1Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch2-2 switch2-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch2-2 switch2-d sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(2);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function switch2box2(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box2Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch2-2 switch2-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch2-2 switch2-d sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(2);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}

function dimme2(bsize, addcls, dataName) {
  boxSize -= bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(".sub-module").append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="dimmeIncr dimme2box1-1"></div><div class="dimmeIncr dimme2box1-2"></div><div class="dimmeDecr dimme2box1-3"></div><div class="dimmeDecr dimme2box1-4"></div>'
  );

  closebtn(n);
  customerRequirement["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function dimme2box1(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box1Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="dimmeIncr dimme2box1-1"></div><div class="dimmeIncr dimme2box1-2"></div><div class="dimmeDecr dimme2box1-3"></div><div class="dimmeDecr dimme2box1-4"></div>'
  );

  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function dimme2box2(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box2Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="dimmeIncr dimme2box1-1"></div><div class="dimmeIncr dimme2box1-2"></div><div class="dimmeDecr dimme2box1-3"></div><div class="dimmeDecr dimme2box1-4"></div>'
  );

  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}

function usbAC(bsize, addcls, dataName) {
  boxSize -= bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(".sub-module").append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="indicator sw-ele-1"></div><div class="indicator sw-ele-2"></div><div class="a-pin sw-ele-3"></div><div class="c-pin sw-ele-4"></div><div class="type-b sw-ele-5"></div><div class="type-c sw-ele-6"></div>'
  );

  closebtn(n);
  customerRequirement["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function usbACbox1(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box1Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="indicator sw-ele-1"></div><div class="indicator sw-ele-2"></div><div class="a-pin sw-ele-3"></div><div class="c-pin sw-ele-4"></div><div class="type-b sw-ele-5"></div><div class="type-c sw-ele-6"></div>'
  );

  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function usbACbox2(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box2Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="indicator sw-ele-1"></div><div class="indicator sw-ele-2"></div><div class="a-pin sw-ele-3"></div><div class="c-pin sw-ele-4"></div><div class="type-b sw-ele-5"></div><div class="type-c sw-ele-6"></div>'
  );

  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}

function scene4(bsize, addcls, dataName) {
  boxSize -= bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(".sub-module").append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="sceneController switch2-2 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="sceneController sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="sceneController sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="sceneController sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div>'
  );

  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closebtn(n);

  customerRequirement["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function scene4box1(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box1Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="sceneController switch2-2 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="sceneController sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="sceneController sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="sceneController sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div>'
  );

  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closebtn(n);

  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function scene4box2(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box2Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="sceneController switch2-2 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="sceneController sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="sceneController sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="sceneController sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div>'
  );

  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closebtn(n);

  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}

function switch4(n) {
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(".sub-module").append(node);
  node.classList.add("switch4");
  $(".sub-element-" + n).html(
    '<div class="switch2 switch4-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch4-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch4-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch4-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(4);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closebtn(n);
}
function switch4box1(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box1Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch4-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch4-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch4-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch4-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(4);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function switch4box2(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box2Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch4-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch4-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch4-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch4-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(4);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}

function switch6(n) {
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(".sub-module").append(node);
  node.classList.add("switch6");
  $(".sub-element-" + n).html(
    '<div class="switch2 switch6-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div></div><div class="switch2 switch6-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(6);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closebtn(n);
}
function switch6box1(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box1Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  // $(".sub-module").append(node);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch6-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div></div><div class="switch2 switch6-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(6);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");

  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function switch6box2(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box2Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch6-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div></div><div class="switch2 switch6-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(6);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function switch8(n) {
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(".sub-module").append(node);
  node.classList.add("switch8");
  $(".sub-element-" + n).html(
    '<div class="switch2 switch8-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div></div><div class="switch2 switch8-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-7 sw-ele-7" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-8 sw-ele-8" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(8);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closetwo");
  closebtn(n);
}
function switch8box1(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box1Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch8-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div></div><div class="switch2 switch8-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-7 sw-ele-7" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-8 sw-ele-8" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(8);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closetwo");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function switch8box2(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box2Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  // $(".sub-module").append(node);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch8-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div></div><div class="switch2 switch8-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-7 sw-ele-7" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch8-8 sw-ele-8" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(8);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closetwo");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}

function switch10(n) {
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(".sub-module").append(node);
  node.classList.add("switch10");
  $(".sub-element-" + n).html(
    '<div class="switch2 switch10-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div></div><div class="switch2 switch10-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-7 sw-ele-7" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-8 sw-ele-8" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-9 sw-ele-9" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-10 sw-ele-10" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(10);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closetwo");
  closetwo(n, 9, "closetwo");
  closetwo(n, 10, "closetwo");
  closebtn(n);
}
function switch10box1(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  console.log('boxSize:', boxSize)
  box1Capacity += bsize;
  console.log('box1Capacity:', box1Capacity)
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch10-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div></div><div class="switch2 switch10-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-7 sw-ele-7" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-8 sw-ele-8" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-9 sw-ele-9" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-10 sw-ele-10" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(10);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closetwo");
  closetwo(n, 9, "closetwo");
  closetwo(n, 10, "closetwo");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function switch10box2(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box2Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  // $(".sub-module").append(node);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch10-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div></div><div class="switch2 switch10-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-7 sw-ele-7" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-8 sw-ele-8" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-9 sw-ele-9" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch10-10 sw-ele-10" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div>'
  );
  if (design === "color") {
    designColorDefaul(10);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closetwo");
  closetwo(n, 9, "closetwo");
  closetwo(n, 10, "closetwo");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}


function Switch4fan1(n) {
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(".sub-module").append(node);
  node.classList.add("switch4fan1");
  $(".sub-element-" + n).html(
    '<div class="switch2 switch4fan1-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan1-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan1-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan1-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan1-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="fan"></div><div class="fan switch4fan1-6 sw-ele-6 hiden-border" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer" ></div>'
  );
  if (design === "color") {
    designColorDefault(6);
  } else {
    designEdgeDefault(6);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closethree");

  closebtn(n);
}
function switch4fan1box1(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box1Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch4fan1-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan1-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan1-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan1-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan1-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="fan"></div><div class="fan switch4fan1-6 sw-ele-6 hiden-border" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div>'
  );
  if (design === "color") {
    designColorDefault(6);
  } else {
    designEdgeDefault(6);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closethree");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function switch4fan1box2(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box2Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch4fan1-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan1-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan1-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan1-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan1-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="fan"></div><div class="fan switch4fan1-6 sw-ele-6 hiden-border" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div>'
  );
  if (design === "color") {
    designColorDefault(6);
  } else {
    designEdgeDefault(6);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closethree");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}

function Switch4fan2(n) {
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(".sub-module").append(node);
  node.classList.add("switch4fan2");
  $(".sub-element-" + n).html(
    '<div class="fan switch4fan2-1 sw-ele-1 hiden-border switch2ImageDimmer" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div><div class="switch4fan2-2 sw-ele-2 switch2ImageFan" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="switch2 switch4fan2-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan2-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan2-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan2-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch4fan2-7 sw-ele-7 switch2ImageFan" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="fan switch4fan2-8 sw-ele-8 hiden-border switch2ImageDimmer" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div>'
  );

  if (design === "color") {
    designColorDefault(8);
  } else {
    designEdgeDefault(8);
  }

  closetwo(n, 1, "closethree");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closethree");
  closebtn(n);
}
function switch4fan2box1(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box1Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="fan switch4fan2-1 sw-ele-1 hiden-border switch2ImageDimmer" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div><div class="switch4fan2-2 sw-ele-2 switch2ImageFan" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="switch2 switch4fan2-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan2-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan2-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan2-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch4fan2-7 sw-ele-7 switch2ImageFan" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="fan switch4fan2-8 sw-ele-8 hiden-border switch2ImageDimmer" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div>'
  );

  if (design === "color") {
    designColorDefault(8);
  } else {
    designEdgeDefault(8);
  }

  closetwo(n, 1, "closethree");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closethree");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function switch4fan2box2(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box2Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="fan switch4fan2-1 sw-ele-1 hiden-border switch2ImageDimmer" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div><div class="switch4fan2-2 sw-ele-2 switch2ImageFan" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="switch2 switch4fan2-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan2-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan2-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch4fan2-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch4fan2-7 sw-ele-7 switch2ImageFan" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="fan switch4fan2-8 sw-ele-8 hiden-border switch2ImageDimmer" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div>'
  );

  if (design === "color") {
    designColorDefault(8);
  } else {
    designEdgeDefault(8);
  }

  closetwo(n, 1, "closethree");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closethree");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}

function Switch6fan1(n) {
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(".sub-module").append(node);
  node.classList.add("switch6fan1");
  $(".sub-element-" + n).html(
    '<div class="switch2 switch6fan1-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan1-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan1-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan1-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan1-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan1-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan1-7 sw-ele-7" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="fan switch6fan1-8 sw-ele-8 hiden-border" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div>'
  );
  if (design === "color") {
    designColorDefault(8);
  } else {
    designEdgeDefault(8);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closethree");
  closebtn(n);
}
function switch6fan1box1(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box1Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch6fan1-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan1-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan1-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan1-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan1-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan1-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan1-7 sw-ele-7" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="fan switch6fan1-8 sw-ele-8 hiden-border" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div>'
  );
  if (design === "color") {
    designColorDefault(8);
  } else {
    designEdgeDefault(8);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closethree");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function switch6fan1box2(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box2Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="switch2 switch6fan1-1 sw-ele-1" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan1-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan1-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan1-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan1-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan1-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan1-7 sw-ele-7" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="fan switch6fan1-8 sw-ele-8 hiden-border" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div>'
  );
  if (design === "color") {
    designColorDefault(8);
  } else {
    designEdgeDefault(8);
  }
  closetwo(n, 1, "closetwo");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closethree");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}

function Switch6fan2(n) {
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(".sub-module").append(node);
  node.classList.add("switch6fan2");
  $(".sub-element-" + n).html(
    '<div class="fan switch6fan2-1 sw-ele-1 hiden-border switch2ImageDimmer" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div> <div class="switch6fan2-2 sw-ele-2 switch2ImageFan" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="switch2 switch6fan2-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan2-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan2-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan2-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan2-7 sw-ele-7" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan2-8 sw-ele-8" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch6fan2-9 sw-ele-9 switch2ImageFan" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="fan switch6fan2-10 sw-ele-10 hiden-border switch2ImageDimmer" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div>'
  );
  if (design === "color") {
    designColorDefault(10);
  } else {
    designEdgeDefault(10);
  }
  closetwo(n, 1, "closethree");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closetwo");
  closetwo(n, 9, "closetwo");
  closetwo(n, 10, "closethree");
  closebtn(n);
}
function switch6fan2box1(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box1Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="fan switch6fan2-1 sw-ele-1 hiden-border switch2ImageDimmer" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div> <div class="switch2 switch6fan2-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="switch2 switch6fan2-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan2-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan2-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan2-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan2-7 sw-ele-7" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan2-8 sw-ele-8" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan2-9 sw-ele-9" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="fan switch6fan2-10 sw-ele-10 hiden-border switch2ImageDimmer" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div>'
  );
  if (design === "color") {
    designColorDefault(10);
  } else {
    designEdgeDefault(10);
  }
  closetwo(n, 1, "closethree");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closetwo");
  closetwo(n, 9, "closetwo");
  closetwo(n, 10, "closethree");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}
function switch6fan2box2(bsize, mod12Name, boxlis, addcls, dataName) {
  boxSize -= bsize;
  box2Capacity += bsize;
  const node = document.createElement("div");
  node.classList.add("sub-element-" + n);
  $(mod12Name).append(node);
  node.classList.add(addcls);
  $(".sub-element-" + n).html(
    '<div class="fan switch6fan2-1 sw-ele-1 hiden-border switch2ImageDimmer" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div> <div class="switch2 switch6fan2-2 sw-ele-2" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="switch2 switch6fan2-3 sw-ele-3" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan2-4 sw-ele-4" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan2-5 sw-ele-5" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="switch"></div><div class="switch2 switch6fan2-6 sw-ele-6" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan2-7 sw-ele-7" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan2-8 sw-ele-8" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="switch"></div><div class="switch2 switch6fan2-9 sw-ele-9" ondrop="drop(event)"ondragover="allowDrop(event)"data-droppable-class="fan"></div><div class="fan switch6fan2-10 sw-ele-10 hiden-border switch2ImageDimmer" ondrop="drop(event)"ondragover="allowDrop(event)" data-droppable-class="dimmer"></div>'
  );
  if (design === "color") {
    designColorDefault(10);
  } else {
    designEdgeDefault(10);
  }
  closetwo(n, 1, "closethree");
  closetwo(n, 2, "closetwo");
  closetwo(n, 3, "closetwo");
  closetwo(n, 4, "closetwo");
  closetwo(n, 5, "closetwo");
  closetwo(n, 6, "closetwo");
  closetwo(n, 7, "closetwo");
  closetwo(n, 8, "closetwo");
  closetwo(n, 9, "closetwo");
  closetwo(n, 10, "closethree");
  closebtn(n);
  boxlis["sub-element-" + n] = bsize;
  n++;
  allData["Accessories-" + obj] = dataName;
  obj++;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var nodeCopy = document.getElementById(data).cloneNode(true);
  nodeCopy.id = "newId";

  const droppableElementData = ev.target.getAttribute("data-droppable-class");
  const draggableElementData = document
    .getElementById(data)
    .getAttribute("data-draggable-class");

  if (
    design == "color" ||
    droppableElementData === "fan" ||
    droppableElementData === "dimmer"
  ) {
    if (droppableElementData === draggableElementData) {
      const image = $(nodeCopy)[0].src;
      ev.target.classList.remove("switch2Image");
      ev.target.classList.add("backgroundNone");
      $(ev.target).css("backgroundImage", "url(" + image + ")");
    }
  } else {
    if (droppableElementData === draggableElementData) {
      ev.target.appendChild(nodeCopy);
      ev.target.classList.add("hiden-border");
    }
  }
}

function designColorDefault(k) {
  for (let i = 1; k >= i; i++) {
    if (i == k - 1) {
      $("div.sub-element-" + n + ">div.sw-ele-" + i).removeClass("switch2");
      $("div.sub-element-" + n + ">div.sw-ele-" + i).addClass(
        "switch2ImageFan"
      );
    } else if (i == k) {
      $("div.sub-element-" + n + ">div.sw-ele-" + i).removeClass("switch2");
      $("div.sub-element-" + n + ">div.sw-ele-" + i).addClass(
        "switch2ImageDimmer"
      );
    } else {
      $("div.sub-element-" + n + ">div.sw-ele-" + i).removeClass("switch2");
      $("div.sub-element-" + n + ">div.sw-ele-" + i).addClass("switch2Image");
    }
  }
}
function designColorDefaul(k) {
  for (let i = 1; k >= i; i++) {
    $("div.sub-element-" + n + ">div.sw-ele-" + i).removeClass("switch2");
    $("div.sub-element-" + n + ">div.sw-ele-" + i).addClass("switch2Image");
  }
}
function designEdgeDefault(k) {
  for (let i = 1; k >= i; i++) {
    if (i == k - 1) {
      $("div.sub-element-" + n + ">div.sw-ele-" + i).removeClass("switch2");
      $("div.sub-element-" + n + ">div.sw-ele-" + i).addClass(
        "switch2ImageFan"
      );
    } else if (i == k) {
      $("div.sub-element-" + n + ">div.sw-ele-" + i).removeClass("switch2");
      $("div.sub-element-" + n + ">div.sw-ele-" + i).addClass(
        "switch2ImageDimmer"
      );
    }
  }
}
