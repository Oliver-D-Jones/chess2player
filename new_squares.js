
let B_S=BOARD_SIZE;

function getNorth(index,OBJ){
	let a=[]; let c=1;
	while(index - (B_S * c) > -1){
		a.push(OBJ[index - (B_S * c)]);
		c++
	}
	if(a.length>0) 
		return a;
	else
		return false;
}
function getNorthEast(index,OBJ){
	let a=[]; let c=1;
	while(index - (B_S - 1) * c > 0 && (index - (B_S-1)*c) % B_S > 0){
		a.push(OBJ[index - (B_S - 1) * c]);
		c++;
	}
	if(a.length>0) 
		return a;
	else
		return false;
}
function getEast(index,OBJ){
	let a=[]; let c=1;
	while((index + c) % B_S > 0){
		a.push(OBJ[index+c]);
		c++;
	}
	if(a.length>0) 
		return a;
	else
		return false;
}

function getSouthEast(index,OBJ){
	let a=[]; let c=1;
	while(index + (B_S + 1) * c < B_S * B_S && (index + (B_S + 1) * c) % B_S > 0){
		a.push(OBJ[index + (B_S + 1) * c]);
		c++
	}
	if(a.length>0) 
		return a;
	else
		return false;
}
function getSouth(index,OBJ){
	let a=[]; let c=1;
	while(index + B_S * c < B_S * B_S){
		a.push(OBJ[index + B_S * c]);
		c++;
	}
	if(a.length>0) 
		return a;
	else
		return false;
}
function getSouthWest(index,OBJ){
	let a=[]; let c=1;
	while(index + (B_S - 1) * c <B_S * B_S && (index + (B_S - 1) * c) % B_S < B_S-1){
		a.push(OBJ[index + (B_S - 1) * c]);
		c++;
	}
	if(a.length>0) 
		return a;
	else
		return false;
}
function getWest(index,OBJ){
	let a=[]; let c= -1;
	while((index + c) % B_S < B_S -1 && (index + c) > 0){
		a.push(OBJ[index + c]);
		c--;
	}

	if(a.length>0) 
		return a;
	else
		return false;
}
function getNorthWest(index,OBJ){
	let a=[]; let c=1;
	while((index - (B_S + 1) * c) >= 0 && (index - (B_S + 1) * c) % B_S < B_S -1){
		a.push(OBJ[index - (B_S + 1) * c]);
		c++;
	}
	if(a.length>0) 
		return a;
	else
		return false;
}
function getKnight(index,OBJ){
	//let moves=[-17,-15,-10,-6,6,10,15,17];
	let moves=[-(2*B_S+1),-(2*B_S-1),-(B_S+2),-(B_S-2),(B_S-2),(B_S+2),(2*B_S-1),(2*B_S+1)];
	let ords=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
	let a=[];
	let to;
	for(let i in moves){
		to=index + moves[i];
		if( to >=0 && to < B_S * B_S ){
			if( (Math.floor(to/B_S)- Math.floor(index/B_S) == ords[i][0] ) &&  (to % B_S - index % B_S)  == ords[i][1] )
				a.push(OBJ[to]);
		}
	}
	if(a.length>0) 
		return a;
	else
		return false;
}
function getPawn(index,color,OBJ){
	let m=[];
	let a=[];
	if(color=="white"){
		if(index < B_S *B_S - 2*B_S && index > B_S-1){
			m.push(OBJ[index-B_S]);
			
			if(index%B_S==0)
				a.push(OBJ[index-B_S+1]);
			else if(index % B_S==B_S-1)
				a.push(OBJ[index-B_S-1]);
			else{
				a.push(OBJ[index-B_S-1]);
				a.push(OBJ[index-B_S+1]);
			}
		}
		else if(index>=B_S *B_S - 2*B_S  && index < B_S*B_S - B_S){
			m.push(OBJ[index-B_S]);
			m.push(OBJ[index-2*B_S]);
			if(index%B_S==0)
				a.push(OBJ[index-B_S+1]);
			else if(index % B_S==B_S-1)
				a.push(OBJ[index-B_S-1]);
			else{
				a.push(OBJ[index-B_S-1]);
				a.push(OBJ[index-B_S+1]);
			}
			
		}
	}
	else{
		if(index>15 && index<56){
			m.push(OBJ[index+B_S]);
			if(index%B_S==0)
				a.push(OBJ[index+B_S+1]);
			else if(index%B_S==B_S-1)
				a.push(OBJ[index+B_S-1]);
			else{
				a.push(OBJ[index+B_S-1]);
				a.push(OBJ[index+B_S+1]);
			}
		}
		else if(index>7 && index<=15){
			m.push(OBJ[index+B_S]);
			m.push(OBJ[index+2*B_S]);
			if(index%B_S==0)
				a.push(OBJ[index+B_S+1]);
			else if(index%B_S==B_S-1)
				a.push(OBJ[index+B_S-1]);
			else{
				a.push(OBJ[index+B_S-1]);
				a.push(OBJ[index+B_S+1]);
			}
		}
	}

	return [m,a];	
}
