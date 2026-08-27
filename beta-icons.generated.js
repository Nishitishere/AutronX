(function () {
  const betaIconGroups = {
    "BLDC Fan":  {
                     "draggableClass":  "switch",
                     "icons":  [
                                   "./icon/Icons80x80px/BLDC/2.svg",
                                   "./icon/Icons80x80px/BLDC/3.svg",
                                   "./icon/Icons80x80px/BLDC/4.svg",
                                   "./icon/Icons80x80px/BLDC/5.svg",
                                   "./icon/Icons80x80px/BLDC/6.svg",
                                   "./icon/Icons80x80px/BLDC/7.svg",
                                   "./icon/Icons80x80px/BLDC/8.svg",
                                   "./icon/Icons80x80px/BLDC/9.svg",
                                   "./icon/Icons80x80px/BLDC/10.svg",
                                   "./icon/Icons80x80px/BLDC/11.svg",
                                   "./icon/Icons80x80px/BLDC/12.svg",
                                   "./icon/Icons80x80px/BLDC/13.svg"
                               ]
                 },
    "COB Lighting":  {
                         "draggableClass":  "switch",
                         "icons":  [
                                       "./icon/Icons80x80px/COB lighting/CL1.svg",
                                       "./icon/Icons80x80px/COB lighting/CL2.svg",
                                       "./icon/Icons80x80px/COB lighting/CL3.svg"
                                   ]
                     },
    "Curtain":  {
                    "draggableClass":  "curtain",
                    "icons":  [
                                  "./icon/Icons80x80px/Curtain/close.svg",
                                  "./icon/Icons80x80px/Curtain/open.svg"
                              ]
                },
    "Decorative Lights":  {
                              "draggableClass":  "switch",
                              "icons":  [
                                            "./icon/Icons80x80px/Decorative Lights/1.svg",
                                            "./icon/Icons80x80px/Decorative Lights/2.svg",
                                            "./icon/Icons80x80px/Decorative Lights/3.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL2.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL3.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL4.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL5.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL7.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL8.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL9.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL10.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL11.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL12.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL14.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL15.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL16.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL17.svg",
                                            "./icon/Icons80x80px/Decorative Lights/HL18.svg"
                                        ]
                          },
    "Fan":  {
                "draggableClass":  "fan",
                "icons":  [
                              "./icon/Icons80x80px/Fan/F1.svg",
                              "./icon/Icons80x80px/Fan/F2.svg",
                              "./icon/Icons80x80px/Fan/F3.svg",
                              "./icon/Icons80x80px/Fan/F5.svg",
                              "./icon/Icons80x80px/Fan/F6.svg",
                              "./icon/Icons80x80px/Fan/F8.svg",
                              "./icon/Icons80x80px/Fan/F10.svg",
                              "./icon/Icons80x80px/Fan/F11.svg",
                              "./icon/Icons80x80px/Fan/F12.svg",
                              "./icon/Icons80x80px/Fan/F13.svg",
                              "./icon/Icons80x80px/Fan/F14.svg",
                              "./icon/Icons80x80px/Fan/F15.svg",
                              "./icon/Icons80x80px/Fan/F16.svg",
                              "./icon/Icons80x80px/Fan/F17.svg",
                              "./icon/Icons80x80px/Fan/F18.svg",
                              "./icon/Icons80x80px/Fan/F19.svg",
                              "./icon/Icons80x80px/Fan/F20.svg",
                              "./icon/Icons80x80px/Fan/F21.svg",
                              "./icon/Icons80x80px/Fan/Fan Default.svg",
                              "./icon/Icons80x80px/Fan/touchfandefault.svg"
                          ]
            },
    "Home Appliances":  {
                            "draggableClass":  "switch",
                            "icons":  [
                                          "./icon/Icons80x80px/Home Appliances/101.svg",
                                          "./icon/Icons80x80px/Home Appliances/102.svg",
                                          "./icon/Icons80x80px/Home Appliances/103.svg",
                                          "./icon/Icons80x80px/Home Appliances/104.svg",
                                          "./icon/Icons80x80px/Home Appliances/105.svg",
                                          "./icon/Icons80x80px/Home Appliances/106.svg",
                                          "./icon/Icons80x80px/Home Appliances/107.svg",
                                          "./icon/Icons80x80px/Home Appliances/108.svg",
                                          "./icon/Icons80x80px/Home Appliances/109.svg",
                                          "./icon/Icons80x80px/Home Appliances/110.svg",
                                          "./icon/Icons80x80px/Home Appliances/111.svg",
                                          "./icon/Icons80x80px/Home Appliances/112.svg",
                                          "./icon/Icons80x80px/Home Appliances/113.svg",
                                          "./icon/Icons80x80px/Home Appliances/114.svg",
                                          "./icon/Icons80x80px/Home Appliances/115.svg",
                                          "./icon/Icons80x80px/Home Appliances/116.svg",
                                          "./icon/Icons80x80px/Home Appliances/117.svg",
                                          "./icon/Icons80x80px/Home Appliances/118.svg",
                                          "./icon/Icons80x80px/Home Appliances/119.svg",
                                          "./icon/Icons80x80px/Home Appliances/120.svg",
                                          "./icon/Icons80x80px/Home Appliances/221.svg",
                                          "./icon/Icons80x80px/Home Appliances/222.svg",
                                          "./icon/Icons80x80px/Home Appliances/223.svg",
                                          "./icon/Icons80x80px/Home Appliances/224.svg",
                                          "./icon/Icons80x80px/Home Appliances/225.svg",
                                          "./icon/Icons80x80px/Home Appliances/226.svg",
                                          "./icon/Icons80x80px/Home Appliances/227.svg",
                                          "./icon/Icons80x80px/Home Appliances/228.svg",
                                          "./icon/Icons80x80px/Home Appliances/229.svg",
                                          "./icon/Icons80x80px/Home Appliances/230.svg",
                                          "./icon/Icons80x80px/Home Appliances/231.svg",
                                          "./icon/Icons80x80px/Home Appliances/232.svg",
                                          "./icon/Icons80x80px/Home Appliances/233.svg",
                                          "./icon/Icons80x80px/Home Appliances/234.svg",
                                          "./icon/Icons80x80px/Home Appliances/235.svg",
                                          "./icon/Icons80x80px/Home Appliances/236.svg",
                                          "./icon/Icons80x80px/Home Appliances/238.svg",
                                          "./icon/Icons80x80px/Home Appliances/239.svg"
                                      ]
                        },
    "Light":  {
                  "draggableClass":  "switch",
                  "icons":  [
                                "./icon/Icons80x80px/Light/161.svg",
                                "./icon/Icons80x80px/Light/162.svg",
                                "./icon/Icons80x80px/Light/163.svg",
                                "./icon/Icons80x80px/Light/164.svg",
                                "./icon/Icons80x80px/Light/165.svg",
                                "./icon/Icons80x80px/Light/166.svg",
                                "./icon/Icons80x80px/Light/167.svg",
                                "./icon/Icons80x80px/Light/168.svg",
                                "./icon/Icons80x80px/Light/169.svg",
                                "./icon/Icons80x80px/Light/170.svg",
                                "./icon/Icons80x80px/Light/171.svg",
                                "./icon/Icons80x80px/Light/172.svg",
                                "./icon/Icons80x80px/Light/HL.svg",
                                "./icon/Icons80x80px/Light/L13.svg",
                                "./icon/Icons80x80px/Light/L14.svg",
                                "./icon/Icons80x80px/Light/L15.svg",
                                "./icon/Icons80x80px/Light/Lamp-12.svg",
                                "./icon/Icons80x80px/Light/Lamp-13.svg",
                                "./icon/Icons80x80px/Light/Lamp-14.svg",
                                "./icon/Icons80x80px/Light/Lamp-15.svg",
                                "./icon/Icons80x80px/Light/Lamp-16.svg",
                                "./icon/Icons80x80px/Light/Lamp-17.svg",
                                "./icon/Icons80x80px/Light/Lamp-18.svg",
                                "./icon/Icons80x80px/Light/Lamp-19.svg",
                                "./icon/Icons80x80px/Light/Lamp-20.svg",
                                "./icon/Icons80x80px/Light/Lamp-21.svg",
                                "./icon/Icons80x80px/Light/Lamp-22.svg",
                                "./icon/Icons80x80px/Light/Lamp-23.svg",
                                "./icon/Icons80x80px/Light/Lamp-24.svg",
                                "./icon/Icons80x80px/Light/Lamp-25.svg",
                                "./icon/Icons80x80px/Light/Lamp-26.svg",
                                "./icon/Icons80x80px/Light/Lamp-27.svg"
                            ]
              },
    "Necessity":  {
                      "draggableClass":  "switch",
                      "icons":  [
                                    "./icon/Icons80x80px/Neccesities/p8.svg",
                                    "./icon/Icons80x80px/Neccesities/p9.svg",
                                    "./icon/Icons80x80px/Neccesities/p10.svg",
                                    "./icon/Icons80x80px/Neccesities/p11.svg"
                                ]
                  },
    "Scene":  {
                  "draggableClass":  "switch",
                  "icons":  [
                                "./icon/Icons80x80px/Scene/81.svg",
                                "./icon/Icons80x80px/Scene/82.svg",
                                "./icon/Icons80x80px/Scene/83.svg",
                                "./icon/Icons80x80px/Scene/84.svg",
                                "./icon/Icons80x80px/Scene/85.svg",
                                "./icon/Icons80x80px/Scene/86.svg",
                                "./icon/Icons80x80px/Scene/87.svg",
                                "./icon/Icons80x80px/Scene/88.svg",
                                "./icon/Icons80x80px/Scene/90.svg",
                                "./icon/Icons80x80px/Scene/91.svg",
                                "./icon/Icons80x80px/Scene/93.svg",
                                "./icon/Icons80x80px/Scene/94.svg",
                                "./icon/Icons80x80px/Scene/95.svg",
                                "./icon/Icons80x80px/Scene/96.svg",
                                "./icon/Icons80x80px/Scene/97.svg",
                                "./icon/Icons80x80px/Scene/98.svg",
                                "./icon/Icons80x80px/Scene/99.svg",
                                "./icon/Icons80x80px/Scene/100.svg",
                                "./icon/Icons80x80px/Scene/201.svg",
                                "./icon/Icons80x80px/Scene/202.svg",
                                "./icon/Icons80x80px/Scene/203.svg",
                                "./icon/Icons80x80px/Scene/204.svg",
                                "./icon/Icons80x80px/Scene/205.svg",
                                "./icon/Icons80x80px/Scene/206.svg",
                                "./icon/Icons80x80px/Scene/207.svg",
                                "./icon/Icons80x80px/Scene/208.svg",
                                "./icon/Icons80x80px/Scene/209.svg"
                            ]
              },
    "Socket":  {
                   "draggableClass":  "switch",
                   "icons":  [
                                 "./icon/Icons80x80px/Socket/1.svg",
                                 "./icon/Icons80x80px/Socket/2.svg",
                                 "./icon/Icons80x80px/Socket/3.svg",
                                 "./icon/Icons80x80px/Socket/5.svg",
                                 "./icon/Icons80x80px/Socket/7.svg",
                                 "./icon/Icons80x80px/Socket/8.svg",
                                 "./icon/Icons80x80px/Socket/9.svg",
                                 "./icon/Icons80x80px/Socket/10.svg",
                                 "./icon/Icons80x80px/Socket/11.svg",
                                 "./icon/Icons80x80px/Socket/12.svg",
                                 "./icon/Icons80x80px/Socket/Accessorie-01.svg",
                                 "./icon/Icons80x80px/Socket/Accessorie-04.svg",
                                 "./icon/Icons80x80px/Socket/Icon List.svg",
                                 "./icon/Icons80x80px/Socket/page 5-12.svg",
                                 "./icon/Icons80x80px/Socket/page 5-16.svg"
                             ]
               }
};

  function sanitizeForId(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function createBetaIconItem(iconPath, draggableClass, sectionTitle) {
    const fileName = iconPath.split('/').pop();
    const baseName = fileName.replace(/\.[^.]+$/, '');
    const iconId = 'drag-beta-' + sanitizeForId(sectionTitle + '-' + baseName + '-' + fileName.split('.').pop());

    return $('<li>', {
      class: 'rmenu-item-i beta-generated-icon',
      'data-beta-icon': 'true'
    }).append($('<img>', {
      id: iconId,
      draggable: true,
      ontouchstart: 'drag(event)',
      ondragstart: 'drag(event)',
      src: iconPath,
      alt: baseName,
      'data-draggable-class': draggableClass
    }));
  }

  function appendIconsToSection(sectionTitle, sectionConfig) {
    const titleItem = $('.rmenu-icon-title').filter(function () {
      return $(this).text().trim() === sectionTitle;
    }).first();

    if (!titleItem.length) {
      console.warn('Beta icon section not found:', sectionTitle);
      return;
    }

    let insertAfter = titleItem;
    while (insertAfter.next().length && !insertAfter.next().hasClass('rmenu-icon-title')) {
      insertAfter = insertAfter.next();
    }

    sectionConfig.icons.forEach(function (iconPath) {
      const iconItem = createBetaIconItem(iconPath, sectionConfig.draggableClass, sectionTitle);
      insertAfter.after(iconItem);
      insertAfter = iconItem;
    });
  }

  $(document).ready(function () {
    Object.keys(betaIconGroups).forEach(function (sectionTitle) {
      appendIconsToSection(sectionTitle, betaIconGroups[sectionTitle]);
    });
  });
})();
