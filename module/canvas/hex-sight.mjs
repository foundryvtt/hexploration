/**
 * Custom vision polygon that restricts vision to a single hex.
 */
export default class HexSightPolygon extends foundry.canvas.geometry.PointSourcePolygon {
  /**
   * The amount of padding in pixels added to the explored hex region.
   * @type {number}
   */
  static PADDING = 5;

  /* -------------------------------------------- */

  /**
   * Hex point offsets.
   * @type {{row: number[][], col: number[][]}}
   */
  static POINTS = {
    row: [[0, .5], [.5, .25], [.5, -.25], [0, -.5], [-.5, -.25], [-.5, .25]],
    col: [[-.25, .5], [.25, .5], [.5, 0], [.25, -.5], [-.25, -.5], [-.5, 0]]
  };

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /** @override */
  applyConstraint() {
    return this;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  initialize(origin, config) {
    super.initialize(origin, config);
    if ( config.type !== "sight" ) throw new Error("HexSightPolygon may only be used for sight polygons.");
  }

  /* -------------------------------------------- */

  /** @override */
  _compute() {
    const t = canvas.grid.type;
    const hex = new foundry.grid.GridHex(canvas.grid.getOffset(this.origin), canvas.grid);
    const points = HexSightPolygon.POINTS[t >= 2 && t <= 3 ? "row" : "col"];
    this.points = HexSightPolygon.applyPadding(hex, points);
  }

  /* -------------------------------------------- */
  /*  Helpers                                     */
  /* -------------------------------------------- */

  /**
   * A static helper method to apply variable padding to a hex offset.
   * @param {GridHex} hex        The hex offset.
   * @param {number[][]} points  The normalised hexagon points.
   * @returns {number[]}         The resulting hex polygon with padding applied.
   */
  static applyPadding(hex, points) {
    if ( !hex ) return [];
    const c = hex.center;
    const { sizeX, sizeY } = hex.grid;
    const poly = [];
    for ( const [ox, oy] of points ) {
      const x = c.x + (ox * sizeX);
      const y = c.y  + (oy * sizeY);
      const r = new foundry.canvas.geometry.Ray(c, { x, y });
      const py = this.PADDING * Math.sin(r.angle);
      const px = this.PADDING * Math.cos(r.angle);
      poly.push(x + px, y + py);
    }
    return poly;
  }
}
