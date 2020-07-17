//===========================================PAWN CLASS=============================

function Pawn(Player,pos,pieces_index){
	this.piece="pawn";
	this.Piece_Con=Piece;
	this.Piece_Con(Player,pos,pieces_index);
	this.image=this.player_name=="white"?'w_pawn.jpg':'b_pawn.jpg';
	
	this.value=3;

	this.en_passant_index=-1;
	this.en_passant_left=false;
	this.en_passant_right=false;

	this.legalMoves=pawnMoves;
	this.movePiece=movePawn;
	this.undoMove=undoPawnMove;
	this.pawnAscend=pawnAscend;
	this.placesOppKingInCheck = pawnPlacesOppKingInCheck;

	function pawnMoves(){
		let dir;
		let temp=[];
		let player = this.player_name=="white" ? "WHITE_PAWN" : "BLACK_PAWN";

		for(let square in Squares[this.position].Compass[player][0]){
			if(!Squares[this.position].Compass[player][0][square].Piece_Ref.piece){
				temp.push(Squares[this.position].Compass[player][0][square].index);
			}
			else
				break;
		}
		for(square in Squares[this.position].Compass[player][1]){
			if(Squares[this.position].Compass[player][1][square].Piece_Ref.player_name == this.opp_name){
				temp.push(Squares[this.position].Compass[player][1][square].index);
			}
		}
		if(Board.en_passant_index == Board.moves){
			let en_passant_square= this.player_name == "white" ? -8 : 8 ;
			for( let p in Board.passed_pawns ){
				if(Board.passed_pawns[p].position == this.position ){
					temp.push(Board.pawn_that_passed.position + en_passant_square );
				}

			}
		}
		if( dir = this.placesOwnKingInCheck() ){
			temp = this.resolvePlacesKingInCheck(dir,temp);
		}
		if( this.Player.in_check_vector.length == 1 ){
			temp = this.resolveKingInCheck(temp);
		}
		this.possible_moves = temp;

		return temp;

	}

	function pawnPlacesOppKingInCheck(){
		
		let player = this.player_name=="white" ? "WHITE_PAWN" : "BLACK_PAWN";
//===============================  LOOK FOR PAWN PLACES OPP KING IN CHECK  ==================================
		for(let square in Squares[this.position].Compass[player][1]){ 
			if(Squares[this.position].Compass[player][1][square].Piece_Ref.player_name==this.opp_name && Squares[this.position].Compass[player][1][square].Piece_Ref.piece == "king"){
				this.Player.Opponent.in_check_by.push([this]);
				this.Player.Opponent.in_check_vector.push([this.position]);
			}
		}

//===============================  LOOK FOR PAWN MAKING A DISCOVER CHECK ON OPP KING  =========================
		let mfk=this.pieceKingOnOrtho(Board.move_from,this.Opp_King.position);

		if(!mfk)
			mfk=this.pieceKingOnDiag(Board.move_from,this.Opp_King.position);
		if(mfk)
			this.searchForDiscoverCheckVector(mfk);
	}
	function movePawn(){
		let rel_move,p_index,ascend_index,left,right;
		this.position=Board.move_to;			//---update its new position,Board.move_from would be its original
		this.placesOppKingInCheck();
		rel_move=Board.move_to-Board.move_from;
		ascend_index=this.player_name=="white"?0:7;
		left=this.player_name=="white"?-(BOARD_SIZE+1):(BOARD_SIZE-1);
		right=this.player_name=="white"?-(BOARD_SIZE-1):(BOARD_SIZE+1);

//---------------   look for possible en passant and assign properties to opponent's pawns en passanted   --------------------------
		
		if(Math.abs(rel_move)==16){	
			if(Squares[this.position-1].Piece_Ref.player_name==this.opp_name && Squares[this.position-1].Piece_Ref.piece=="pawn" && this.position % BOARD_SIZE > 0 ){//---en passant
				Board.en_passant_index=Board.moves+1;
				Board.passed_pawns.push(Squares[this.position-1].Piece_Ref);
				Board.pawn_that_passed=this;
			}
			if(Squares[this.position+1].Piece_Ref.player_name==this.opp_name && Squares[this.position+1].Piece_Ref.piece=="pawn" && this.position % BOARD_SIZE < 7 ){//---en passant
				Board.en_passant_index=Board.moves+1;
				Board.passed_pawns.push(Squares[this.position+1].Piece_Ref);
				Board.pawn_that_passed=this;
			}
		}
//--------------------  look for ascendency  ---------------------------------
		else if(this.yValue()==ascend_index){
			this.pawnAscend();
		}
		else if ( !(rel_move % BOARD_SIZE) ){
					//--- if simple move forword by 8
		}
		else{
			let en_passant_ref = this.player_name == "white" ? -8 : 8 ;
			//------ if captured en passant pieces
			if( Board.en_passant_index == Board.moves && (Board.pawn_that_passed.position == this.position - en_passant_ref )){
				if(rel_move == left){
					p_index = -1;
				}
				else if(rel_move == right){
					p_index = 1;
				}
				if(p_index){
					Board.Captured_Piece=Squares[Board.move_from+p_index].Piece_Ref;
					Board.Captured_Piece.Player.Pieces[Board.Captured_Piece.pieces_index]=Board.NO_PIECE;
					Board.Captured_Piece.Player.number_of_pieces--;
					Squares[Board.move_from+p_index].Piece_Ref=Board.NO_PIECE;
					if(!Board.computers_turn){
						Squares[Board.move_from+p_index].src= Squares[Board.move_from+p_index].className + ".jpg";
					}
				}
			}
		}
		this.moves_made++;
	}
	function undoPawnMove(){
	
		if(Math.abs(Board.move_to-Board.move_from)==24){	//-----  undo possible en passant

			if(Squares[Board.move_from+1].Piece_Ref.player_name==this.opp_name && Squares[Board.move_from+1].Piece_Ref.piece=="pawn"){
					Squares[Board.move_from+1].Piece_Ref.en_passant_left=false;
					Squares[Board.move_from+1].Piece_Ref.en_passant_right=false;
			}
			if(Squares[Board.move_from-1].Piece_Ref.player_name==this.opp_name && Squares[Board.move_from-1].Piece_Ref.piece=="pawn"){
					Squares[Board.move_from-1].Piece_Ref.en_passant_left=false;
					Squares[Board.move_from-1].Piece_Ref.en_passant_right=false;
			}
		}
		if(this.yValue()==0 || this.yValue()==7){	//-----undo possible ascend
			let Reset_Pawn=new Pawn(this.Player,Board.move_from,this.pieces_index);
			this.Player.Pieces[this.pieces_index]=Reset_Pawn;
			Squares[Board.move_from].Piece_Ref=Reset_Pawn;
		}
		this.position=Board.move_from;
		this.moves_made--;

		return;

	}
	function pawnAscend(){
		let NewPiece,ascendant_piece;

		ascendant_piece=prompt("Type your new piece! \n(queen,rook,bishop, or knight)","queen");
		ascendant_piece=ascendant_piece.toLowerCase();
		
		if(ascendant_piece=="queen"){
			NewPiece=new Queen(this.Player,this.position,this.pieces_index);
		}
		else if(ascendant_piece=="rook"){
			NewPiece=new Rook(this.Player,this.position,this.pieces_index);
			NewPiece.moved=true;
		}
		else if(ascendant_piece=="knight"){
			NewPiece=new Knight(this.Player,this.position,this.pieces_index);
		}
		else if(ascendant_piece=="bishop"){
			NewPiece=new Bishop(this.Player,this.position,this.pieces_index);
		}
		else{
			NewPiece=new Queen(this.Player,this.position,this.pieces_index);
		}
		NewPiece.Own_King = this.Player.Pieces[15];
		NewPiece.Opp_King = this.Player.Opponent.Pieces[15];

		this.Player.Pieces[this.pieces_index] = NewPiece;

		Squares[this.position].Piece_Ref=NewPiece;
		Squares[this.position].src=NewPiece.image;

		this.Player.Pieces[this.pieces_index].placesOppKingInCheck();
	}

}