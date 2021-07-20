import Model from './model.js';
import View from './view.js';

document.addEventListener("DOMContentLoaded", () => {
    const model = new Model();
    const view = new View();
    let intBoard = []; // internal board
    let board = document.getElementById('sd-board'); // ui board

    function createIntBoard(){ 
        let board = [];
        for (let i = 0; i < 9; i++) {
            let row = [];
            for (let j = 0; j < 9; j++) {
                let r =   ( j + ( i * 3 ) + ~~( i / 3)) % 9 + 1;
                row.push( r );
            }
            board.push(row);
        }
        return board;
    }

    function scrambleBoard(board){ // 
        const rand3arr = () => [ 0, 1, 2 ].sort( e => Math.random() - .5 );

        // scramble colums
        for (let c = 0; c < 3; c++) {
            let rarr = rand3arr();
            for (let r = 0; r < 9; r++) {
                let auxArr = [];
                for(let a = 0; a < 3; a++) auxArr.push( board[r][ rarr[a] + c*3 ]); // get 3 cols in scrambled order
                for(let a = 0; a < 3; a++) board[r][a + c*3] = auxArr[a]; // set 3 board cols w scrambled arr
            }   
        }

        // scramble rows
        for (let c = 0; c < 3; c++) {
            let rarr = rand3arr();
            for (let r = 0; r < 9; r++) {
                let auxArr = [];
                for(let a = 0; a < 3; a++) auxArr.push( board[ rarr[a] + c*3 ][r]); // get 3 cols in scrambled order
                for(let a = 0; a < 3; a++) board[a + c*3][r] = auxArr[a]; // set 3 board cols w scrambled arr
            }   
        }
    }

    function removeNumbers(board, numbers){ // remove n numbers from board
        const findNEOrdRC = (board, n) => { // find non empty cell order to remove value
            let ord = 0;
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if( board[r][c] > 0 && board[r][c] <= 10) {
                        if( ord == n ){
                            return ( { r: r, c: c });
                        }
                        ord++;
                    }
                }
            }
        }

        for (let i = 0; i < numbers; i++) {
            let n = ~~(Math.random() * ( 81 - i ));
            let rc = findNEOrdRC(board, n);
            board[rc.r][rc.c] = '';
        }
    }

    function checkNumber(board, r, c, n) { // mmmm
        for (let i = 0; i < 9; i++) {
            if( board[r][i] == n){
                return true;
            }
        }
        for (let i = 0; i < 9; i++) {
            if( board[i][c] == n){
                return true;
            }
        }
        let di = ~~(r / 3), dj = ~~(c / 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if( board[ i + 3*di ][ j + 3*dj ] == n ){
                    return true;
                }
            }
        }
        return false;
    }

    function checkBoardErrors(board){ // check errors in board (repeated numbers, missing, etc) TODO
        const genArr9 = () => [ ...Array(9).keys() ].map( () => 0 );
        let rows = [], cols = [], sects = [], errors = [];

        // console.log('Rows:')
        for (let i = 0; i < 9; i++) {
            let table = genArr9();
            for (let j = 0; j < 9; j++) {
                if ( board[i][j] != 0 )
                    table[ board[i][j] - 1 ] = board[i][j];
            }
            // console.log('table', table, table.every( e => e != 0 ) );
            // console.log(table.every( e => e != 0 ) );
            rows.push( table.every( e => e != 0 ));
        }

        // console.log('Columns:')
        for (let j = 0; j < 9; j++) {
            let table = genArr9();
            for (let i = 0; i < 9; i++) {
                if ( board[i][j] != 0 )
                    table[ board[i][j] - 1 ] = board[i][j];
            }
            // console.log('table', table, table.every( e => e != 0 ) );
            // console.log(table.every( e => e != 0 ) );
            cols.push( table.every( e => e != 0 ));
        }

        // console.log('Sectors:')
        for (let di = 0; di < 3; di++) {
            for (let dj = 0; dj < 3; dj++) {
                let sec = '', table = genArr9();
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        sec += board[i + 3*di ][j + 3*dj ] + ' ';
                        if ( board[i + 3*di ][j + 3*dj ] != 0 ){
                            table[ board[ i + 3*di ][ j + 3*dj ] - 1 ] = board[i + 3*di][j + 3*dj];
                        }
                    }
                    sec += '\n';
                }
                // console.log('table', table, table.every( e => e != 0 ) );
                // console.log(sec);
                sects.push( table.every( e => e != 0 ));
            }
        }

        errors = errors
            .concat( [ rows.filter( e => e == false ) ])
            .concat( [ cols.filter( e => e == false ) ]) 
            .concat( [ sects.filter( e => e == false ) ]);

        // console.log('Results:');
        // console.log('  cols:', cols);
        // console.log('  rows:', rows);
        // console.log('  sects:', sects);
        // console.log('  errors:', errors);
        // console.log('  errors.some:', errors.some( e => e.length > 0 ));
        if( errors.some( e => e.length > 0 ) )
            return errors
    }

    function getICell(r, c){ // get content of interface cell
        let vBoard = document.getElementById('sd-board');
        console.log('r, c: ', r, c);
        console.log('sector', ~~(r / 3), ~~(c / 3))
    }

    function drawBoard(board) { // draw board in ui
        let vBoard = document.getElementById('sd-board'); // get board element
        for (let di = 0; di < 3; di++) { 
            for (let dj = 0; dj < 3; dj++) {
                let sector = vBoard.children[di * 3 + dj];
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        sector.children[ i * 3 + j ].innerHTML = board[i + 3*di ][j + 3*dj ];
                    }
                }
            }
        }
    }

    function showBoardElements(board, r, c) { // ...
        console.log('r', r, 'c', c);
        console.log('row:');
        for (let i = 0; i < 9; i++) {
            console.log(board[r][i]);
        }
        console.log('col:');
        for (let i = 0; i < 9; i++) {
            console.log(board[i][c]);
        }
        let di = ~~(r / 3), dj = ~~(c / 3);
        console.log('di', di, 'dj', dj);
        console.log('sect:');
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                console.log(board[ i + di * 3][ j + dj * 3 ]);
            }
        }
    }

    intBoard = createIntBoard(intBoard); // creates an internal board
    // console.log('Board:', intBoard);
    scrambleBoard(intBoard); // scrambles the board
    drawBoard(intBoard); // draw board on ui
    console.log('> checkBoardErrors?:', (checkBoardErrors(intBoard))?'some errors':'no errors'); // chk
    removeNumbers(intBoard, 60); // removes some numbers from board
    drawBoard(intBoard); // draw board on ui

    // console.log('check: 3 @ 1, 1',checkNumber(intBoard, 1, 1, 3));

    // showBoardElements(intBoard, 4, 5);
    // fillSector(intBoard, 0, 0);
    // fillSector(intBoard, 0, 1);
    // fillSector(intBoard, 0, 2);

    // fillSector(intBoard, 1, 0);
    // fillSector(intBoard, 1, 1);
    // fillSector(intBoard, 1, 2);

    // fillSector(intBoard, 2, 0);
    // fillSector(intBoard, 2, 1);
    // fillSector(intBoard, 2, 2);

    // console.log('CheckBoard:', checkBoard(intBoard));
    // console.log(board);


    // console.log('------------------------')
    // let arr = [ ...Array(3).keys() ].map( () => 0 );
    // console.log('arr', arr);
    // // arr[0] = 1;
    // arr[1] = 2;
    // // arr[2] = 1;
    // console.log(arr[0]);
    // console.log(arr.every( e => ( e == 1 )));


    // // [...board.children].forEach( (e) => console.log('element:', e));
    // console.log('sect A', board.children[0]);
    // let a = board.children[0];
    // let arr = [...a.children];
    // console.log(a, typeof a);
    // console.log(arr);
    // arr.forEach( (e, i) => e.innerHTML = i+1 );
})
