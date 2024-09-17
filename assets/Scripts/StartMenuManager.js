import GameParameters from './GameParameters';

export default cc.Class({
    extends: cc.Component,

    properties: {
        startButton: {
            default: null,
            type: cc.Button
        },
        settingsContainer: {
            default: null,
            type: cc.Node
        },
        settingsButton: {
            default: null,
            type: cc.Button
        },
        widthSlider: {
            default: null,
            type: cc.Slider
        },
        widthValueLabel: {
            default: null,
            type: cc.Label
        },
        heightSlider: {
            default: null,
            type: cc.Slider
        },
        heightValueLabel: {
            default: null,
            type: cc.Label
        },
        colorsSlider: {
            default: null,
            type: cc.Slider
        },
        colorsValueLabel: {
            default: null,
            type: cc.Label
        },
        targetPointsEditBox: {
            default: null,
            type: cc.EditBox
        },
        movesEditBox: {
            default: null,
            type: cc.EditBox
        }
    },

    onLoad() {
        this.widthSlider.progress = (GameParameters.columns - GameParameters.minColumns) / 10;
        this.widthValueLabel.string = GameParameters.columns;

        this.heightSlider.progress = (GameParameters.rows - GameParameters.minRows) / 10;
        this.heightValueLabel.string = GameParameters.rows;

        this.colorsSlider.progress = (GameParameters.colorOptionsAmount - GameParameters.minColorOptionsAmount) / 4;
        this.colorsValueLabel.string = GameParameters.colorOptionsAmount;

        this.targetPointsEditBox.placeholderLabel.string = GameParameters.targetPoints;
        this.movesEditBox.placeholderLabel.string = GameParameters.startMovesCount;

        this._addEventListeners();
    },

    onStartButton() {
        cc.director.loadScene("Game");
    },

    onSettingsButton() {
        this._showSettings(true);
    },

    onSettingsCloseButton() {
        this._showSettings(false);
    },

    _showSettings(isSettingsVisible) {
        this.startButton.node.active = !isSettingsVisible;
        this.settingsButton.node.active = !isSettingsVisible;

        this.settingsContainer.active = isSettingsVisible;
    },

    _addEventListeners() {
        this.widthSlider.node.on('slide', (event) => {
            const width = Math.round(GameParameters.minColumns + event.progress * (GameParameters.maxColumns - GameParameters.minColumns));
            this.widthValueLabel.string = width;
            GameParameters.columns = width;
        });

        this.heightSlider.node.on('slide', (event) => {
            const height = Math.round(GameParameters.minRows + event.progress * (GameParameters.maxRows - GameParameters.minRows));
            this.heightValueLabel.string = height;
            GameParameters.rows = height;
        });

        this.colorsSlider.node.on('slide', (event) => {
            const colors = Math.round(GameParameters.minColorOptionsAmount + event.progress * (GameParameters.maxColorOptionsAmount - GameParameters.minColorOptionsAmount));
            this.colorsValueLabel.string = colors;
            GameParameters.colorOptionsAmount = colors;
        });

        this.targetPointsEditBox.node.on('editing-did-ended', () => {
            const targetPoints = this.targetPointsEditBox.string;

            if (targetPoints) {
                GameParameters.targetPoints = targetPoints;
            }
        });

        this.movesEditBox.node.on('editing-did-ended', () => {
            const moves = this.movesEditBox.string;
            
            if (moves) {
                GameParameters.startMovesCount = moves;
            }
        });
    },

    onDestroy() {
        this.widthSlider.node.off("slide");
        this.heightSlider.node.off("slide");
        this.colorsSlider.node.off("slide");
        this.targetPointsEditBox.node.off("editing-did-ended");
        this.movesEditBox.node.off("editing-did-ended");
    }
});
