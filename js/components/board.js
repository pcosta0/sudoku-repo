export default class Board{
    constructor(){
        this.name = 'sudoku board';
        this.annotation = false; 
        this.erase = false; 
        this.number = 1;
        this.callback = null;
        this.callbackReset = null;

        this.boardGrid = document.getElementById('sdk-grid');
        this.score =  document.getElementById('sdk-score');
        this.numbers =  document.getElementById('sdk-numbers');
        this.ctrls =  document.getElementById('sdk-ctrls');

        this.numbers.onpointerdown = this.handleControl.bind(this);
        this.ctrls.onpointerdown = this.handleControl.bind(this);

        window.addEventListener("keydown", this.handleKbd.bind(this));
    } 

    setErase(erase){
        this.erase = erase; // set internal erase mode
        this.ctrls.children[1].classList.toggle('cl-warning'); // set button active
        if( erase ){
            if( this.annotation ){
                this.setNumber(this.number); // show selected number
            }else{
                this.setNumber(0); // clear numbers
            }
        }else{
            this.setNumber(this.number); // show selected number
        }
    }

    setAnotation(annotation = true){
        this.annotation = annotation; // set internal annotation mode
        this.ctrls.children[0].classList.toggle('cl-selected'); // set button active 
        if( annotation ){ 
            if( this.erase ){ // erase mode?
                this.setNumber(this.number); // show selected number
            }
        }else{ 
            if( this.erase ){ // 
                this.setNumber(0); // clear numbers
            }
        }
    }

    setNumber(number){
        [...this.numbers.children].forEach( e => e.className = 'ctrl cl-light' ); // clear numbers
        if( number > 0 && number < 10 ){ // valid number?
            this.number = number; // set internal number
            this.numbers.children[number-1].className = 'ctrl cl-selected'; // set selected button number active
            if(this.erase && !this.annotation){ // erase mode and not annotation mode?
                this.setErase(false); // clear erase
            }
        }
    }

    handleKbd(e){
        if (e.key !== undefined) {
            if( e.key > '0' && e.key <= '9'){
                this.setNumber(e.key);
            }else{
                switch(e.key.toLowerCase()){
                    case '.':
                    case 'a':
                    case 'q':
                        this.setAnotation(!this.annotation);
                        break;
                    case '-':
                    case 'x':
                    case 'w':
                        this.setErase(!this.erase);
                        break;
                    case 'r':
                        this.callbackReset();
                        break;
                }
            }
        } 
    }

    handleControl(e){
        if( e.target.parentElement.id == 'sdk-numbers' ){ // Number ?
            this.setNumber(e.target.id.slice(-1)); // set number
        }
        else if( e.target.parentElement.id == 'sdk-ctrls' ){ // Control ?
            switch( e.target.id.slice(-1) ){
                case '#': // Annotation ?
                    this.setAnotation(!this.annotation); // toggle annotation
                    break
                case 'x':
                    this.setErase(!this.erase); // toggle erase
                    break
                case 'r':
                    this.callbackReset();
                    break
            }
        }
    }

    render(boardModel){
        this.boardGrid.innerHTML = ''; // clear grid content
        // reset Controls
        this.setStatus('Sudoku');
        this.setNumber(1);
        this.setErase(false);
        this.setAnotation(false);
        [...this.ctrls.children].forEach( e => e.className = 'ctrl cl-light' ); // set controls style
      
        for (let di = 0; di < 3; di++) { // create board grid content by sectors
            for (let dj = 0; dj < 3; dj++) {
                let sector = document.createElement('div'); // create new sector
                sector.classList.add('box', 'd9');
                for (let i = 0; i < 3; i++) { // set sector cells values
                    for (let j = 0; j < 3; j++) {
                        let cell = document.createElement('div'); // create cell
                        switch( boardModel[ i + 3*di ][ j + 3*dj ].state ){ // state of model cell ?
                            case 0: // fixed number
                                cell.innerHTML = boardModel[ i + 3*di ][ j + 3*dj ].number; // set value
                                cell.classList.add('box', 'box-fixed'); // set style
                                break;
                            case 1: // user number
                                cell.onpointerdown = this.onpointerdown.bind(this); // set value
                                cell.classList.add('box', 'box-user');  // set style
                                break;
                            case 2: // annotation
                                cell.onpointerdown = this.onpointerdown.bind(this);
                                cell.classList.add('box', 'box-annotation');
                                break;
                        }
                        sector.appendChild(cell);
                    }
                }
                this.boardGrid.appendChild(sector);
            }
        }
    }

    setStatus(status, type = 0){
        this.score.children[0].innerHTML = status;
        switch(type){
            case 0: // normal
                this.score.children[0].className = 'ctrl cl-msg cl-normal';
                break;
            case 1: // success
                this.score.children[0].className = 'ctrl cl-msg cl-success';
                break;
            case 2: // warning
                this.score.children[0].className = 'ctrl cl-msg cl-warning';
                break;
        }
    }

    drawCell(boardModel, r, c){
        let sect = 3 * ~~( r / 3) + ~~( c / 3)
        let el = 3 * ( r % 3 ) + ( c % 3 );
        let v = boardModel[r][c].userNumber;
        this.boardGrid.children[sect].children[el].innerHTML = ( v>0 && v<10 )? v : '';
    }

    onReset(callback){
        this.callbackReset = callback;
    }

    onPointerDown(callback){
        this.callback = callback;
    }
    
    onpointerdown(e){
        let sect = [...e.target.parentElement.parentElement.children].indexOf(e.target.parentElement);
        let el = [...e.target.parentElement.children].indexOf(e.target);
        let r = ~~(el / 3) + ~~(sect / 3) * 3;
        let c = ~~(el % 3) + ~~(sect % 3) * 3;

        this.callback(r, c, this.number, this.erase, this.annotation);
    }
 
}