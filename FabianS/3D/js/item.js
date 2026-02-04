
function spawnItem({ x, y, z, size = 100, rx = 0, ry = 0, rz = 0 }) {
  // DOM
  const item = document.createElement("div");
  item.id = `item_number${myItemsCounter++}`;
  item.style.display = "block";
  item.style.position = "absolute";
  item.style.width = `${size}px`;
  item.style.height = `${size}px`;
  item.style.borderRadius = "10%";

  item.style.backgroundImage = surface_items;
  item.style.backgroundRepeat = "no-repeat";
  item.style.backgroundSize = "contain";
  item.style.backgroundColor = "transparent";
  item.style.backgroundPosition = "center";
  item.style.transformOrigin = "50% 50% 50%";
  // item.style.transformStyle = "preserve-3d";
  item.style.transform = `
    translate3d(${600 + x - size / 2}px, ${400 + y - size / 2}px, ${z}px)
    rotateX(${rx}deg)
    rotateY(${ry}deg)
    rotateZ(${rz}deg)
  `;

  world.appendChild(item);

  const data = new item_data(x, y, z, rx, ry, rz, size, size, size);

  my_items.push(item);
  myItemsData.push(data);

  return { item, data };
}



function remove_item(i) {
  if (my_items[i]?.parentNode) my_items[i].parentNode.removeChild(my_items[i]);
  my_items.splice(i, 1);
  myItemsData.splice(i, 1);
}



function updateItems(deltaTime) {
  for (let c = 0; c < myItemsData.length; c++) {
    const it = myItemsData[c];
    const el = my_items[c];
    const size = it.vx;
    //(SPIN)
    // it.rx = (it.rx + 90 * deltaTime) % 360;
    it.ry = (it.ry + 90 * deltaTime) % 360;
    it.rz = (it.rz + 90 * deltaTime) % 360;

    el.style.transform = `
      translate3d(${600 + it.x - size / 2}px, ${400 + it.y - size / 2}px, ${it.z}px)
      rotateX(${it.rx}deg)
      rotateY(${it.ry}deg)
      rotateZ(${it.rz}deg)
    `;
  }
}

function showHit(text) {
  const el = document.getElementById("hitmsg");
  el.textContent = text;
  el.style.display = "block";
  clearTimeout(showHit._t);
  showHit._t = setTimeout(
    () => el.style.display = "none",
    2000
  );
}

function checkPawnItemHits() {
  if (!myItemsData.length) return;

  // Pawn world coords (anpassen!)
  const px = (pawn.x ?? 0);
  const py = (pawn.y ?? 0);
  const pz = (pawn.z ?? 0);
  const pawnRadius = 35;

  for (let ii = myItemsData.length - 1; ii >= 0; ii--) {
    const it = myItemsData[ii];
    const itemRadius = (it.vx ?? 100) / 2;

    const dx = px - it.x;
    const dy = py - it.y;
    const dz = pz - it.z;

    const r = pawnRadius + itemRadius;
    if (dx * dx + dy * dy + dz * dz < r * r) {
      showHit("Item collected!");
      remove_item(ii);
      update_points(++counter_points);
      thing.play();

      create_transport_main()
      return;
    }
  }
}
function checkHits() {
  if (!myBulletData.length) return;
  if (!myItemsData.length) return;

  if (myBulletData.length && myItemsData.length) {
    const b = myBulletData.at(-1);
    const it = myItemsData[0];
  }

  for (let bi = 0; bi < myBulletData.length; bi++) {
    const b = myBulletData[bi];

    for (let ii = 0; ii < myItemsData.length; ii++) {
      const it = myItemsData[ii];

      const dx = b.x - it.x;
      const dz = b.z - it.z;
      const dy = b.y - it.y;

      const bulletRadius = 25;
      const itemRadius = (it.vx ?? 100) / 2;
      const tunnel = Math.max(Math.abs(b.vx), Math.abs(b.vz)) / 2;

      const r = itemRadius + bulletRadius + tunnel;


      if (dx * dx + dy * dy + dz * dz < r * r) {
        showHit("Item hit!");


        if (my_items[ii]?.parentNode) my_items[ii].parentNode.removeChild(my_items[ii]);
        my_items.splice(ii, 1);
        myItemsData.splice(ii, 1);

        update_points(++counter_points)
        thing.play()

        create_transport_main()
        return;
      }
    }
  }
}


function create_transport_main() {
  if (getAllItemsRemoved()) {
    let box = drawTransport()
    transportBox.push(box)
    transportBoxData.push(
      new player(
        600,
        200,
        200,
        pawn.rx,
        pawn.ry,
        bulletSpeed,
        bulletSpeed,
        bulletSpeed
      )
    )
  }
}