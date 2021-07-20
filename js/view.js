import Board from './components/board.js';

export default class View{
    constructor(){
        this.board = new Board();
        this.board.onPointerDown(this.setCellValue.bind(this));
        this.board.onReset(this.resetBoard.bind(this));
        this.model = null;
    }

    setModel(model){
        this.model = model;
    }

    render(){
        this.board.render(this.model.board);
    }

    resetBoard(){
        this.model.initBoard(this.model.tilesToTemove);
        this.board.render(this.model.board);
    }

    setCellValue(row, col, value, erase, annotate){
        if(erase){
            this.model.setBoardNumber(row, col, 0);
        }else{
            this.model.setBoardNumber(row, col, value);
        }
        this.board.drawCell(this.model.board, row, col);

        if(this.model.checkBoard()){
            this.board.setStatus('Finished', 1);
        }else{
            this.board.setStatus('Playing', 2);
        }
    }

}