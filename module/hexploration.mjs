import SceneConfig from './applications/scene-config.mjs';
import HexplorationSceneManager from './canvas/scene-manager.mjs';

Hooks.on("renderSceneConfig", SceneConfig.render);
Hooks.on("setup", HexplorationSceneManager.setup);
Hooks.on("updateScene", HexplorationSceneManager.update);
