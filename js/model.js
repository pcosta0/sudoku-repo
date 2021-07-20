
export default class Model{
    constructor(){
        this.board = [];
        this.tilesToTemove = 30;
        this.initBoard(this.tilesToTemove);
    }

    // Board
    createBoard(){ // creates internal board filled with perfect ordered numbers
        this.board = [];
        for (let i = 0; i < 9; i++) {
            let row = [];
            for (let j = 0; j < 9; j++) {
                let n = ( j + ( i * 3 ) + ~~( i / 3)) % 9 + 1;
                let e = { number: n, userNumber: 0, state: 0, annotations: []}
                row.push( e );
            }
            this.board.push(row);
        }
    }

    scrambleBoard(){
        for (let i = 0; i < 9; i++) {
            let r = ~~(Math.random() * 9); // set 2nd random number
            let n0 = this.board[0][i].number, n1 = this.board[0][r].number; // set n0 & n1 to swap
            if( i != r ){
                let x = this.board.map( (e, ) => { // map every board row and set result to x
                    let cols = e.reduce( (ac, e, i) => // find n0 & n1 number columns in row and concat to an ac
                        ac.concat((( e.number == n0 || e.number == n1)? i : [] )), []);
                    let ex = [...e]; // aux array
                    let aux = ex[ cols[0] ]; // swaps n0 and n1 from ex
                    ex[ cols[0] ] = ex[ cols[1] ]
                    ex[ cols[1] ] = aux;
                    return ex;
                });
                this.board = x;
            }
        }
    }

    removeNRndElementsFromBoard(nToRemove){
        const findNEOrdRC = (n) => { // find non empty order 
            let ord = 0;
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if( this.board[r][c].state == 0 ) { // only counts state 0 cells
                        if( ord == n ){
                            this.board[r][c].state = 1; // state 1 is an empty cell to be edited by user
                            return;
                        }
                        ord++;
                    }
                }
            }
        }

        for (let i = 0; i < nToRemove; i++) {
            let n = ~~(Math.random() * ( 81 - i )); // set random index to remove
            findNEOrdRC(n);
        }
    }

    initBoard(elementsRemoved){
        this.createBoard();
        this.scrambleBoard();
        this.removeNRndElementsFromBoard(elementsRemoved);
    }

    setBoardNumber(row, col, num){
        this.board[row][col].userNumber = ( num>0 && num<10 )? num : 0 ;
    }

    checkBoardNumber(r, c, n) {
        for (let i = 0; i < 9; i++) {
            if( this.board[r][i] == n){
                return true;
            }
        }
        for (let i = 0; i < 9; i++) {
            if( this.board[i][c] == n){
                return true;
            }
        }
        let di = ~~(r / 3), dj = ~~(c / 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if( this.board[ i + 3*di ][ j + 3*dj ] == n ){
                    return true;
                }
            }
        }
        return false;
    }

    checkBoard(){
        // console.log('checkboard:', this.board);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if( this.board[i][j].state == 1 && this.board[i][j].userNumber != this.board[i][j].number ){
                    return false;
                }
            }
        }
        return true;
    }

    checkBoardErrors(){
        const genArr9 = () => [ ...Array(9).keys() ].map( () => 0 );

        let rows = [], cols = [], sects = [], errors = [];
        // check rows errors
        for (let i = 0; i < 9; i++) {
            let table = genArr9();
            for (let j = 0; j < 9; j++) {
                if ( this.board[i][j].number != 0 )
                    table[ this.board[i][j].number - 1 ] = this.board[i][j].number;
            }
            rows.push( table.every( e => e != 0 ));
        }
        // check columns errors
        for (let j = 0; j < 9; j++) {
            let table = genArr9();
            for (let i = 0; i < 9; i++) {
                if ( this.board[i][j].number != 0 )
                    table[ this.board[i][j].number - 1 ] = this.board[i][j].number;
            }
            cols.push( table.every( e => e != 0 ));
        }
        // check sectors errors
        for (let di = 0; di < 3; di++) {
            for (let dj = 0; dj < 3; dj++) {
                let table = genArr9();
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if ( this.board[i + 3*di ][j + 3*dj ].number != 0 ){
                            table[ this.board[ i + 3*di ][ j + 3*dj ].number - 1 ] = this.board[i + 3*di][j + 3*dj].number;
                        }
                    }
                }
                sects.push( table.every( e => e != 0 ));
            }
        }
        //prepare results
        errors = errors
            .concat( [ rows.filter( e => e == false ) ])
            .concat( [ cols.filter( e => e == false ) ]) 
            .concat( [ sects.filter( e => e == false ) ]);
        if( errors.some( e => e.length > 0 ) )
            return errors
    }

}