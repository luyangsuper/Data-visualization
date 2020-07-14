function drawCell(){
	let ctx1 = document.getElementById('floor1fg').getContext('2d');
	let ctx2 = document.getElementById('floor2fg').getContext('2d');
	ctx1.clearRect(0,0,width,height);
	ctx2.clearRect(0,0,width,height);
	for(let x=0;x<30;x++){//遍历地图每个小方块，绘制颜色
		for(let y=0;y<16;y++){
			ctx1.fillStyle = people['floor1'][x][y][1];
			ctx2.fillStyle = people['floor2'][x][y][1];
			ctx1.fillRect(x*sideLength,y*sideLength,sideLength,sideLength);
			ctx2.fillRect(x*sideLength,y*sideLength,sideLength,sideLength);
		}
	}
}
function updateLinechartData(time){//更新折线图
	let sum;//统计主会场人数
	let x;
	let y;
	for(x=19,sum=0;x<29;x++){//主会场
		for(y=2;y<12;y++){
			sum += people['floor1'][x][y][0];
		}
	}
	data['main'][0].push(sum);

	for(x=1,sum=0;x<6;x++){//分会场A
		for(y=2;y<4;y++){
			sum += people['floor1'][x][y][0];
		}
	}
	data['A'][0].push(sum);

	for(x=1,sum=0;x<6;x++){//分会场B
		for(y=4;y<6;y++){
			sum += people['floor1'][x][y][0];
		}
	}
	data['B'][0].push(sum);

	for(x=1,sum=0;x<6;x++){//分会场C
		for(y=6;y<8;y++){
			sum += people['floor1'][x][y][0];
		}
	}
	data['C'][0].push(sum);

	for(x=1,sum=0;x<6;x++){//分会场D
		for(y=8;y<10;y++){
			sum += people['floor1'][x][y][0];
		}
	}
	data['D'][0].push(sum);

	for(x=15,sum=0;x<19;x++){//展厅
		for(y=2;y<12;y++){
			sum += people['floor1'][x][y][0];
		}
	}
	data['exhibitionHall'][0].push(sum);

	for(x=7,sum=0;x<9;x++){//海报区
		for(y=3;y<10;y++){
			sum += people['floor1'][x][y][0];
		}
	}
	data['posterArea'][0].push(sum);

	for(x=1,sum=0;x<6;x++){//餐厅
		for(y=2;y<10;y++){
			sum += people['floor2'][x][y][0];
		}
	}
	data['diningHall'][0].push(sum);

	data_time.push(time);
}
function updateLinechart(){
	mylineChart.setOption({
		xAxis: {
			data: data_time
		},
        series: [{
            data: data['main'][0]
        },{
        	data: data['A'][0]
        },{
        	data: data['B'][0]
        },{
        	data: data['C'][0]
        },{
        	data: data['D'][0]
        },{
        	data: data['exhibitionHall'][0]
        },{
        	data: data['posterArea'][0]
        },{
        	data: data['diningHall'][0]
        }]
    })
}
function getTravelData(id_travel){
	let xhr = new XMLHttpRequest();
	xhr.onload = function handleData(){
		let csvfile = xhr.responseText;
		csv = csvfile.split('\n');
		map1fgctx.clearRect(0,0,width,height);
		map2fgctx.clearRect(0,0,width,height);
		map1fgctx.font = "10px sans-serif";
		map2fgctx.font = "10px sans-serif";
		s = 0;
		data_floor1.length = 0;//清空数组
		data_floor2.length = 0;
		drawTravel();
	}
	xhr.open('GET',id_travel);
	xhr.send();
}
function drawTravel(){
	let item = csv[s].split(',');
	let floor = parseInt(item[0]);
	// console.log(floor);
	let x = parseInt(item[1]);
	let y3Dbar = parseInt(item[2]);
	let yReal = parseInt(16 - item[2]);//为了方便显示在3Dbar上，之前真正的y被处理了，现在变回来，y现 = itme[2] ;y现 = 16 - y真 ；所以 y真 = 16 - y现 
	let time = parseInt(item[3]);
	if(floor === 1){
		data_floor1.push([x,y3Dbar-1,time]);
		map1fgctx.fillStyle = '#2ecc71';
		map1fgctx.fillRect(x*sideLength,yReal*sideLength,sideLength,sideLength);
		map1fgctx.fillStyle = 'white';
		map1fgctx.fillText(String(s+1),x*sideLength+3,yReal*sideLength+17);
	}else{
		data_floor2.push([x,y3Dbar-1,time]);
		map2fgctx.fillStyle = '#2ecc71';
		map2fgctx.fillRect(x*sideLength,yReal*sideLength,sideLength,sideLength);
		map2fgctx.fillStyle = 'white';
		map2fgctx.fillText(String(s+1),x*sideLength+3,yReal*sideLength+17);
	}
	draw3Dbar();
	s += 1;
	turn2 = requestAnimationFrame(drawTravel);
	if(s > csv.length-2){
		cancelAnimationFrame(turn2)
	}
}
function removeElementLi(){
	let div = document.getElementById('id_list');
	let list = div.childNodes;
	let len = list.length;
	if(len > 0){
		for(let j=0;j<len;j++){
			div.removeChild(list[j]);
			j --;
		}
		console.log('ok');
	}
}
function addElementLi(area){
　　	let div = document.getElementById('id_list');
　　//添加 li
	let item = data[area][1];
	for(let j=0;j<data[area][1].length;j++){
		let li = document.createElement("li");
		let id = item[j];
		if(id === '16632'){
			li.setAttribute("style","background:red;");
		}if(id === '11260'){
			li.setAttribute("style","background:red;");
		}
		li.setAttribute("id",id);
　　    li.innerHTML = 'id: ' + id;
　　    div.appendChild(li);	
	}
}
function load(file_name){
    let xhr = new XMLHttpRequest();
	xhr.onload = function handleData(){
		let csvfile = xhr.responseText;
		csv = csvfile.split('\n');
		countPeople();
	}
	xhr.open('GET',file_name);
	xhr.send();
}
function selectId(){
	let div = document.getElementById('id_list');
	div.addEventListener('click',function(e){
		// getTravelData(id_travel)
		let file_name = 'data//day' + day + '_3Dtravel//' + e.target.id + '.csv';
		getTravelData(file_name);
	})
}
function countPeople(){
	// csv.length-1;
	let theTime = 0;
	for(let j=0;j<100;j++){
		i += 1;
		if(i>csv.length-2){
			break;
		}
		let item = csv[i].split(',');
		let id = item[0];
		let sid = item[1];
		let time = item[2];
		theTime = formatSeconds(time);//把秒转换为HH:MM:SS格式
		if(id in travel){
			back_sid = travel[id][travel[id].length-1];//移动到新位置，上一个地方的位置的人数减一
			let back_sid_item = allSid[back_sid];
			let back_floor = back_sid_item[0];
			let back_map = 'floor' + String(back_floor);
			let back_x = back_sid_item[2];//数据中的y对应canvas的x
			let back_y = back_sid_item[1];//数据中的x对应canvas的y
			subP(back_floor,back_x,back_y);//人数减一

			let back_sum = people[back_map][back_x][back_y][0];//传感器内人数
			let back_color;
			back_color = allotColor(back_sum);//分配颜色
			if(back_color != people[back_map][back_x][back_y][1]){//和上次画的颜色不同就重新画，颜色变化表示人数变化
				people[back_map][back_x][back_y][1] = back_color;
			}
			travel[id].push(sid);
			if(back_floor === 1){
				distinguishArea1(id,back_x,back_y,'0');//消除在上一个地方的id号
			}else{
				distinguishArea2(id,back_x,back_y,'0');//消除在上一个地方的id号
			}
		}else{
			travel[id] = [];
			travel[id].push(sid);
		}
		let sid_item = allSid[sid];
		let floor = sid_item[0];
		let map = 'floor' + String(floor);
		let x = sid_item[2];//数据中的y对应canvas的x
		let y = sid_item[1];//数据中的x对应canvas的y

		addP(floor,x,y);//人数加一

		let sum = people[map][x][y][0];//传感器内人数
		let color;
		color = allotColor(sum);//分配颜色
		if(color != people[map][x][y][1]){//和上次画的颜色不同就重新赋值，颜色变化表示人数变化
			people[map][x][y][1] = color;
		}
		if(floor === 1){
			distinguishArea1(id,x,y,'1');
		}
		else{
			distinguishArea2(id,x,y,'1');
		}
		drawCell();
		updateTime(theTime);
		updateLinechartData(theTime);
	}
	//更新折线图
	turn = requestAnimationFrame(countPeople);
	if(i>csv.length-2){
		cancelAnimationFrame(turn);
		if(n < 24){
			let str = 'data\\day' + day + '_24H\\' + n.toString()+'到' + (n+1).toString() + '小时.csv';
			console.log(n,n+1);
			n++;
			i = 0;
			load(str);
		}
		else{
			// updateLinechart();
			start_day = false;
		}
	}
}
function pause(){//暂停
	if(!start_day){
		alert('请先选择会议天次');
	}else{
		pause_me = !pause_me;
		if(pause_me){
			cancelAnimationFrame(turn);
			updateLinechart();
			// getTraveData('day1_3Dtravel//10001.csv');
		}else{
			drawFloor1(sideLength,sideLength,width,height);//重新绘制地图
			drawFloor2(sideLength,sideLength,width,height);
			countPeople();
		}
	}
}
function start(id){ 
	if(start_day){
		alert('会议已经开始');
		return;
	}else{
		if(id === '1'){
			start_day = true;
			day = '1';
			alert('已选择第一天');
			load('data\\day1_24H\\0到1小时.csv');
		}else if(id === '2'){
			start_day = true;
			day = '2';
			alert('已选择第二天');
			load('data\\day2_24H\\0到1小时.csv');
		}else{
			start_day = true;
			day = '3';
			alert('已选择第三天');
			load('data\\day3_24H\\0到1小时.csv');
		}
	}
}
// async function sleep(interval) {
//     return new Promise(resolve => {
//         var markPause = setTimeout(resolve, interval);
//     })
// }
function arrayExist(array, element){  // 判断二维数组array中是否存在一维数组element
  	for(let el of array){
    	if(el.length === element.length){
      		for(let index in el){
        		if(el[index] !== element[index]){
          			break;
        		}
        		if(index == (el.length - 1)){    // 到最后一个元素都没有出现不相等，就说明这两个数组相等。
          			return true;
        		}
      		}
    	}
  	}
  	return false;
}
function allotColor(sum){//根据人数分配颜色
	let color = 'white';
	if(sum >0 && sum <= 20){
		color = colorCard['A'];
	}else if(sum > 20 && sum <= 40){
		color = colorCard['B'];
	}else if(sum > 40 && sum <= 60){
		color = colorCard['C'];
	}else if(sum > 60 && sum <= 80){
		color = colorCard['D'];
	}else if(sum > 80 && sum <= 100){
		color = colorCard['E'];
	}else if(sum > 100){
		color = colorCard['F'];
	}
	return color;
}
function addP(floor,x,y){
	if(floor === 1){
		people['floor1'][x][y][0] ++;//每块区域的人数
	}else{
		people['floor2'][x][y][0] ++;
	}
}
function subP(floor,x,y){
	if(floor === 1){
		people['floor1'][x][y][0] --;
	}else{
		people['floor2'][x][y][0] --;
	}
}
function initTime(){
	let ctx = document.getElementById('time').getContext('2d');
	ctx.font="16px sans-serif";
	ctx.fillText('会场当前时间',75,20);
	ctx.font="12px sans-serif";
	ctx.fillText('请在下方数字中选择会议天次',5,50);
	ctx.font="16px sans-serif";
}
function updateTime(time){
	let ctx = document.getElementById('time').getContext('2d');
	ctx.clearRect(0,30,200,170);
	ctx.fillText(time,75,50);
}
function initLegend(){
	let box = document.getElementById('legend');
	let ctx = box.getContext('2d');
	ctx.font="12px Arial";
	// ctx.fillText('不同颜色小方块对应不同人数',20,16);
	let color = [];
	for(let j in colorCard){
		color.push(colorCard[j]);
	}
	let padding = 14;
	n = 6;//n种颜色
	let space = parseInt(box.width/(n+1));//间隔
	for(let j=0;j<n;j++){
		ctx.fillStyle = color[j];
		ctx.fillRect(padding+j*space,10,space,space);
	}
	ctx.fillStyle = 'black';
	let x0 = 0+padding;
    let y0 = box.height-padding-20;

    //定义箭头的长度和高度
    let arrowWidth = 10;
    let arrowHeight = 5;

    //定义刻度长度
    let markWidth = 5;
    ctx.font = "10px Arial";
    ctx.textBaseline ="top";
    ctx.textAlign = "center";
    //绘制x轴
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(box.width,y0);
    ctx.stroke();
    //绘制箭头
    ctx.beginPath();
    ctx.moveTo(box.width,y0);
    ctx.lineTo(box.width-arrowWidth,y0-arrowHeight);
    ctx.lineTo(box.width-arrowWidth,y0+arrowHeight);
    ctx.closePath();
    ctx.stroke();
    //绘制x轴的刻度
    for(let x=x0,str=0;x<box.width-arrowWidth-space;x+=space,str+=20){
        ctx.beginPath();
        ctx.moveTo(x,y0);
        ctx.lineTo(x,y0-markWidth);
        ctx.stroke();
        ctx.fillText(String(str),x,y0+2);
    }
    ctx.fillText('人数',box.width-arrowWidth,y0+2);
}
function distinguishArea1(id,x,y,mark){//判断当前id在1楼的哪个区域 mark为0则去掉该id,为1则添加该id
	if((x >= 1) && (x < 6) && (y >= 2) && (y < 4)){//A会场
		if(mark === '1'){
			data['A'][1].push(id);
		}else{
			index = data['A'][1].indexOf(id);
			data['A'][1].splice(index,1);
		}
	}
	if((x >= 1) && (x < 6) && (y >= 4) && (y < 6)){
		if(mark === '1'){
			data['B'][1].push(id);
		}else{
			index = data['B'][1].indexOf(id);
			data['B'][1].splice(index,1);
		}
	}
	if((x >= 1) && (x < 6) && (y >= 6) && (y < 8)){
		if(mark === '1'){
			data['C'][1].push(id);
		}else{
			index = data['C'][1].indexOf(id);
			data['C'][1].splice(index,1);
		}
	}
	if((x >= 1) && (x < 6) && (y >= 8) && (y < 10)){
		if(mark === '1'){
			data['D'][1].push(id);
		}else{
			index = data['D'][1].indexOf(id);
			data['D'][1].splice(index,1);
		}
	}
	if((x >= 2) && (x < 6) && (y >= 12) && (y < 14)){
		if(mark === '1'){
			data['signIn'][1].push(id);
		}else{
			index = data['signIn'][1].indexOf(id);
			data['signIn'][1].splice(index,1);
		}
	}
	if((x >= 7) && (x < 9) && (y >= 3) && (y < 10)){
		if(mark === '1'){
			data['posterArea'][1].push(id);
		}else{
			index = data['posterArea'][1].indexOf(id);
			data['posterArea'][1].splice(index,1);
		}
	}
	if((x >= 10) && (x < 12) && (y >= 6) && (y < 10)){
		if(mark === '1'){
			data['room1'][1].push(id);
		}else{
			index = data['room1'][1].indexOf(id);
			data['room1'][1].splice(index,1);
		}
	}
	if((x >= 10) && (x < 12) && (y >= 10) && (y < 12)){
		if(mark === '1'){
			data['room2'][1].push(id);
		}else{
			index = data['room2'][1].indexOf(id);
			data['room2'][1].splice(index,1);
		}
	}
	if((x >= 15) && (x < 19) && (y >= 2) && (y < 12)){
		if(mark === '1'){
			data['exhibitionHall'][1].push(id);
		}else{
			index = data['exhibitionHall'][1].indexOf(id);
			data['exhibitionHall'][1].splice(index,1);
		}
	}
	if((x >= 19) && (x < 29) && (y >= 2) && (y < 12)){
		if(mark === '1'){
			data['main'][1].push(id);
		}else{
			index = data['main'][1].indexOf(id);
			data['main'][1].splice(index,1);
		}
	}
	if((x >= 19) && (x < 21) && (y >= 14) && (y < 16)){
		if(mark === '1'){
			data['reception'][1].push(id);
		}else{
			index = data['reception'][1].indexOf(id);
			data['reception'][1].splice(index,1);
		}
	}
	if((x >= 21) && (x < 25) && (y >= 14) && (y < 16)){
		if(mark === '1'){
			data['room3'][1].push(id);
		}else{
			index = data['room3'][1].indexOf(id);
			data['room3'][1].splice(index,1);
		}
	}
	if((x >= 25) && (x < 27) && (y >= 14) && (y < 16)){
		if(mark === '1'){
			data['room4'][1].push(id);
		}else{
			index = data['room4'][1].indexOf(id);
			data['room4'][1].splice(index,1);
		}
	}
}
function distinguishArea2(id,x,y,mark){//判断当前id在2楼的哪个区域 mark为0则去掉该id,为1则添加该id
	if((x >= 1) && (x < 6) && (y >= 2) && (y < 10)){
		if(mark === '1'){
			data['diningHall'][1].push(id);
		}else{
			index = data['diningHall'][1].indexOf(id);
			data['diningHall'][1].splice(index,1);
		}
	}
	if((x >= 1) && (x < 6) && (y >= 10) && (y < 12)){
		if(mark === '1'){
			data['room5'][1].push(id);
		}else{
			index = data['room5'][1].indexOf(id);
			data['room5'][1].splice(index,1);
		}
	}
	if((x >= 0) && (x < 6) && (y >= 13) && (y < 16)){
		if(mark === '1'){
			data['leisureArea'][1].push(id);
		}else{
			index = data['leisureArea'][1].indexOf(id);
			data['leisureArea'][1].splice(index,1);
		}
	}
	if((x >= 10) && (x < 12) && (y >= 6) && (y < 8)){
		if(mark === '1'){
			data['room6'][1].push(id);
		}else{
			index = data['room6'][1].indexOf(id);
			data['room6'][1].splice(index,1);
		}
	}
}
function getPointOnCanvas(canvas, x, y) {//将window的x，y坐标转换为canvas的x，y
    var bbox = canvas.getBoundingClientRect();
    return { x: x - bbox.left * (canvas.width  / bbox.width),
             y: y - bbox.top  * (canvas.height / bbox.height)
    };
}
function doMouseDown1(event){
	let x = event.pageX;
    let y = event.pageY;
    let canvas = event.target;
    let loc = getPointOnCanvas(canvas, x, y);
    let area = distinguishMouseArea1(loc.x,loc.y);//判定鼠标点击1楼的哪个区域
    hightArea(area);
    removeElementLi();
    addElementLi(area);
}
function distinguishMouseArea1(x,y){//识别鼠标点击的1楼的哪个区域
	let l1 = sideLength * 6;//A,B,C,D,签到处有共同的右x值，提出来提高计算速度
	let area;
	if((x >= sideLength) && (x <= l1) && (y >= sideLength * 2) && (y < sideLength * 4)){//A会场
		area = 'A';
		return area;
	}
	if((x >= sideLength) && (x <= l1) && (y >= sideLength * 4) && (y < sideLength * 6)){
		area = 'B';
		return area;
	}
	if((x >= sideLength) && (x <= l1) && (y >= sideLength * 6) && (y < sideLength * 8)){
		area = 'C';
		return area;
	}
	if((x >= sideLength) && (x <= l1) && (y >= sideLength * 8) && (y < sideLength * 10)){
		area = 'D';
		return area;
	}
	if((x >= sideLength * 2) && (x <= l1) && (y >= sideLength * 12) && (y <= sideLength * 14)){
		area = 'signIn';
		return area;
	}
	if((x >= sideLength * 7) && (x <= sideLength * 9) && (y >= sideLength * 3) && (y <= sideLength * 10)){
		area = 'posterArea';
		return area;
	}
	if((x >= sideLength * 10) && (x <= sideLength * 12) && (y >= sideLength * 6) && (y < sideLength * 10)){
		area = 'room1';
		return area;
	}
	if((x >= sideLength * 10) && (x <= sideLength * 12) && (y >= sideLength * 10) && (y < sideLength * 12)){
		area = 'room2';
		return area;
	}
	if((x >= sideLength * 15) && (x < sideLength * 19) && (y >= sideLength * 2) && (y < sideLength * 12)){
		area = 'exhibitionHall';
		return area;
	}
	if((x >= sideLength * 19) && (x <= sideLength * 29) && (y >= sideLength * 2) && (y < sideLength * 12)){
		area = 'main';
		return area;
	}
	if((x >= sideLength * 19) && (x < sideLength * 21) && (y >= sideLength * 14) && (y < sideLength * 16)){//服务台
		area = 'reception';
		return area;
	}
	if((x >= sideLength * 21) && (x < sideLength * 25) && (y >= sideLength * 14) && (y < sideLength * 16)){
		area = 'room3';
		return area;
	}
	if((x >= sideLength * 25) && (x < sideLength * 27) && (y >= sideLength * 14) && (y < sideLength * 16)){
		area = 'room4';
		return area;
	}
}	
function doMouseDown2(event){
	let x = event.pageX;
    let y = event.pageY;
    let canvas = event.target;
    let loc = getPointOnCanvas(canvas, x, y);
    let area = distinguishMouseArea2(loc.x,loc.y);//判定鼠标点击1楼的哪个区域
    removeElementLi();
    addElementLi(area);
}
function distinguishMouseArea2(x,y){
	let area;
	if((x >= sideLength) && (x <= sideLength * 6) && (y >= sideLength * 2) && (y < sideLength * 10)){//A会场
		area = 'diningHall';
		return area;
	}
	if((x >= sideLength) && (x <= sideLength * 6) && (y >= sideLength * 10) && (y <= sideLength * 12)){//A会场
		area = 'room5';
		return area;
	}
	if((x >= 0) && (x <= sideLength * 6) && (y >= sideLength * 13) && (y <= sideLength * 16)){//A会场
		area = 'leisureArea';
		return area;
	}
	if((x >= sideLength * 10) && (x <= sideLength * 12) && (y >= sideLength * 6) && (y <= sideLength * 8)){//A会场
		area = 'room6';
		return area;
	}
}
function hightArea(area){//高亮选择的区域
	drawFloor1(sideLength,sideLength,width,height);//清除之前的效果
	drawFloor2(sideLength,sideLength,width,height);
	let ctx1 = document.getElementById('floor1bg').getContext('2d');
	let ctx2 = document.getElementById('floor2bg').getContext('2d');
	ctx1.strokeStyle = 'red';
	ctx2.strokeStyle = 'red';
	ctx1.lineWidth = 2;
	ctx1.lineWidth = 2;
	switch(area){
		case 'main':ctx1.strokeRect(19*sideLength,2*sideLength,10*sideLength,10*sideLength);break;
		case 'A':ctx1.strokeRect(sideLength,2*sideLength,5*sideLength,2*sideLength);break;
		case 'B':ctx1.strokeRect(sideLength,4*sideLength,5*sideLength,2*sideLength);break;
		case 'C':ctx1.strokeRect(sideLength,6*sideLength,5*sideLength,2*sideLength);break;
		case 'D':ctx1.strokeRect(sideLength,8*sideLength,5*sideLength,2*sideLength);break;
		case 'signIn':ctx1.strokeRect(2*sideLength,12*sideLength,4*sideLength,2*sideLength);break;
		case 'posterArea':ctx1.strokeRect(7*sideLength,3*sideLength,2*sideLength,7*sideLength);break;
		case 'room1':ctx1.strokeRect(10*sideLength,6*sideLength,2*sideLength,4*sideLength);break;
		case 'room2':ctx1.strokeRect(10*sideLength,10*sideLength,2*sideLength,2*sideLength);break;
		case 'exhibitionHall':ctx1.strokeRect(15*sideLength,2*sideLength,4*sideLength,10*sideLength);break;
		case 'reception':ctx1.strokeRect(19*sideLength,14*sideLength,2*sideLength,2*sideLength);break;
		case 'room3':ctx1.strokeRect(21*sideLength,14*sideLength,4*sideLength,2*sideLength);break;
		case 'room4':ctx1.strokeRect(25*sideLength,14*sideLength,2*sideLength,2*sideLength);break;
		case 'diningHall':ctx2.strokeRect(sideLength,2*sideLength,5*sideLength,8*sideLength);break;
		case 'room5':ctx2.strokeRect(sideLength,10*sideLength,5*sideLength,2*sideLength);break;
		case 'leisureArea':ctx2.strokeRect(0,13*sideLength,6*sideLength,3*sideLength);break;
		case 'room6':ctx2.strokeRect(10*sideLength,6*sideLength,2*sideLength,2*sideLength);break;
		default: break;
	}
}
function drawFloor1(stepX,stepY,width,height){
	let ctx = document.getElementById('floor1bg').getContext('2d');
	ctx.clearRect(0,0,width,height);
	//网格
	ctx.beginPath();
	for(let i=0.5+stepX;i<width;i+=stepX){
		ctx.moveTo(i,0);
		ctx.lineTo(i,height);
	}
	for(let i=0.5+stepY;i<height;i+=stepY){
		ctx.moveTo(0,i)
		ctx.lineTo(width,i);
	}
	ctx.strokeStyle = 'lightgray';
	ctx.lineWidth = 1;
	ctx.stroke();

	//灰色地带
	ctx.fillStyle = 'rgba(158,158,158,0.3)';
	ctx.fillRect(0,0,stepX*10,stepY*2);
	ctx.fillRect(0,stepY*2,stepX,stepY*11);
	ctx.fillRect(stepX,stepY*10,stepX*5,stepY*2);
	ctx.fillRect(stepX*10,0,stepX*9,stepY);
	ctx.fillRect(stepX*20,0,stepX*9,stepY);
	ctx.fillRect(stepX*29,0,stepX,stepY*16);
	ctx.fillRect(0,stepY*14,stepX,stepY);
	ctx.fillRect(0,stepY*15,stepX*2,stepY);
	ctx.fillRect(stepX*3,stepY*15,stepX,stepY);
	ctx.fillRect(stepX*6,stepY*15,stepX,stepY);
	ctx.fillRect(stepX*8,stepY*15,stepX*7,stepY);
	ctx.fillRect(stepX*16,stepY*15,stepX,stepY);
	ctx.fillRect(stepX*18,stepY*15,stepX,stepY);
	ctx.fillRect(stepX*12,stepY*2,stepX*3,stepY*10);

	//分会场
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	for(let i=2*stepY;i<10*stepY;i+=2*stepY){
		ctx.strokeRect(stepX,i,stepX*5,stepY*2);
	}
	ctx.fillStyle = "rgba(0,91,197,0.2)";//蓝色
	ctx.fillRect(stepX,stepY*2,stepX*5,stepY*8);

	//签到处
	ctx.strokeRect(stepX*2,stepY*12,stepX*4,stepY*2);
	ctx.fillRect(stepX*2,stepY*12,stepX*4,stepY*2);

	//海报区
	ctx.strokeRect(stepX*7,stepY*3,stepX*2,stepY*7);
	ctx.fillRect(stepX*7,stepY*3,stepX*2,stepY*7);

	//厕所1
	ctx.strokeRect(stepX*10,stepY*4,stepX*2,stepY*2);
	//room1
	ctx.strokeRect(stepX*10,stepY*6,stepX*2,stepY*4);
	//room2
	ctx.strokeRect(stepX*10,stepY*10,stepX*2,stepY*2);
	ctx.fillRect(stepX*10,stepY*4,stepX*2,stepY*8);

	//展厅
	ctx.strokeRect(stepX*15,stepY*2,stepX*4,stepY*10);

	//主会场s
	ctx.strokeRect(stepX*19,stepY*2,stepX*10,stepY*10);

	ctx.fillRect(stepX*15,stepY*2,stepX*14,stepY*10);

	//服务台
	ctx.strokeRect(stepX*19,stepY*14,stepX*2,stepY*2);
	//room3
	ctx.strokeRect(stepX*21,stepY*14,stepX*4,stepY*2);
	//room4
	ctx.strokeRect(stepX*25,stepY*14,stepX*2,stepY*2);
	//厕所
	ctx.strokeRect(stepX*27,stepY*14,stepX*2,stepY*2);

	ctx.fillRect(stepX*19,stepY*14,stepX*10,stepY*2);

	//扶梯
	ctx.fillStyle = "rgba(255,152,0,0.5)";
	ctx.strokeRect(stepX*10,stepY,stepX*2,stepY);
	ctx.fillRect(stepX*10,stepY,stepX*2,stepY);

	ctx.strokeRect(stepX*10,stepY*14,stepX*2,stepY);
	ctx.fillRect(stepX*10,stepY*14,stepX*2,stepY);

	//出入口
	let imgR = new Image();
	let imgU = new Image();
	let imgD = new Image();
	imgR.src = 'img//right.png';
	imgU.src = 'img//up.png';
	imgD.src = 'img//down.png';
	imgR.onload = ()=>{
		ctx.drawImage(imgR,0,13.2*stepY);
	}
	imgD.onload = ()=>{
		ctx.drawImage(imgD,5.2*stepX,15*stepY);
		ctx.drawImage(imgD,15.2*stepX,15*stepY);
		ctx.drawImage(imgD,17.2*stepX,15*stepY);
	}
	imgU.onload = ()=>{
		ctx.drawImage(imgU,19.2*stepX,0);
		ctx.drawImage(imgU,2.2*stepX,15*stepY);
		ctx.drawImage(imgU,4.2*stepX,15*stepY);
		ctx.drawImage(imgU,7.2*stepX,15*stepY);
	}
	//字
	ctx.fillStyle = 'black';
	ctx.font="20px Arial";
	ctx.fillText("分会场 A",stepX*2,stepY*3.4);
	ctx.fillText("分会场 B",stepX*2,stepY*5.4);
	ctx.fillText("分会场 C",stepX*2,stepY*7.4);
	ctx.fillText("分会场 D",stepX*2,stepY*9.4);
	let l = ['海','报','区'];
	let startX = stepX*7.6;
	for(let i=5.3*stepY;i<9*stepY;i+=1.5*stepY){
		ctx.fillText(l.shift(),startX,i);
	}
	ctx.font="25px Arial";
	ctx.fillText("签到处",stepX*2.4,stepY*13.4);
	ctx.fillText('展厅',stepX*16,stepY*7);
	ctx.fillText('主会场',stepX*22.5,stepY*7);
	ctx.font="14px Arial";
	ctx.fillText('厕所1',stepX*10.2,stepY*5.1);
	ctx.fillText('room1',stepX*10.1,stepY*8.2);
	ctx.fillText('room2',stepX*10.1,stepY*11.2);
	ctx.fillText('服务台',stepX*19.1,stepY*15.2);
	ctx.fillText('room3',stepX*22.1,stepY*15.2);
	ctx.fillText('room4',stepX*25.1,stepY*15.2);
	ctx.fillText('厕所2',stepX*27.2,stepY*15.2);
	ctx.fillText('扶梯',stepX*10.3,stepY*1.7);
	ctx.fillText('扶梯',stepX*10.3,stepY*14.7);
}
function drawFloor2(stepX,stepY,width,height){
	let ctx = document.getElementById('floor2bg').getContext('2d');
	ctx.clearRect(0,0,width,height);
	//网格
	ctx.beginPath();
	for(let i=0.5+stepX;i<width;i+=stepX){
		ctx.moveTo(i,0);
		ctx.lineTo(i,height);
	}
	for(let i=0.5+stepY;i<height;i+=stepY){
		ctx.moveTo(0,i)
		ctx.lineTo(width,i);
	}
	ctx.strokeStyle = 'lightgray';
	ctx.lineWidth = 1;
	ctx.stroke();

	//灰色地带
	ctx.fillStyle = 'rgba(158,158,158,0.3)';
	ctx.fillRect(0,0,stepX*12,stepY);
	ctx.fillRect(0,stepY,stepX*10,stepY);
	ctx.fillRect(0,stepY*2,stepX,stepY*10);
	ctx.fillRect(0,stepY*12,stepX*6,stepY);
	ctx.fillRect(stepX*12,0,stepX*18,stepY*16);
	ctx.fillRect(stepX*10,stepY*8,stepX*2,stepY*4);
	ctx.fillRect(stepX*6,stepY*15,stepX*6,stepY);
	//餐厅 room5
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	ctx.strokeRect(stepX,stepY*2,stepX*5,stepY*8);
	ctx.strokeRect(stepX,stepY*10,stepX*5,stepY*2);
	ctx.fillStyle = "rgba(0,91,197,0.2)";//蓝色
	ctx.fillRect(stepX,stepY*2,stepX*5,stepY*10);

	//休闲区
	ctx.strokeRect(0,stepY*13,stepX*6,stepY*3);
	ctx.fillRect(0,stepY*13,stepX*6,stepY*3);

	//厕所3 room6
	ctx.strokeRect(stepX*10,stepY*4,stepX*2,stepY*2);
	ctx.strokeRect(stepX*10,stepY*6,stepX*2,stepY*2);
	ctx.fillRect(stepX*10,stepY*4,stepX*2,stepY*4);

	//扶梯
	ctx.fillStyle = "rgba(255,152,0,0.5)";
	ctx.strokeRect(stepX*10,stepY,stepX*2,stepY);
	ctx.fillRect(stepX*10,stepY,stepX*2,stepY);

	ctx.strokeRect(stepX*10,stepY*14,stepX*2,stepY);
	ctx.fillRect(stepX*10,stepY*14,stepX*2,stepY);

	//字
	ctx.fillStyle = 'black';
	ctx.font="14px sans-serif";
	ctx.fillText('厕所3',stepX*10.2,stepY*5.2);
	ctx.fillText('room6',stepX*10,stepY*7.2);
	ctx.fillText('扶梯',stepX*10.3,stepY*1.7);
	ctx.fillText('扶梯',stepX*10.3,stepY*14.7);
	ctx.fillText('room5',stepX*2.4,stepY*11.2);
	ctx.font="20px Arial";
	ctx.fillText('餐厅',stepX*2.5,stepY*6.2);
	ctx.fillText('休闲区',stepX*1.8,stepY*14.8);
}
function init3Dbar(){//初始化3D柱状图
	option = {
		trigger: 'item',
	    tooltip: {
	    	formatter: function() {
	            return '停留时间(秒)';
	        },
	    },
	    visualMap: {
	        max: 2000,
	        text: ['停留时间长(秒)','停留时间短(秒)'],
	        itemWidth: 5,
	        itemHeight: 50,
	        inRange: {
	            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
	        }
	    },
	    xAxis3D: {
	    	name: 'x',
	        type: 'category',
	        data: xAxislist
	    },
	    yAxis3D: {
	    	name: 'y',
	        type: 'category',
	        inverse: true,
	        data: yAxislist
	    },
	    zAxis3D: {
	    	name: 'z',
	        type: 'value'
	    },
	    grid3D: {
	        boxWidth: 187.5,
	        boxDepth: 100,
	        boxHeight: 100,
	        light: {
	            main: {
	                intensity: 1.2
	            },
	            ambient: {
	                intensity: 0.3
	            }
	        }
	    },
	    series: [{
	        type: 'bar3D',
	        data: data_floor1.map(function (item) {
	            return {
	                value: [item[0], item[1], item[2]]
	            }
	        }),
	        shading: 'color',

	        label: {
	            show: false,
	            textStyle: {
	                fontSize: 16,
	                borderWidth: 1
	            }
	        },
	        
	        itemStyle: {
	            opacity: 0.4
	        },

	        emphasis: {
	            label: {
	                textStyle: {
	                    fontSize: 20,
	                    color: '#900'
	                }
	            },
	            itemStyle: {
	                color: '#900'
	            }
	        }
	    }]
	};
	my3DbarChart.setOption(option);
	my3DbarChart2.setOption(option);
}
function draw3Dbar(){//绘制3D柱状图
    my3DbarChart.setOption({
        series:[{
            data: data_floor1.map(function (item) {
                return {
                    value: [item[0], item[1], item[2]]
                }
            })
        }]
    });
    my3DbarChart2.setOption({
        series:[{
            data: data_floor2.map(function (item) {
                return {
                    value: [item[0],item[1],item[2]]
                }
            })
        }]
    })
}
function initLineChart(){//初始化折线图
	option = {
	    tooltip: {
	        trigger: 'axis',
	        // formatter: function(params) {
	        //     params = params[0];
	        //     var time = params.name;
	        //     return time + params.value[1];
	        // },
	        axisPointer: {
	            animation: false
	        }
	    },
	    legend: {
	    	data: ['主会场','分会场A','分会场B','分会场C','分会场D','展厅','海报区','餐厅']
	    },
	    xAxis: {
	        type: 'category',
	        data: data_time
	    },
	    yAxis: {
	        type: 'value',
	    },
	    dataZoom: [
	        {
	            type: 'slider',
	            xAxisIndex: 0,
	            filterMode: 'empty',
	            height: 20,
	            fillerColor: 'lightgray',
	            borderRadius: 10,
	            backgroundColor: '#FFFFFF'
	        },
	        {
	            type: 'slider',
	            yAxisIndex: 0,
	            filterMode: 'empty',
	            width: 20,
	            fillerColor: 'lightgray',
	            borderRadius: 10,
	            backgroundColor: '#FFFFFF'
	        },
	        {
	            type: 'inside',
	            xAxisIndex: 0,
	            filterMode: 'empty'
	        },
	        {
	            type: 'inside',
	            yAxisIndex: 0,
	            filterMode: 'empty'
	        }
	    ],
	    series: [
	    {
	    	name: '主会场',
	    	type: 'line',
	    	sampling: 'average',
	        data: data['main']
	    },
	    {
	    	name: '分会场A',
	    	type: 'line',
	    	sampling: 'average',
	    	data: data['A']

	    },
	    {
	    	name: '分会场B',
	    	type: 'line',
	    	sampling: 'average',
	    	data: data['B']
	    },
	    {
	    	name: '分会场C',
	    	type: 'line',
	    	sampling: 'average',
	    	data: data['C']
	    },
	    {
	    	name: '分会场D',
	    	type: 'line',
	    	sampling: 'average',
	    	data: data['D']
	    },
	    {
	    	name: '展厅',
	    	type: 'line',
	    	sampling: 'average',
	    	data: data['exhibitionHall']
	    },
	    {
	    	name: '海报区',
	    	type: 'line',
	    	sampling: 'average',
	    	data: data['posterArea']
	    },
	    {
	    	name: '餐厅',
	    	type: 'line',
	    	sampling: 'average',
	    	data: data['diningHall']
	    }
	    ]
	};
	mylineChart.setOption(option);
}
function formatSeconds(value) {//将秒转换为24小时制 HH:MM:SS
    let theTime = parseInt(value);// 秒
    let minute = 0;// 分
    let hour = 0;// 小时

    if(theTime > 60) {
        minute = parseInt(theTime/60);
        theTime = parseInt(theTime%60);
        if(minute > 60) {
            hour = parseInt(minute/60);
            minute = parseInt(minute%60);
        }
    }
    let result = "" + parseInt(theTime) + "秒";
    if(minute > 0) {
        result = "" + parseInt(minute) + "分" + result;
    }
    if(hour > 0){
        result = "" + parseInt(hour) + "时" + result;
    }
    return result;
}
var turn = null;//记录requestAnimationFrame
var turn2 = null;
var s = 0;//用来遍历路径
var i = 0;//遍历sid数
var day;//会场第几天
var start_day;//标记已经开始
var csv;//获取的每小时的会场人员分布数据
var colorCard = {'A':'#35BBCA','B':'#0191B4','C':'#F8D90F','D':'#D3DD18','E':'#FE7415','F':'red'};//色卡
var x_y = {'floor1':[],'floor2':[]};//用来记录变化的传感器 地图上很多小方块，这x_y只包含含有传感器的小方块
var n = 1;
var pause_me = false;//暂停
//会场传感器布置表sid-floor-x-y
var allSid = {'10019': [1, 0, 19], '10110': [1, 1, 10], '10111': [1, 1, 11], '10112': [1, 1, 12], '10113': [1, 1, 13], '10114': [1, 1, 14], '10115': [1, 1, 15], '10116': [1, 1, 16], '10117': [1, 1, 17], '10118': [1, 1, 18], '10119': [1, 1, 19], '10201': [1, 2, 1], '10202': [1, 2, 2], '10203': [1, 2, 3], '10204': [1, 2, 4], '10205': [1, 2, 5], '10206': [1, 2, 6], '10207': [1, 2, 7], '10208': [1, 2, 8], '10209': [1, 2, 9], '10210': [1, 2, 10], '10211': [1, 2, 11], '10215': [1, 2, 15], '10216': [1, 2, 16], '10217': [1, 2, 17], '10218': [1, 2, 18], '10219': [1, 2, 19], '10220': [1, 2, 20], '10221': [1, 2, 21], '10222': [1, 2, 22], '10223': [1, 2, 23], '10224': [1, 2, 24], '10301': [1, 3, 1], '10302': [1, 3, 2], '10303': [1, 3, 3], '10304': [1, 3, 4], '10305': [1, 3, 5], '10306': [1, 3, 6], '10307': [1, 3, 7], '10308': [1, 3, 8], '10309': [1, 3, 9], '10310': [1, 3, 10], '10311': [1, 3, 11], '10315': [1, 3, 15], '10316': [1, 3, 16], '10317': [1, 3, 17], '10318': [1, 3, 18], '10319': [1, 3, 19], '10320': [1, 3, 20], '10321': [1, 3, 21], '10322': [1, 3, 22], '10323': [1, 3, 23], '10324': [1, 3, 24], '10325': [1, 3, 25], '10326': [1, 3, 26], '10327': [1, 3, 27], '10401': [1, 4, 1], '10402': [1, 4, 2], '10403': [1, 4, 3], '10404': [1, 4, 4], '10405': [1, 4, 5], '10406': [1, 4, 6], '10407': [1, 4, 7], '10408': [1, 4, 8], '10409': [1, 4, 9], '10410': [1, 4, 10], '10411': [1, 4, 11], '10415': [1, 4, 15], '10416': [1, 4, 16], '10417': [1, 4, 17], '10418': [1, 4, 18], '10419': [1, 4, 19], '10420': [1, 4, 20], '10421': [1, 4, 21], '10422': [1, 4, 22], '10423': [1, 4, 23], '10424': [1, 4, 24], '10425': [1, 4, 25], '10426': [1, 4, 26], '10427': [1, 4, 27], '10501': [1, 5, 1], '10502': [1, 5, 2], '10503': [1, 5, 3], '10504': [1, 5, 4], '10505': [1, 5, 5], '10506': [1, 5, 6], '10507': [1, 5, 7], '10508': [1, 5, 8], '10509': [1, 5, 9], '10510': [1, 5, 10], '10511': [1, 5, 11], '10515': [1, 5, 15], '10516': [1, 5, 16], '10517': [1, 5, 17], '10518': [1, 5, 18], '10519': [1, 5, 19], '10520': [1, 5, 20], '10521': [1, 5, 21], '10522': [1, 5, 22], '10523': [1, 5, 23], '10524': [1, 5, 24], '10525': [1, 5, 25], '10526': [1, 5, 26], '10527': [1, 5, 27], '10601': [1, 6, 1], '10602': [1, 6, 2], '10603': [1, 6, 3], '10604': [1, 6, 4], '10605': [1, 6, 5], '10606': [1, 6, 6], '10607': [1, 6, 7], '10608': [1, 6, 8], '10609': [1, 6, 9], '10610': [1, 6, 10], '10611': [1, 6, 11], '10615': [1, 6, 15], '10616': [1, 6, 16], '10617': [1, 6, 17], '10618': [1, 6, 18], '10619': [1, 6, 19], '10620': [1, 6, 20], '10621': [1, 6, 21], '10622': [1, 6, 22], '10623': [1, 6, 23], '10624': [1, 6, 24], '10625': [1, 6, 25], '10626': [1, 6, 26], '10627': [1, 6, 27], '10701': [1, 7, 1], '10702': [1, 7, 2], '10703': [1, 7, 3], '10704': [1, 7, 4], '10705': [1, 7, 5], '10706': [1, 7, 6], '10707': [1, 7, 7], '10708': [1, 7, 8], '10709': [1, 7, 9], '10710': [1, 7, 10], '10711': [1, 7, 11], '10715': [1, 7, 15], '10716': [1, 7, 16], '10717': [1, 7, 17], '10718': [1, 7, 18], '10719': [1, 7, 19], '10720': [1, 7, 20], '10721': [1, 7, 21], '10722': [1, 7, 22], '10723': [1, 7, 23], '10724': [1, 7, 24], '10725': [1, 7, 25], '10726': [1, 7, 26], '10727': [1, 7, 27], '10801': [1, 8, 1], '10802': [1, 8, 2], '10803': [1, 8, 3], '10804': [1, 8, 4], '10805': [1, 8, 5], '10806': [1, 8, 6], '10807': [1, 8, 7], '10808': [1, 8, 8], '10809': [1, 8, 9], '10810': [1, 8, 10], '10811': [1, 8, 11], '10815': [1, 8, 15], '10816': [1, 8, 16], '10817': [1, 8, 17], '10818': [1, 8, 18], '10819': [1, 8, 19], '10820': [1, 8, 20], '10821': [1, 8, 21], '10822': [1, 8, 22], '10823': [1, 8, 23], '10824': [1, 8, 24], '10825': [1, 8, 25], '10826': [1, 8, 26], '10827': [1, 8, 27], '10901': [1, 9, 1], '10902': [1, 9, 2], '10903': [1, 9, 3], '10904': [1, 9, 4], '10905': [1, 9, 5], '10906': [1, 9, 6], '10907': [1, 9, 7], '10908': [1, 9, 8], '10909': [1, 9, 9], '10910': [1, 9, 10], '10911': [1, 9, 11], '10915': [1, 9, 15], '10916': [1, 9, 16], '10917': [1, 9, 17], '10918': [1, 9, 18], '10919': [1, 9, 19], '10920': [1, 9, 20], '10921': [1, 9, 21], '10922': [1, 9, 22], '10923': [1, 9, 23], '10924': [1, 9, 24], '10925': [1, 9, 25], '10926': [1, 9, 26], '10927': [1, 9, 27], '11006': [1, 10, 6], '11007': [1, 10, 7], '11008': [1, 10, 8], '11009': [1, 10, 9], '11010': [1, 10, 10], '11011': [1, 10, 11], '11015': [1, 10, 15], '11016': [1, 10, 16], '11017': [1, 10, 17], '11018': [1, 10, 18], '11019': [1, 10, 19], '11020': [1, 10, 20], '11021': [1, 10, 21], '11022': [1, 10, 22], '11023': [1, 10, 23], '11024': [1, 10, 24], '11025': [1, 10, 25], '11026': [1, 10, 26], '11027': [1, 10, 27], '11106': [1, 11, 6], '11107': [1, 11, 7], '11108': [1, 11, 8], '11109': [1, 11, 9], '11110': [1, 11, 10], '11111': [1, 11, 11], '11115': [1, 11, 15], '11116': [1, 11, 16], '11117': [1, 11, 17], '11118': [1, 11, 18], '11119': [1, 11, 19], '11120': [1, 11, 20], '11121': [1, 11, 21], '11122': [1, 11, 22], '11123': [1, 11, 23], '11124': [1, 11, 24], '11125': [1, 11, 25], '11126': [1, 11, 26], '11127': [1, 11, 27], '11202': [1, 12, 2], '11203': [1, 12, 3], '11204': [1, 12, 4], '11205': [1, 12, 5], '11206': [1, 12, 6], '11207': [1, 12, 7], '11208': [1, 12, 8], '11209': [1, 12, 9], '11210': [1, 12, 10], '11211': [1, 12, 11], '11212': [1, 12, 12], '11213': [1, 12, 13], '11214': [1, 12, 14], '11215': [1, 12, 15], '11216': [1, 12, 16], '11217': [1, 12, 17], '11218': [1, 12, 18], '11219': [1, 12, 19], '11220': [1, 12, 20], '11221': [1, 12, 21], '11222': [1, 12, 22], '11223': [1, 12, 23], '11224': [1, 12, 24], '11225': [1, 12, 25], '11226': [1, 12, 26], '11227': [1, 12, 27], '11228': [1, 12, 28], '11300': [1, 13, 0], '11301': [1, 13, 1], '11302': [1, 13, 2], '11303': [1, 13, 3], '11304': [1, 13, 4], '11305': [1, 13, 5], '11306': [1, 13, 6], '11307': [1, 13, 7], '11308': [1, 13, 8], '11309': [1, 13, 9], '11310': [1, 13, 10], '11311': [1, 13, 11], '11312': [1, 13, 12], '11313': [1, 13, 13], '11314': [1, 13, 14], '11315': [1, 13, 15], '11316': [1, 13, 16], '11317': [1, 13, 17], '11318': [1, 13, 18], '11319': [1, 13, 19], '11320': [1, 13, 20], '11321': [1, 13, 21], '11322': [1, 13, 22], '11323': [1, 13, 23], '11324': [1, 13, 24], '11325': [1, 13, 25], '11326': [1, 13, 26], '11327': [1, 13, 27], '11328': [1, 13, 28], '11401': [1, 14, 1], '11402': [1, 14, 2], '11403': [1, 14, 3], '11404': [1, 14, 4], '11405': [1, 14, 5], '11406': [1, 14, 6], '11407': [1, 14, 7], '11408': [1, 14, 8], '11409': [1, 14, 9], '11410': [1, 14, 10], '11411': [1, 14, 11], '11412': [1, 14, 12], '11413': [1, 14, 13], '11414': [1, 14, 14], '11415': [1, 14, 15], '11416': [1, 14, 16], '11417': [1, 14, 17], '11418': [1, 14, 18], '11419': [1, 14, 19], '11420': [1, 14, 20], '11421': [1, 14, 21], '11422': [1, 14, 22], '11423': [1, 14, 23], '11424': [1, 14, 24], '11425': [1, 14, 25], '11426': [1, 14, 26], '11427': [1, 14, 27], '11428': [1, 14, 28], '11502': [1, 15, 2], '11504': [1, 15, 4], '11505': [1, 15, 5], '11507': [1, 15, 7], '11515': [1, 15, 15], '11517': [1, 15, 17], '11519': [1, 15, 19], '11520': [1, 15, 20], '11521': [1, 15, 21], '11522': [1, 15, 22], '11523': [1, 15, 23], '11524': [1, 15, 24], '11525': [1, 15, 25], '11526': [1, 15, 26], '11527': [1, 15, 27], '11528': [1, 15, 28], '20110': [2, 1, 10], '20111': [2, 1, 11], '20202': [2, 2, 2], '20203': [2, 2, 3], '20204': [2, 2, 4], '20205': [2, 2, 5], '20206': [2, 2, 6], '20207': [2, 2, 7], '20208': [2, 2, 8], '20209': [2, 2, 9], '20210': [2, 2, 10], '20211': [2, 2, 11], '20302': [2, 3, 2], '20303': [2, 3, 3], '20304': [2, 3, 4], '20305': [2, 3, 5], '20306': [2, 3, 6], '20307': [2, 3, 7], '20308': [2, 3, 8], '20309': [2, 3, 9], '20310': [2, 3, 10], '20311': [2, 3, 11], '20402': [2, 4, 2], '20403': [2, 4, 3], '20404': [2, 4, 4], '20405': [2, 4, 5], '20406': [2, 4, 6], '20407': [2, 4, 7], '20408': [2, 4, 8], '20409': [2, 4, 9], '20410': [2, 4, 10], '20411': [2, 4, 11], '20502': [2, 5, 2], '20503': [2, 5, 3], '20504': [2, 5, 4], '20505': [2, 5, 5], '20506': [2, 5, 6], '20507': [2, 5, 7], '20508': [2, 5, 8], '20509': [2, 5, 9], '20510': [2, 5, 10], '20511': [2, 5, 11], '20602': [2, 6, 2], '20603': [2, 6, 3], '20604': [2, 6, 4], '20605': [2, 6, 5], '20606': [2, 6, 6], '20607': [2, 6, 7], '20608': [2, 6, 8], '20609': [2, 6, 9], '20610': [2, 6, 10], '20611': [2, 6, 11], '20702': [2, 7, 2], '20703': [2, 7, 3], '20704': [2, 7, 4], '20705': [2, 7, 5], '20706': [2, 7, 6], '20707': [2, 7, 7], '20708': [2, 7, 8], '20709': [2, 7, 9], '20710': [2, 7, 10], '20711': [2, 7, 11], '20802': [2, 8, 2], '20803': [2, 8, 3], '20804': [2, 8, 4], '20805': [2, 8, 5], '20806': [2, 8, 6], '20807': [2, 8, 7], '20808': [2, 8, 8], '20809': [2, 8, 9], '20902': [2, 9, 2], '20903': [2, 9, 3], '20904': [2, 9, 4], '20905': [2, 9, 5], '20906': [2, 9, 6], '20907': [2, 9, 7], '20908': [2, 9, 8], '20909': [2, 9, 9], '21001': [2, 10, 1], '21002': [2, 10, 2], '21003': [2, 10, 3], '21004': [2, 10, 4], '21005': [2, 10, 5], '21006': [2, 10, 6], '21007': [2, 10, 7], '21008': [2, 10, 8], '21009': [2, 10, 9], '21101': [2, 11, 1], '21102': [2, 11, 2], '21103': [2, 11, 3], '21104': [2, 11, 4], '21105': [2, 11, 5], '21106': [2, 11, 6], '21107': [2, 11, 7], '21108': [2, 11, 8], '21109': [2, 11, 9], '21206': [2, 12, 6], '21207': [2, 12, 7], '21208': [2, 12, 8], '21209': [2, 12, 9], '21210': [2, 12, 10], '21211': [2, 12, 11], '21300': [2, 13, 0], '21301': [2, 13, 1], '21302': [2, 13, 2], '21303': [2, 13, 3], '21304': [2, 13, 4], '21305': [2, 13, 5], '21306': [2, 13, 6], '21307': [2, 13, 7], '21308': [2, 13, 8], '21309': [2, 13, 9], '21310': [2, 13, 10], '21311': [2, 13, 11], '21400': [2, 14, 0], '21401': [2, 14, 1], '21402': [2, 14, 2], '21403': [2, 14, 3], '21404': [2, 14, 4], '21405': [2, 14, 5], '21406': [2, 14, 6], '21407': [2, 14, 7], '21408': [2, 14, 8], '21409': [2, 14, 9], '21410': [2, 14, 10], '21411': [2, 14, 11], '21500': [2, 15, 0], '21501': [2, 15, 1], '21502': [2, 15, 2], '21503': [2, 15, 3], '21504': [2, 15, 4], '21505': [2, 15, 5]};
var people = {};//每个传感器对应的人数
//{'floor1':[[[0,'white']]]}
//一楼人员数地图
var floor1 = new Array();
for(let j=0;j<30;j++){        //一维长度为30
    floor1[j] = new Array();
    for(let k=0;k<16;k++){    //二维长度为16
        floor1[j][k] = [0,'white'];
    }
}
//二楼人员数地图
var floor2 = new Array();
for(let j=0;j<30;j++){        //一维长度为30
    floor2[j] = new Array();
    for(let k=0;k<16;k++){    //二维长度为16
        floor2[j][k] = [0,'white'];//三维 人数和当前颜色
    }
}
people['floor1'] = floor1;
people['floor2'] = floor2;

var travel = {};//轨迹
var map1fg = document.getElementById('floor1fg');
var map2fg = document.getElementById('floor2fg');
var map1bg = document.getElementById('floor1bg');
var map2bg = document.getElementById('floor2bg');
var timep = document.getElementById('time');//时间的画布
var legend = document.getElementById('legend');//图例


var map1fgctx = map1fg.getContext('2d');
var map2fgctx = map2fg.getContext('2d');
// var map1bgctx = map1bg.getContext('2d');
// var map2bgctx = map2bg.getContext('2d');
// var timectx = timep.getElementById('2d');
var width = 0;//画布1宽度
var height = 0;//画布1高度
window.onresize = resizeCanvas;//每当浏览器窗口变化，地图会跟着变化
var sideLength = 0;//每个小方块的边长
function resizeCanvas(){
	height = window.innerHeight/2;//当前屏幕高度的一半
	width = height/16*30;
	map1fg.height = height;//height/30就是每个小方格的宽度
	map2fg.height = height;
	map1bg.height = height;
	map2bg.height = height;
	map1fg.width = width;
	map2fg.width = width;window
	map1bg.width = width;
	map2bg.width = width;
	timep.width = window.innerWidth-2*width;
	timep.height = height/6;
	legend.width = timep.width;
	legend.height = 84;
	console.log(window.innerWidth/3);
	sideLength = height/16;
}
resizeCanvas();
drawFloor1(sideLength,sideLength,width,height);//先绘制地图
drawFloor2(sideLength,sideLength,width,height);
initTime();
initLegend();
var mylineChart = echarts.init(document.getElementById('main'));
var my3DbarChart = echarts.init(document.getElementById('floor1_travel'));
var my3DbarChart2 = echarts.init(document.getElementById('floor2_travel'));
var data_time = [];
var xAxislist = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
var yAxislist = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
var data_floor1 = [];
var data_floor2 = [];
//第一个存储当前区域人数，第二个存储当前区域人员id
var data = {'main':[[],[]],'A':[[],[]],'B':[[],[]],'C':[[],[]],'D':[[],[]],'exhibitionHall':[[],[]],'posterArea':[[],[]],'diningHall':[[],[]],'signIn':[[],[]],'reception':[[],[]],'leisureArea':[[],[]],'room1':[[],[]],'room2':[[],[]],'room3':[[],[]],'room4':[[],[]],'room5':[[],[]],'room6':[[],[]]};//主会场，分会场A,分会场B，分会场C，分会场D，展厅，海报区，餐厅
initLineChart();
init3Dbar();
map1bg.addEventListener("mousedown", doMouseDown1, false);//点击会场地图某一块进行响应
map2bg.addEventListener("mousedown",doMouseDown2,false);
selectId();//选择人员id