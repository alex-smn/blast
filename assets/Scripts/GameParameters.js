const {ccclass, property} = cc._decorator;

export default class {
 	static columns = 12; // N
	static rows = 12; // M
	static minTilesToBlast = 2; // K
	static tileSize = { width: 171, height: 192 }

	static tileColors = {
		blue: "Blue",
		green: "Green",
		purple: "Purple",
		red: "Red",
		yellow: "Yellow"
	};
}