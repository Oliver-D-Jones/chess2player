//========================================  GAME CLASS  =============================
function Game(num,c){
	this.moves = 0;
	this.move_to = null;
	this.move_from = null;
	this.number_of_players = parseInt(num);
	this.player_turn = ( c == "white" ? "white" : "black" );
	this.pawn_that_passed = null;
	this.passed_pawns = [];
	this.en_passant_index = -1;

	this.NO_PIECE = new No_Piece();

	this.Player_1 = new Player(c);
	this.Player_2 = new Player( (c == "white" ? "black" : "white") );

	this.Selected_Piece = this.NO_PIECE;
	this.Current_Piece_Selected = this.NO_PIECE;
	this.Captured_Piece = this.NO_PIECE;
	this.Player_1.Opponent = this.Player_2;
	this.Player_2.Opponent = this.Player_1;
	this.setupBoard = setupBoard;
	//this.undoMove = undoMove;
	this.analysis = null;
	this.getDirectionMod = getDirectionMod;
	
	function getDirectionMod(direction){
		switch( direction ){
			case "NORTH":
			case "SOUTH":
				return BOARD_SIZE;
			case "NORTH_EAST":
			case "SOUTH_WEST":
				return BOARD_SIZE - 1;
			case "SOUTH_EAST":
			case "NORTH_WEST":
				return BOARD_SIZE + 1;
			default:
				return 1;
		}
	}
	function No_Piece(){
		this.player_name = false
		this.position = false;
		this.piece = false;
	}
	function setupBoard(){
		//==========================================  BOARD_12 FOR LOOP ===========================
		for(let sq = 0; sq < BOARD_SIZE * BOARD_SIZE; sq++){
		
					Squares[sq].index = sq
					Squares[sq].Piece_Ref = this.NO_PIECE;
					Squares[sq].addEventListener('dblclick',move,false);
					Squares[sq].occupy = occupy;
					Squares[sq].vacate = vacate;
					Squares[sq].src = Squares[sq].className + ".jpg";
					let north = getNorth(sq,Squares);
					let north_east = getNorthEast(sq,Squares);
					let east = getEast(sq,Squares);
					let south_east = getSouthEast(sq,Squares);
					let south = getSouth(sq,Squares);
					let south_west = getSouthWest(sq,Squares);
					let west = getWest(sq,Squares);	
					let north_west = getNorthWest(sq,Squares);
					let knight = getKnight(sq,Squares);
					let w_pawn = getPawn(sq,"white",Squares);
					let b_pawn = getPawn(sq,"black",Squares);

					Squares[sq].Compass = {NORTH:north,NORTH_EAST:north_east,EAST:east,SOUTH_EAST:south_east,SOUTH:south,SOUTH_WEST:south_west,WEST:west,NORTH_WEST:north_west,KNIGHT:knight,WHITE_PAWN:w_pawn,BLACK_PAWN:b_pawn};
		}
		for(i in this.Player_1.Pieces){
			Squares[this.Player_1.Pieces[i].position].src = this.Player_1.Pieces[i].image;
			Squares[this.Player_2.Pieces[i].position].src = this.Player_2.Pieces[i].image;

			Squares[this.Player_1.Pieces[i].position].Piece_Ref = this.Player_1.Pieces[i];
			Squares[this.Player_2.Pieces[i].position].Piece_Ref = this.Player_2.Pieces[i];

			Squares[this.Player_1.Pieces[i].position].addEventListener('click',select,false);
			if( this.number_of_players == 2 )
				Squares[this.Player_2.Pieces[i].position].addEventListener('click',select,false);
			this.Player_1.Pieces[i].Own_King = this.Player_1.Pieces[15];
			this.Player_1.Pieces[i].Opp_King = this.Player_1.Opponent.Pieces[15];
			
			this.Player_2.Pieces[i].Own_King = this.Player_2.Pieces[15];
			this.Player_2.Pieces[i].Opp_King = this.Player_2.Opponent.Pieces[15];
		}
	}
}
//====================================PLAYER CLASS==============================

function Player(color){

	this.player_name = color;
	this.Pieces = new Array(16);

	this.in_check_vector = [];
	this.in_check_by = [];
	this.highlight_style = ( this.player_name == "white" ? "red":"blue" );
	this.moves_made = 0;

	this.computer = false;
	this.number_of_pieces = 16;

	let pawn_index = ( this.player_name == "white" ? 48 : 8 );
	let knight_index = ( this.player_name == "white" ? 57 : 1 );
	let bishop_index = ( this.player_name == "white" ? 58 : 2 );
	let rook_index = ( this.player_name == "white" ? 56 : 0 );
	let queen_index = ( this.player_name == "white" ? 59 : 3 );
	let king_index = ( this.player_name == "white" ? 60 : 4 );

	//-------------setup royals-------------------------------
	this.Pieces[15]=new King(this,king_index,15);
	this.Pieces[14]=new Queen(this,queen_index,14);
	//-------------setup pawns--------------------------------
	for(let i=0;i<8;i++){
		this.Pieces[i]=new Pawn(this,i+pawn_index,i);
	}

	//--------------setup rooks,bishops,knights---------------
	for(let rk=bp=kt=i=0;i<2;i++){
		this.Pieces[i+8]=new Knight(this,kt+knight_index,i+8)
		this.Pieces[i+10]=new Bishop(this,bp+bishop_index,i+10);
		this.Pieces[i+12]=new Rook(this,rk+rook_index,i+12);
		kt=5;bp=3;rk=7;
	}
	this.isGameOver = isGameOver;

	function isGameOver(){
		let o_Stored_Selected_Piece = Board.Selected_Piece;
			for(let i in this.Pieces){
				if( this.Pieces[i].piece ){							//---- if there is a piece
					if( this.in_check_vector.length > 1 ){
						i = 15;
					}
					Board.Selected_Piece = this.Pieces[i];
					Board.Selected_Piece.legalMoves();
					if( Board.Selected_Piece.possible_moves.length > 0 ){			//---- if there are possible moves
						Board.Selected_Piece = o_Stored_Selected_Piece;
						if( this.number_of_pieces > 2 || this.Opponent.number_of_pieces > 2 ){
							return false;	//--no draw and no mate	
						}
						else{	//--possible draw
							for( let j = 0; j < 8; j++){
								if( this.Pieces[j].piece || this.Opponent.Pieces[j].piece ){
									return false;				//---- no draw and no mate	
								}
							}
							for( j = 12; j < 15; j++){
								if( this.Pieces[j].piece || this.Opponent.Pieces[j].piece ){
									return false;				//---- no draw and no mate	
								}
							}
							//---if we get to here, there is a draw
							Board.analysis = "draw";
							return "draw" ;
						}
					}
				}
			
			}
			//----  if we get this far, there is a mate
			Board.Selected_Piece = o_Stored_Selected_Piece;
			if( this.in_check_vector.length > 0 ){
				Board.analysis = "checkmate" ;
				return "checkmate" ;
			}
			else{
				Board.analysis = "stalemate" ;
				return "stalemate" ;
			}
	}
}

//===================================PIECE CLASS==================================
function Piece(Player,pos,pieces_index){

	this.Player = Player;
	this.position = pos;
	this.pieces_index = pieces_index;

	this.player_name = Player.player_name;
	this.opp_name = this.player_name=="white" ? "black" : "white";

	this.possible_moves = [];

	this.highlightPiece = highlightPiece;
	this.unHighlightPiece = unHighlightPiece;

	this.showMoves=showMoves;
	this.hideMoves=hideMoves;

	this.placesOppKingInCheck=placesOppKingInCheck;

	this.searchForDiscoverCheckVector=searchForDiscoverCheckVector;
	this.placesOwnKingInCheck=placesOwnKingInCheck;
	this.resolvePlacesKingInCheck=resolvePlacesKingInCheck;
	this.resolveKingInCheck = resolveKingInCheck;
	this.orthoDiagMoves=orthoDiagMoves;
	this.pieceKingOnDiag=pieceKingOnDiag;
	this.pieceKingOnOrtho=pieceKingOnOrtho;
	this.movePiece=function(){	return	};
	this.undoMove=function (){	return	};

	this.xValue=function(){return this.position % BOARD_SIZE};

	this.yValue=function(){return Math.floor(this.position / BOARD_SIZE)};

	function orthoDiagMoves(){		// --------- moves for bishop, rook , queen
		let temp=[];
		let square,dir,index;
		
		for( index in this.directions ){
			for( square in Squares[this.position].Compass[this.directions[index]] ){
				if(!Squares[this.position].Compass[this.directions[index]][square].Piece_Ref.piece){
					temp.push(Squares[this.position].Compass[this.directions[index]][square].index);
					continue;
				}
				else if(Squares[this.position].Compass[this.directions[index]][square].Piece_Ref.player_name==this.opp_name){
					temp.push(Squares[this.position].Compass[this.directions[index]][square].index);
					break;
				}
				break;
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

	function pieceKingOnOrtho(p_pos,k_pos){
		let king_x,king_y,piece_x,piece_y;
		king_x= (k_pos % BOARD_SIZE);
		king_y= Math.floor(k_pos / BOARD_SIZE);
		piece_x= (p_pos % BOARD_SIZE);
		piece_y= Math.floor(p_pos / BOARD_SIZE);

		if(king_x == piece_x){
			if(king_y < piece_y)
				return "SOUTH";
			else
				return "NORTH";
		}
		else if(king_y == piece_y){
			if(king_x < piece_x)
				return "EAST";
			else
				return "WEST";
		}
		return false;

	}
	function pieceKingOnDiag(p_pos,k_pos){
		let king_x,king_y,piece_x,piece_y;
		king_x= (k_pos % BOARD_SIZE);
		king_y= Math.floor(k_pos / BOARD_SIZE);
		piece_x= (p_pos % BOARD_SIZE);
		piece_y= Math.floor(p_pos / BOARD_SIZE);

		if( Math.abs(king_x - piece_x) == Math.abs(king_y-piece_y) ){
			if(king_x < piece_x){
				if(king_y<piece_y)
					return "SOUTH_EAST";
				else
					return "NORTH_EAST";
			}
			else
				if(king_y < piece_y)
					return "SOUTH_WEST";
				else
					return "NORTH_WEST";
		}
		return false;
	}
	function placesOppKingInCheck(){};
	
	function searchForDiscoverCheckVector(direction){
		let vector = [];
		let other_piece = ( direction.length > 5 ? "bishop" : "rook" );
		for(let square in Squares[this.Opp_King.position].Compass[direction]){
			if(!Squares[this.Opp_King.position].Compass[direction][square].Piece_Ref.piece){
				vector.push(Squares[this.Opp_King.position].Compass[direction][square].index);
				continue;
			}
			else if(Squares[this.Opp_King.position].Compass[direction][square].Piece_Ref.player_name == this.player_name){
				if(Squares[this.Opp_King.position].Compass[direction][square].Piece_Ref.piece == other_piece || Squares[this.Opp_King.position].Compass[direction][square].Piece_Ref.piece == "queen"){
					vector.push(Squares[this.Opp_King.position].Compass[direction][square].index);
					this.Opp_King.Player.in_check_by.push(Squares[this.Opp_King.position].Compass[direction][square].Piece_Ref);
					this.Opp_King.Player.in_check_vector.push(vector);
				}
			}
			return false;
		}
	}
	function resolveKingInCheck(moves){ 	//  ===== param moves is the temp array in legalMoves function
		let resolve = [],sq,m;
		for( sq = 0; sq < this.Player.in_check_vector[0].length; sq++ ){
			for( m = 0; m < moves.length; m++){
				if( this.Player.in_check_vector[0][sq] == moves[m] ){
					resolve.push( moves[m] );
				}
			}
		}
		return resolve;
	}
	function showMoves(){
		for(let i in this.possible_moves){
			Squares[this.possible_moves[i]].style.backgroundColor = Board.Selected_Piece.Player.highlight_style;
		}
	}
	function hideMoves(){
		for(let i in this.possible_moves){
			Squares[this.possible_moves[i]].style.backgroundColor = Squares[this.possible_moves[i]].className;
		}
	}
	function highlightPiece(){
		Squares[this.position].style.backgroundColor = Board.Selected_Piece.Player.highlight_style;
	}
	function unHighlightPiece(){
		Squares[this.position].style.backgroundColor = Squares[this.position].className;
	}

	function resolvePlacesKingInCheck(dir,moves){

		if(dir == "EAST" || dir == "WEST"){
			return moves.filter(horizontal,this);
		}
		else{
			let dir_mod= Board.getDirectionMod(dir);
			return moves.filter(non_horizontal,this);
		}
	
		//=============================  HELPER FUNCTIONS  ============================================
			function horizontal(v){
				return 	( Math.abs(v-this.position) < BOARD_SIZE -1 );
			}
	
			function non_horizontal(v){
				return ( (v - this.position) % dir_mod == 0 );
			}
		//==============================  END OF HELPER FUNCTIONS  =============================================================
	}
	function placesOwnKingInCheck(){
		let exposed= false;
		let inline= this.pieceKingOnOrtho(this.position,this.Own_King.position);
		if(!inline)
			inline= this.pieceKingOnDiag(this.position,this.Own_King.position);
		if(!inline)
			return false;
		//=========  SEARCH BEHIND PIECE FOR OPEN KING  ===============
		for(let square in Squares[this.Own_King.position].Compass[inline]){
			if(!Squares[this.Own_King.position].Compass[inline][square].Piece_Ref.piece){
				continue;
			}
			else if(Squares[this.Own_King.position].Compass[inline][square].Piece_Ref.player_name == this.player_name){
				if(Squares[this.Own_King.position].Compass[inline][square].index == this.position){
					exposed = true;
				}
			}
			break;
		}
		//======== SEARCH IN FRONT OF PIECE FOR ATTACKING OPPONENT ===========
		if(exposed){
			let other_piece= inline.length > 5 ? "bishop" : "rook" ;
			for(let square in Squares[this.position].Compass[inline]){
				if(!Squares[this.position].Compass[inline][square].Piece_Ref.piece){
					continue;
				}
				else if(Squares[this.position].Compass[inline][square].Piece_Ref.player_name == this.opp_name){
					if(Squares[this.position].Compass[inline][square].Piece_Ref.piece == other_piece || Squares[this.position].Compass[inline][square].Piece_Ref.piece == "queen"){
						return inline;
					}
				}
				return false;
			}
		}
	}

}//==========END OF PIECE CLASS
//==========================================MAIN CLASS=============================
