export default class {
 	static columns = 12; // N
	static rows = 12; // M
	static minTilesToBlast = 2; // K
	static shuffleCount = 10000; // S
	static startMovesCount = 150; // Y
	static targetPoints = 3000; // X
	static bombRadius = 2; // R

	static tileSize = { width: 171, height: 192 };
	static tileMoveSpeed = 3500;
	static bounceSpeedRatio = 0.25;
}