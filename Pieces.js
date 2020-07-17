function Knight(Player,pos,pieces_index){
	this.piece="knight";
	this.Piece_Con=Piece;
	this.Piece_Con(Player,pos,pieces_index);
	this.image=this.player_name=="white"?'w_knight.jpg':'b_knight.jpg';
	this.value=9;
	this.directions=["KNIGHT"]
	this.legalMoves=knightMoves;
	this.movePiece=moveKnight;
	this.undoMove=undoKnightMove;
	this.placesOppKingInCheck=knightPlacesOppKingInCheck;

	function knightMoves(){
		let dir,square,index;
		let temp=[];

		for( index in this.directions ){
			for( square in Squares[this.position].Compass[this.directions[index]] ){
				if( Squares[this.position].Compass[this.directions[index]][square].Piece_Ref.player_name != this.player_name ){
					temp.push( Squares[this.position].Compass[this.directions[index]][square].index );
					continue;
				}
			}
		}
		if( dir = this.placesOwnKingInCheck() ){
			temp=this.resolvePlacesKingInCheck(dir,temp);
		}

		if( this.Player.in_check_vector.length == 1 ){
			temp = this.resolveKingInCheck(temp);
		}
		this.possible_moves = temp;
		return temp;
	}

	function knightPlacesOppKingInCheck(){
		//===============================  LOOK FOR KNIGHT PLACES OPP KING IN CHECK  ==================================
		for(let square in Squares[this.position].Compass["KNIGHT"]){
			if(Squares[this.position].Compass["KNIGHT"][square].Piece_Ref.player_name == this.opp_name && Squares[this.position].Compass["KNIGHT"][square].Piece_Ref.piece == "king"){
				this.Player.Opponent.in_check_by.push(this);
				this.Player.Opponent.in_check_vector.push([this.position]);
			}
		}
		//===============================  LOOK FOR KNIGHT PLACES OPP KING IN DISCOVER CHECK  ===========================
		let mfk=this.pieceKingOnOrtho(Board.move_from,this.Opp_King.position);
		if(!mfk)
			mfk=this.pieceKingOnDiag(Board.move_from,this.Opp_King.position);
		if(mfk)
			this.searchForDiscoverCheckVector(mfk);
	}
	function moveKnight(){
		this.position=Board.move_to;	//---update its new position,Board.move_from would be its original
		this.placesOppKingInCheck();
		this.moves_made++;
	}
	function undoKnightMove(){
		this.position=Board.move_from;
		this.moves_made--;
		return;
	}

}


function Bishop(Player,pos,pieces_index){
	this.piece="bishop";
	this.Piece_Con=Piece;
	this.Piece_Con(Player,pos,pieces_index);
	this.image=this.player_name=="white"?'w_bishop.jpg':'b_bishop.jpg';

	this.value=10;
	this.directions=["NORTH_EAST","SOUTH_EAST","SOUTH_WEST","NORTH_WEST"];


	this.legalMoves=this.orthoDiagMoves;
	this.placesOppKingInCheck=bishopPlacesOppKingInCheck;
	this.movePiece=moveBishop;
	this.undoMove=undoBishopMove;
	function moveBishop(){
		this.position=Board.move_to;	//---update its new position,Board.move_from would be its original
		this.placesOppKingInCheck();
		this.moves_made++;
	}
	function undoBishopMove(){
		this.position=Board.move_from;
		this.moves_made--;
		return;
	}


	function bishopPlacesOppKingInCheck(){
		let square,mfk,mtk_diag;
		let vector=[];
		let king_pos=this.Opp_King.position;
		//===============================  LOOK FOR BISHOP PLACES OPP KING IN CHECK  ==================================
		if(mtk_diag=this.pieceKingOnDiag(this.position,king_pos)){

			for(square in Squares[king_pos].Compass[mtk_diag]){

				if(!Squares[king_pos].Compass[mtk_diag][square].Piece_Ref.piece){

					vector.push(Squares[king_pos].Compass[mtk_diag][square].index);
					continue;
				}
				else if(Squares[king_pos].Compass[mtk_diag][square].index == this.position){
					vector.push(this.position);
					this.Player.Opponent.in_check_by.push(this);
					this.Player.Opponent.in_check_vector.push(vector);
				}
				break;
			}
			
		}
		//===============================  LOOK FOR BISHOP PLACES OPP KING IN DISCOVER CHECK  ===========================
		mfk=this.pieceKingOnOrtho(Board.move_from,this.Opp_King.position);
		if(mfk)
			this.searchForDiscoverCheckVector(mfk);
	}
	

}
function Rook(Player,pos,pieces_index){
	this.piece="rook";
	this.Piece_Con=Piece;
	this.Piece_Con(Player,pos,pieces_index);
	this.image=this.player_name=="white"?'w_rook.jpg':'b_rook.jpg';

	this.value=15;
	this.directions=["NORTH","EAST","SOUTH","WEST"];


	this.legalMoves=this.orthoDiagMoves;
	this.placesOppKingInCheck=rookPlacesOppKingInCheck;
	this.movePiece=moveRook;
	this.undoMove=undoRookMove;
	function moveRook(){
		this.position=Board.move_to;	//---update its new position,Board.move_from would be its original
		this.placesOppKingInCheck();
		this.moves_made++;
	}
	function undoRookMove(){
		this.position=Board.move_from;
		this.moves_made--;
		return;
	}

	function rookPlacesOppKingInCheck(){
		let square,mfk,mtk_ortho;
		let vector=[];
		let king_pos=this.Player.Opponent.Pieces[15].position;
		//===============================  LOOK FOR ROOK PLACES OPP KING IN CHECK  ==================================
		mtk_ortho=this.pieceKingOnOrtho(this.position,king_pos);
		if(mtk_ortho){
			for(square in Squares[king_pos].Compass[mtk_ortho]){

				if(!Squares[king_pos].Compass[mtk_ortho][square].Piece_Ref.piece){

					vector.push(Squares[king_pos].Compass[mtk_ortho][square].index);
					continue;
				}
				else if(Squares[king_pos].Compass[mtk_ortho][square].index == this.position){
					vector.push(this.position);
					this.Player.Opponent.in_check_by.push(this);
					this.Player.Opponent.in_check_vector.push(vector);
				}
				break;
			}
		}
		//===============================  LOOK FOR ROOK PLACES OPP KING IN DISCOVER CHECK  ===========================
		mfk=this.pieceKingOnDiag(Board.move_from,this.Opp_King.position);
		if(mfk)
			this.searchForDiscoverCheckVector(mfk);
	}
}
function Queen(Player,pos,pieces_index){
	this.piece="queen";
	this.Piece_Con=Piece;
	this.Piece_Con(Player,pos,pieces_index);
	this.image=this.player_name=="white"?'w_queen.jpg':'b_queen.jpg';

	this.value=29;
	this.directions=["NORTH","NORTH_EAST","EAST","SOUTH_EAST","SOUTH","SOUTH_WEST","WEST","NORTH_WEST"];
	this.legalMoves=this.orthoDiagMoves;
	this.movePiece=moveQueen;
	this.undoMove=undoQueenMove;
	this.placesOppKingInCheck=queenPlacesOppKingInCheck;

	function moveQueen(){
		this.position=Board.move_to;	//---update its new position,Board.move_from would be its original
		this.placesOppKingInCheck();
		this.moves_made++;
	}
	function undoQueenMove(){
		this.position=Board.move_from;
		this.moves_made--;
		return;
	}

	function queenPlacesOppKingInCheck(){
		let square,mtk_ortho,mtk_diag;
		let vector=[];
		let king_pos=this.Opp_King.position;
		//===============================  LOOK FOR QUEEN PLACES OPP KING IN CHECK  ==================================
		if( mtk_ortho= this.pieceKingOnOrtho(this.position,king_pos) ){
			for(square in Squares[king_pos].Compass[mtk_ortho]){

				if(!Squares[king_pos].Compass[mtk_ortho][square].Piece_Ref.piece){

					vector.push(Squares[king_pos].Compass[mtk_ortho][square].index);
					continue;
				}
				else if(Squares[king_pos].Compass[mtk_ortho][square].index == this.position){
						vector.push(this.position);
						this.Player.Opponent.in_check_by.push(this);
						this.Player.Opponent.in_check_vector.push(vector);
				}
				break;
			}
		}
		else if( mtk_diag=this.pieceKingOnDiag(this.position,king_pos) ){

			for(square in Squares[king_pos].Compass[mtk_diag]){

				if(!Squares[king_pos].Compass[mtk_diag][square].Piece_Ref.piece){

					vector.push(Squares[king_pos].Compass[mtk_diag][square].index);
					continue;
				}
				else if(Squares[king_pos].Compass[mtk_diag][square].index == this.position){
					vector.push(this.position);
					this.Player.Opponent.in_check_by.push(this);
					this.Player.Opponent.in_check_vector.push(vector);
				}
				break;
			}
			
		}
	}
}
