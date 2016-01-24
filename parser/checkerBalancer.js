var childProcess=require('child_process');
var children=[];
var threads=4;//Кол-во ядер проца, можно править
var childrenFinished=0;
for(var i=0; i<threads; i++){
	children[i] = childProcess.fork(__dirname + '/checkerProcess.js');
	children[i].on('message', function (m) {
		switch(m.type){
			case 'quantity':
				totalQuantity+=m.quantity;
				childrenFinished++;
				if(childrenFinished==threads){
					process.send({
						type: 'quantity',
						quantity: totalQuantity,
					});
					process.exit();
				}
			break;
			case 'mistake':
				process.send(m);
			break;
		}
	});
}
var textsReceived=0;
var totalQuantity=0;

process.on('message', function (m) {
	switch(m.type){
		case 'checktext':
			children[textsReceived % threads].send(m);
			textsReceived++;
		break;
		case 'init':
			for(var i=0; i<threads; i++){
				children[i].send(m);
			}
		break;
		case 'finish':
			for(var i=0; i<threads; i++){
				children[i].send(m);
			}
		break;
	}
});
