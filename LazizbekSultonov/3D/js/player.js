class Player {
    constructor(x, y, z, rx, ry, rz, vx, vy, vz) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.rx = rx || 0;
        this.ry = ry || 0;
        this.rz = rz || 0;
        this.vx = vx || 5;
        this.vy = vy || 5;
        this.vz = vz || 5;
        this.timer = 100;
    }
}
