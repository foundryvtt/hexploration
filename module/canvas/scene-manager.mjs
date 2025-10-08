import HexSightPolygon from './hex-sight.mjs';

export default class HexplorationSceneManager extends foundry.canvas.SceneManager {
  /**
   * The original sight backend.
   * @type {PointSourcePolygon}
   */
  #originalSightBackend;

  /* -------------------------------------------- */

  /** @override */
  async _onInit() {
    if ( canvas.visibilityOptions ) canvas.visibilityOptions.persistentVision = true;
  }

  /* -------------------------------------------- */

  async _onDraw() {
    if ( CONFIG.Canvas.polygonBackends.sight !== HexSightPolygon ) {
      this.#originalSightBackend = CONFIG.Canvas.polygonBackends.sight;
    }
    CONFIG.Canvas.polygonBackends.sight = HexSightPolygon;
  }

  /* -------------------------------------------- */

  async _onTearDown() {
    CONFIG.Canvas.polygonBackends.sight = this.#originalSightBackend ?? foundry.canvas.geometry.ClockwiseSweepPolygon;
    this.#originalSightBackend = undefined;
  }

  /* -------------------------------------------- */
  /*  Hooks                                       */
  /* -------------------------------------------- */

  /**
   * Assign managers to scenes.
   */
  static setup() {
    game.scenes.forEach(scene => {
      const enabled = scene.getFlag("hexploration", "enabled");
      if ( enabled ) CONFIG.Canvas.managedScenes[scene.id] = HexplorationSceneManager;
    });
  }

  /* -------------------------------------------- */

  /**
   * Assign managers based on settings changed.
   * @param {Scene} scene   The updated Scene Document.
   * @param {object} delta  The update delta.
   */
  static update(scene, delta) {
    if ( !foundry.utils.hasProperty(delta, "flags.hexploration.enabled") ) return;
    const enabled = foundry.utils.getProperty(delta, "flags.hexploration.enabled");
    if ( enabled ) CONFIG.Canvas.managedScenes[scene.id] = HexplorationSceneManager;
    else delete CONFIG.Canvas.managedScenes[scene.id];
    if ( canvas.scene === scene ) canvas.draw();
  }
}
