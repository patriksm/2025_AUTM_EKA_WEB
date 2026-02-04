

function collision(
  mapObj, 
  leadObj
  // type
) {
  // if (type !== "lode") {
    // Muss auskommentiert werden das ich gleich falle 
    onGround = false;
  // }

  for (let i = 0; i < mapObj.length; i++) {
    //spēlētāja koordinātes katra taiststūra koordināšu sistēmā
    let x0 = (leadObj.x - mapObj[i][0]);
    let y0 = (leadObj.y - mapObj[i][1]);
    let z0 = (leadObj.z - mapObj[i][2]);

    if ((x0 ** 2 + y0 ** 2 + z0 ** 2 + dx ** 2 + dy ** 2 + dz ** 2) < (mapObj[i][6] ** 2 + mapObj[i][7] ** 2)) {
      //Pārvietošanās
      let x1 = x0 + dx;
      let y1 = y0 + dy;
      let z1 = z0 + dz;

      //Jaunā punkta koodrinātes
      let point0 = coorTransform(x0, y0, z0, mapObj[i][3], mapObj[i][4], mapObj[i][5]);
      let point1 = coorTransform(x1, y1, z1, mapObj[i][3], mapObj[i][4], mapObj[i][5]);
      let normal = coorReTransform(0, 0, 1, mapObj[i][3], mapObj[i][4], mapObj[i][5]);
      // let point2 = new Array();

      if (Math.abs(point1[0]) < (mapObj[i][6] + 70) / 2 && Math.abs(point1[1]) < (mapObj[i][7] + 70) / 2 && Math.abs(point1[2]) < 50) {
        // lodei nepieciešāmās darbības
        // if (type === "lode") {
        //   lode.remove();
        //   zimetLodi();
        // } 
        // else {
          point1[2] = Math.sign(point0[2]) * 50;
          let point2 = coorReTransform(point1[0], point1[1], point1[2], mapObj[i][3], mapObj[i][4], mapObj[i][5]);
          let point3 = coorReTransform(point1[0], point1[1], 0, mapObj[i][3], mapObj[i][4], mapObj[i][5]);
          dx = point2[0] - x0;
          dy = point2[1] - y0;
          dz = point2[2] - z0;

          if (Math.abs(normal[1]) > 0.8) {
            if (point3[1] > point2[1]) {
              onGround = true;
            }
          } 
          else {
            dy = y1 - y0;
          }
        // }
      }
    }
  };
}

function coorTransform(x0, y0, z0, rxc, ryc, rzc) {
  let x1 = x0;
  let y1 = y0 * Math.cos(rxc * DEG) + z0 * Math.sin(rxc * DEG);
  let z1 = -y0 * Math.sin(rxc * DEG) + z0 * Math.cos(rxc * DEG);

  let x2 = x1 * Math.cos(ryc * DEG) - z1 * Math.sin(ryc * DEG);
  let y2 = y1;
  let z2 = x1 * Math.sin(ryc * DEG) + z1 * Math.cos(ryc * DEG);

  let x3 = x2 * Math.cos(rzc * DEG) + y2 * Math.sin(rzc * DEG);
  let y3 = -x2 * Math.sin(rzc * DEG) + y2 * Math.cos(rzc * DEG);
  let z3 = z2;
  return [x3, y3, z3];
}

function coorReTransform(x3, y3, z3, rxc, ryc, rzc) {
  let x2 = x3 * Math.cos(rzc * DEG) - y3 * Math.sin(rzc * DEG);
  let y2 = x3 * Math.sin(rzc * DEG) + y3 * Math.cos(rzc * DEG);
  let z2 = z3;

  let x1 = x2 * Math.cos(ryc * DEG) + z2 * Math.sin(ryc * DEG);
  let y1 = y2;
  let z1 = -x2 * Math.sin(ryc * DEG) + z2 * Math.cos(ryc * DEG);

  let x0 = x1;
  let y0 = y1 * Math.cos(rxc * DEG) - z1 * Math.sin(rxc * DEG);
  let z0 = y1 * Math.sin(rxc * DEG) + z1 * Math.cos(rxc * DEG);

  return [x0, y0, z0];
}