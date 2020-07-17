//=====================================    KING CLASS  =======================================
function King(Player,pos,pieces_index){
	this.piece = "king";
	this.Piece_Con = Piece;
	this.Piece_Con(Player,pos,pieces_index);
	this.moves_made = 0;
	this.image = this.player_name == "white" ? 'w_king.jpg' : 'b_king.jpg';
	this.castle_moves = [false,false];
	this.directions = ["NORTH","NORTH_EAST","EAST","SOUTH_EAST","SOUTH","SOUTH_WEST","WEST","NORTH_WEST"];
	this.legalMoves = kingMoves;
	this.movePiece = moveKing;
	this.undoMove = undoKingMove;
	this.kingCanMove = kingCanMove;
	this.kingCastleSearch = kingCastleSearch
	this.castlePassesThroughCheck = castlePassesThroughCheck;
	this.diagonalCheck = diagonalCheck;
	this.orthogonalCheck = orthogonalCheck;
	this.knightCheck = knightCheck;
	this.pawnCheck = pawnCheck;
	this.kingCheck = kingCheck;
	this.undoMove = function (){	return	};
	this.placesOppKingInCheck = kingPlacesOppKingInCheck;
	
	function kingPlacesOppKingInCheck(){
	//===============================  LOOK FOR KING MAKING A DISCOVER CHECK ON OPP KING  =========================
		let mfk = this.pieceKingOnOrtho(Board.move_from,this.Opp_King.position);
		if(!mfk)
			mfk = this.pieceKingOnDiag(Board.move_from,this.Opp_King.position);
		if(mfk)
			this.searchForDiscoverCheckVector(mfk);
	
	}
	function moveKing(){
		this.position = Board.move_to;	//---update its new position,Board.move_from would be its original
		this.placesOppKingInCheck();
		let rel_move = Board.move_to - Board.move_from;

		if( Math.abs(rel_move) == 2 ){
			// --rook to right of king
			if( rel_move < 0 ){
				Squares[Board.move_to+1].Piece_Ref = Squares[Board.move_to-2].Piece_Ref;
				Squares[Board.move_to+1].Piece_Ref.position = Board.move_to+1;
				Squares[Board.move_to+1].src = Squares[Board.move_to+1].Piece_Ref.image;
				Squares[Board.move_to+1].addEventListener('click',select,false);
				Squares[Board.move_to-2].vacate();
			}// --rook to left of king
			else{
				Squares[Board.move_to-1].Piece_Ref = Squares[Board.move_to+1].Piece_Ref;
				Squares[Board.move_to-1].Piece_Ref.position = Board.move_to-1;
				Squares[Board.move_to-1].src = Squares[Board.move_to+1].Piece_Ref.image;
				Squares[Board.move_to-1].addEventListener('click',select,false);
				Squares[Board.move_to+1].vacate();
			}
		}
		this.moves_made++;
	}
	function undoKingMove(){
		let rel_move = Board.move_to-Board.move_from

		this.position = Board.move_from;
	
		if(Math.abs( rel_move==2 )){	//----   undo castle move
			if(rel_move<0){
				Squares[Board.move_to-1].Piece_Ref = Squares[Board.move_to+2].Piece_Ref;	// --move rook back to left of king
				Squares[Board.move_to-1].Piece_Ref.position = Board.move_to-1;		//--assign original position
				Squares[Board.move_to+2].Piece_Ref = Board.NO_PIECE;		//---vacate rook
			}
			else{
				Squares[Board.move_to+1].Piece_Ref = Squares[Board.move_to-1].Piece_Ref;	// --move rook back to right of king
				Squares[Board.move_to+1].Piece_Ref.position = Board.move_to+1;			//--assign original position
				Squares[Board.move_to-1].Piece_Ref = Board.NO_PIECE;		//---vacate rook
			}

		}
		this.moves_made--;	
		return;
	}

	function kingCastleSearch(){
		let temp = [];
		if( this.moves_made || this.Player.in_check_by.length > 0 ){
			this.castle_moves[0] = false;
			this.castle_moves[1] = false;
		}
		else{
			if(Squares[this.position+3].Piece_Ref.piece == "rook" ){
				if(!Squares[this.position+1].Piece_Ref.piece && !(Squares[this.position+2].Piece_Ref.piece) ){
					if( !(this.castlePassesThroughCheck(2)) ){
						temp.push(2);
					}
				}
			}
			if(Squares[this.position-4].Piece_Ref.piece == "rook" ){
				if(!(Squares[this.position-1].Piece_Ref.piece) && !(Squares[this.position-2].Piece_Ref.piece) && !(Squares[this.position-3].Piece_Ref.piece) ){
					if(!(this.castlePassesThroughCheck(-2)) ){
						temp.push(-2);
					}
				}
			}
		}
		for(let i = 0; i < temp.length; i++){
			this.possible_moves.push(this.position+temp[i]);
		}
	}
	function castlePassesThroughCheck(m){
		let castle_array,can_move;
		castle_array = (m == 2) ? [this.position+1,this.position+2] : [this.position-1,this.position-2];
		can_move = castle_array.every(this.kingCanMove);
		if(can_move == true)
			return false;
		else
			return true;
	}
	function kingMoves(){
		let sq,temp;
		temp=[];
		for(let index in this.directions){
			if(Squares[this.position].Compass[this.directions[index]]){
				if(Squares[this.position].Compass[this.directions[index]][0].Piece_Ref.player_name != this.player_name){
					temp.push(Squares[this.position].Compass[this.directions[index]][0].index);
				}
			}	
		}
		temp=temp.filter(this.kingCanMove)
		this.possible_moves = temp;
		//========================  LOOK FOR POSSIBLE CASTLE MOVES  ==========================
		this.kingCastleSearch();
		return temp;	
	}

	function kingCanMove(m,i,a){
		if(Board.Selected_Piece.diagonalCheck(m) && Board.Selected_Piece.orthogonalCheck(m) && Board.Selected_Piece.knightCheck(m) && Board.Selected_Piece.pawnCheck(m) && Board.Selected_Piece.kingCheck(m))
			return true;
		else
			return false;
	}
	function diagonalCheck(square){
		let directions = ["NORTH_EAST","SOUTH_EAST","SOUTH_WEST","NORTH_WEST"];
		for(let i in directions){
			for(let sq in Squares[square].Compass[directions[i]]){
				if(!Squares[square].Compass[directions[i]][sq].Piece_Ref.player_name){
					continue;
				}
				else if(Squares[square].Compass[directions[i]][sq].Piece_Ref.player_name == this.player_name){
					if(Squares[square].Compass[directions[i]][sq].Piece_Ref.piece != "king"){
						break;
					}
					continue;
				}
				else{
					if(Squares[square].Compass[directions[i]][sq].Piece_Ref.piece == "bishop" || Squares[square].Compass[directions[i]][sq].Piece_Ref.piece == "queen"){
						return false;
					}
					break;
				}
			}
		}
		return true;	//  king can move
	}

	function orthogonalCheck(square){
		let directions=["NORTH","EAST","SOUTH","WEST"];
		for(let i in directions){
			for(let sq in Squares[square].Compass[directions[i]]){
				if(!Squares[square].Compass[directions[i]][sq].Piece_Ref.player_name){
					continue;
				}
				else if(Squares[square].Compass[directions[i]][sq].Piece_Ref.player_name == this.player_name){
					if(Squares[square].Compass[directions[i]][sq].Piece_Ref.piece != "king"){
						break;
					}
					continue;
				}
				else{
					if(Squares[square].Compass[directions[i]][sq].Piece_Ref.piece == "rook" || Squares[square].Compass[directions[i]][sq].Piece_Ref.piece == "queen"){
						return false;
					}
					break;
				}
			}
		}
		return true;	//---king can move
	}
	function knightCheck(square){
		for(let sq in Squares[square].Compass["KNIGHT"]){
			if(Squares[square].Compass["KNIGHT"][sq].Piece_Ref.piece=="knight" && Squares[square].Compass["KNIGHT"][sq].Piece_Ref.player_name == this.opp_name){
					return false;
			}
		}
		return true;
	}//--- END OF knightCheck ---

	function pawnCheck(square){ 
		let left = Board.Selected_Piece.player_name == 'white' ? -(BOARD_SIZE+1) : (BOARD_SIZE-1);
		let right = Board.Selected_Piece.player_name == 'white' ? -(BOARD_SIZE-1) : (BOARD_SIZE+1);

		if(square % BOARD_SIZE > 0){
			if(Squares[square+left].Piece_Ref.player_name == this.opp_name && Squares[square+left].Piece_Ref.piece == 'pawn'){
					return false;
			}
		}
		if(square % BOARD_SIZE < 7){
			if(Squares[square+right].Piece_Ref.player_name == this.opp_name && Squares[square+right].Piece_Ref.piece == 'pawn'){
					return false;
			}
		}
		return true;
	}	//	======================END pawnCheck function==================

	function kingCheck(square){
		let init_sq;
		let directions = ["NORTH","NORTH_EAST","EAST","SOUTH_EAST","SOUTH","SOUTH_WEST","WEST","NORTH_WEST"];
		for(let dir in directions){
			if(Squares[square].Compass[directions[dir]].length > 0){
				Adjacent_Square=Squares[square].Compass[directions[dir]][0];
				if(Adjacent_Square.Piece_Ref.piece == "king" && Adjacent_Square.Piece_Ref.player_name == this.opp_name){
						return false;
				}
			}
		}
		return true;
	}	//======  END kingCheck function  ======


}	// ======== END KING CLASS ===========
