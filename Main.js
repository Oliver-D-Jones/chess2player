//==========================================MAIN CLASS=============================
window.addEventListener("load",__init__,false);
let Board;
let BOARD_SIZE = 8;
let Squares = document.images;
function __init__(){

	Board = new Game(2,"white");
	Board.setupBoard();
	let t = document.getElementById('table');
	t.style.transform = 'rotate(360deg)';
}
//======================================  EVENT LISTENER FUNCTIONS  ======================
function move(e){
	//---Listen for a player to click on a square, for possible movement of piece
	if( this.Piece_Ref.player_name != Board.player_turn && Board.Selected_Piece.player_name ){
		Board.move_to = e.target.index;
		Board.move_from = Board.Selected_Piece.position;
		if( Board.Selected_Piece.possible_moves.some(can_move) ){

			Squares[Board.move_from].vacate();
			Squares[Board.move_to].occupy();

			Board.Selected_Piece.movePiece();

			Board.Selected_Piece.Player.in_check_by = [];
			Board.Selected_Piece.Player.in_check_vector = [];
			if( Board.Selected_Piece.Player.Opponent.isGameOver() ){

				if( Board.analysis == "checkmate" ){	//---checkmate
					window.alert("CHECK MATE! \n" + Board.player_turn.toUpperCase() + " Wins! \n" + "Hit The Refresh Button For New Game.")
				}
				else if( Board.analysis == "stalemate" ){	//---stalemate
					window.alert("STALE MATE! \n" + "Hit The Refresh Button For New Game.")
				}
				else if( Board.analysis == "draw" ){	//---stalemate
					window.alert("DRAW! \n" + "Hit The Refresh Button For New Game.")
				}

			}
			Board.player_turn = Board.Selected_Piece.opp_name;
			Board.Selected_Piece = null;
			Board.moves++;
		}
		else{
			return;
		}
		Board.Current_Piece_Selected=Board.Selected_Piece = Board.NO_PIECE;
	}
	function can_move(v,i,a){
		return (Board.move_to==v);
	}
}

function vacate(){
	this.removeEventListener('click',select,false);
	Squares[this.Piece_Ref.position].style.backgroundColor = Squares[this.Piece_Ref.position].className;
	Board.Selected_Piece.hideMoves();
	this.Piece_Ref = Board.NO_PIECE;
	this.src = this.className + ".jpg";
	Board.Selected_Piece.possible_moves = [];
}

function occupy(){
	if( this.Piece_Ref.player_name == Board.Selected_Piece.opp_name ){
		Board.Captured_Piece = this.Piece_Ref;
		this.Piece_Ref.Player.Pieces[this.Piece_Ref.pieces_index] = Board.NO_PIECE;
		this.Piece_Ref.Player.number_of_pieces--;
	}
	else{
		Board.Captured_Piece = Board.NO_PIECE;
	}
	this.Piece_Ref = Board.Selected_Piece;
	this.src = Board.Selected_Piece.image;
	this.addEventListener('click',select,false);
	this.addEventListener('click',select,false);
}

function select(e){
	if( this.Piece_Ref.player_name == Board.player_turn ){
		if(this.Piece_Ref.Player.in_check_vector.length > 1 && this.Piece_Ref.piece != 'king') 
			return;
		Board.Selected_Piece = this.Piece_Ref;
		if(Board.Current_Piece_Selected == Board.NO_PIECE){	//-----  new piece is selected
			Board.Current_Piece_Selected = Board.Selected_Piece;
			Board.Selected_Piece.legalMoves();
			Board.Selected_Piece.highlightPiece();
			Board.Selected_Piece.showMoves();
		}
		else if(Board.Current_Piece_Selected != Board.Selected_Piece){	//---  change piece selected
			Board.Current_Piece_Selected.unHighlightPiece();
			Board.Current_Piece_Selected.hideMoves();
			Board.Current_Piece_Selected = Board.Selected_Piece;
			Board.Selected_Piece.legalMoves();
			Board.Selected_Piece.highlightPiece();
			Board.Selected_Piece.showMoves();
		}
		else{						//----  must unselect piece
			Board.Current_Piece_Selected.unHighlightPiece();
			Board.Current_Piece_Selected.hideMoves();
			Board.Current_Piece_Selected = Board.NO_PIECE;
			Board.Selected_Piece.unHighlightPiece();
			Board.Selected_Piece.hideMoves();
			Board.Selected_Piece=Board.NO_PIECE;	
		}
	}
}