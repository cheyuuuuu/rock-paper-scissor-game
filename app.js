let game, paper, scissor, stone;
const startButton = document.getElementById("start");
const paperCountArea = document.getElementById("paperCountArea");
const scissorCountArea = document.getElementById("scissorCountArea");
const stoneCountArea = document.getElementById("stoneCountArea");
let rank = 3;
let opacity = 0; // 新增透明度變數
let fadeIn = true; // 新增淡入控制變數
function startGame(){
  startButton.disabled = true;
  const rankArea = document.getElementsByClassName("rankArea");
  console.log(rankArea);
  while(rankArea.length > 0){
    rankArea[0].remove();
  }
  const winner = document.getElementsByClassName("winner");
  console.log(winner);
  while(winner.length > 0){
    winner[0].remove();
  }
  gameStart();
}

function gameStart(){
  
  //畫面基本設定
  const c  = document.getElementById("canvas");
  const canvasHeight = c.height;
  const canvasWidth = c.width;
  const ctx = c.getContext("2d");
  const radius = 20;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  let opacity = ctx.globalAlpha;
  opacity = 0.5;
  //設定球的類別
  class paperBalls {
    constructor(x, y, xSpeed, ySpeed){
      this.x = x
      this.y = y
      this.xSpeed = xSpeed
      this.ySpeed = ySpeed
      this.imgSrc = "paper.png"
      this.img = new Image();
      this.img.src = this.imgSrc;
    }
  }

  class stoneBalls {
    constructor(x, y, xSpeed, ySpeed){
      this.x = x
      this.y = y
      this.xSpeed = xSpeed
      this.ySpeed = ySpeed
      this.imgSrc = "stone.png"
      this.img = new Image();
      this.img.src = this.imgSrc;
    }
  }
  class scissorBalls {
    constructor(x, y, xSpeed, ySpeed){
      this.x = x
      this.y = y
      this.xSpeed = xSpeed
      this.ySpeed = ySpeed
      this.imgSrc = "scissor.png"
      this.img = new Image();
      this.img.src = this.imgSrc;
    }
  }

  let balls = [];
  //自動隨機生成球
  function createBalls( ballClass, count ){
    for(let i = 0; i < count; i++){
      let x, y;
      let noneOverLapping = false;
      while(!noneOverLapping){
        x = Math.random() * (canvasWidth - radius * 2) + radius;
        y = Math.random() * (canvasHeight - radius * 2) + radius;
        noneOverLapping = balls.every(ball => {
          const distance = getDistance(x, ball.x, y, ball.y);
          return distance > radius * 2 + 40;
        });
      }
      const xSpeed = Math.random() *14 - 7 ;
      const ySpeed = Math.random() *14 - 7; 
      balls.push(new ballClass(x, y, xSpeed, ySpeed));
    }  
  }

  createBalls(paperBalls, 10);
  createBalls(scissorBalls, 10);
  createBalls(stoneBalls, 10);
  let paperCount = 0;
  let scissorCount = 0;
  let stoneCount = 0;
  for(let ball of balls){
    if(ball.imgSrc === "paper.png"){
       paperCount++;
      }else if(ball.imgSrc === "scissor.png"){
        scissorCount++;
      }else if(ball.imgSrc === "stone.png"){
        stoneCount++;
      }
      
    }
  console.log("布有" + paperCount + "個" + " "+
              "剪刀有" + scissorCount + "個" + " "+
              "石頭有" + stoneCount + "個" + " "
  );

  paperCountArea.innerHTML = paperCount;
  scissorCountArea.innerHTML = scissorCount;
  stoneCountArea.innerHTML = scissorCount;

  //計算距離的公式
  function getDistance(x1, y1, x2, y2){
    return Math.sqrt((x2 - x1)** 2 + (y1 - y2) **2);
  }
  
  //處理碰撞以及計算碰撞後的數量
  function handleCollision(){
    
    for(let i = 0; i < balls.length; i++){
      for(let j = i + 1; j < balls.length; j++){
        const ballA = balls[i];
        const ballB = balls[j];
        const distance = getDistance(ballA.x , ballA.y , ballB.x, ballB.y);


        if(distance <= radius *2 ){
          const overlap = radius * 2 - distance;
          
          // 獲取方向向量
          const dx = ballB.x - ballA.x;
          const dy = ballB.y - ballA.y;
          const angle = Math.atan2(dy, dx);
          
          // 將球推開
          ballA.x -= Math.cos(angle) * (overlap / 2);
          ballA.y -= Math.sin(angle) * (overlap / 2);
          ballB.x += Math.cos(angle) * (overlap / 2);
          ballB.y += Math.sin(angle) * (overlap / 2);
          //交換速度
          [ballA.xSpeed, ballB.xSpeed] = [ballB.xSpeed, ballA.xSpeed];
          [ballA.ySpeed, ballB.ySpeed] = [ballB.ySpeed, ballA.ySpeed];

          if(ballA.imgSrc === "stone.png" && ballB.imgSrc === "scissor.png" ){
            ballB.imgSrc = "stone.png"
            ballB.img = new Image();
            ballB.img.src = "stone.png";
            stoneCount++;
            scissorCount--;
          }
          if(ballA.imgSrc === "stone.png" && ballB.imgSrc === "paper.png" ){
            ballA.imgSrc = "paper.png"
            ballA.img = new Image();
            ballA.img.src = "paper.png";
            paperCount++;
            stoneCount--;
          }
          if(ballA.imgSrc === "paper.png" && ballB.imgSrc === "stone.png" ){
            ballB.imgSrc = "paper.png"
            ballB.img = new Image();
            ballB.img.src = "paper.png";
            paperCount++;
            stoneCount--;
          }
          if(ballA.imgSrc === "paper.png" && ballB.imgSrc === "scissor.png" ){
            ballA.imgSrc = "scissor.png"
            ballA.img = new Image();
            ballA.img.src = "scissor.png";
            scissorCount++;
            paperCount--;
          }
          if(ballA.imgSrc === "scissor.png" && ballB.imgSrc === "paper.png" ){
            ballB.imgSrc = "scissor.png"
            ballB.img = new Image();
            ballB.img.src = "scissor.png";
            scissorCount++;
            paperCount--;
          }
          if(ballA.imgSrc === "scissor.png" && ballB.imgSrc === "stone.png" ){
            ballA.imgSrc = "stone.png"
            ballA.img = new Image();
            ballA.img.src = "stone.png";
            stoneCount++;
            scissorCount--;
          }
          
        }
      }
      
    }
    const lastBall = balls[0]; //ballb
    const firstBall = balls[balls.length-1]; //balla
    const lastFirstDistance = getDistance(firstBall.x, firstBall.y, lastBall.x, lastBall.y);
        
      if(lastFirstDistance <= radius *2 ){
        const overlap = radius * 2 - lastFirstDistance;
          
          // 獲取方向向量
        const dx = lastBall.x - firstBall.x;
        const dy = firstBall.y - lastBall.y;
        const angle = Math.atan2(dy, dx);
          
          // 將球推開
        firstBall.x -= Math.cos(angle) * (overlap / 2);
        firstBall.y -= Math.sin(angle) * (overlap / 2);
        lastBall.x += Math.cos(angle) * (overlap / 2);
        lastBall.y += Math.sin(angle) * (overlap / 2);
          //交換速度
        [firstBall.xSpeed, lastBall.xSpeed] = [lastBall.xSpeed, firstBall.xSpeed];
        [firstBall.ySpeed, lastBall.ySpeed] = [lastBall.ySpeed, firstBall.ySpeed];

        if(firstBall.imgSrc === "stone.png" && lastBall.imgSrc === "scissor.png" ){
          lastBall.imgSrc = "stone.png"
          lastBall.img = new Image();
          lastBall.img.src = "stone.png";
          stoneCount++;
          scissorCount--;
          }
        if(firstBall.imgSrc === "stone.png" && lastBall.imgSrc === "paper.png" ){
          firstBall.imgSrc = "paper.png"
          firstBall.img = new Image();
          firstBall.img.src = "paper.png";
          paperCount++;
          stoneCount--;
          }
        if(firstBall.imgSrc === "paper.png" && lastBall.imgSrc === "stone.png" ){
          lastBall.imgSrc = "paper.png"
          lastBall.img = new Image();
          lastBall.img.src = "paper.png";
          paperCount++;
          stoneCount--;
          }
        if(firstBall.imgSrc === "paper.png" && lastBall.imgSrc === "scissor.png" ){
            firstBall.imgSrc = "scissor.png"
            firstBall.img = new Image();
            firstBall.img.src = "scissor.png";
            scissorCount++;
            paperCount--;
          }
        if(firstBall.imgSrc === "scissor.png" && lastBall.imgSrc === "paper.png" ){
          lastBall.imgSrc = "scissor.png"
          lastBall.img = new Image();
          lastBall.img.src = "scissor.png";
          scissorCount++;
          paperCount--;
          }
        if(firstBall.imgSrc === "scissor.png" && lastBall.imgSrc === "stone.png" ){
          firstBall.imgSrc = "stone.png"
          firstBall.img = new Image();
          firstBall.img.src = "stone.png";
          stoneCount++;
          scissorCount--;
          }
        }
    console.log("布有" + paperCount + "個" + " "+
                "剪刀有" + scissorCount + "個" + " "+
                "石頭有" + stoneCount + "個" + " "
    );
    paperCountArea.innerHTML = paperCount;
    scissorCountArea.innerHTML = scissorCount;
    stoneCountArea.innerHTML = stoneCount;
  }

  //確認有沒有碰到邊界
  function boundaryCheck(){
    for(let ball of balls){
      if(ball.x >= canvasWidth - radius){
        ball.x = canvasWidth -radius;
        ball.xSpeed *= -1;
      }else if(ball.x <= radius){
        ball.x = radius;
        ball.xSpeed *= -1;
      }
      if(ball.y >= canvasHeight - radius){
        ball.y = canvasHeight -radius;
        ball.ySpeed *= -1;
      }else if(ball.y <= radius){
        ball.y = radius;
        ball.ySpeed *= -1;
      } 
    }
  }
  //讓球移動起來
  function move(){
    for(let ball of balls){
      ball.x += ball.xSpeed;
      ball.y += ball.ySpeed;
    }
  }

  //畫出背景及球
  function drawBalls(){
      //畫出白色背景
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // 設置透明度淡入效果
      // if (fadeIn && opacity < 1) {
      //   opacity += 0.05; // 每次增加透明度
      //   if (opacity >= 1) fadeIn = false; // 停止淡入
      // }

      // ctx.globalAlpha = opacity; // 套用透明度
      

      for (let ball of balls) {
        // 確保圖片已載入完成再繪製
        if (ball.img.complete) {
          // console.log("劃出球");
          // 將圖片畫在球的中心點
          //ctx.drawImage(image, x, y, width, height);
          ctx.drawImage(ball.img, ball.x - radius, ball.y - radius, radius * 2, radius * 2);
        }else{
          // console.log("不劃出球");
        }
      }
    }   

  function checkWinner(){
  //找出贏家並結束遊戲 clearInterval()
  const paperWin = balls.every(ball => ball.imgSrc === "paper.png");
  const scissorWin = balls.every(ball => ball.imgSrc === "scissor.png");
  const stoneWin = balls.every(ball => ball.imgSrc === "stone.png");
  checkRanking();
  if(paperWin){
    clearInterval(game);
    
    rank += 2;
    startButton.disabled = false;
    const paperRank = document.createElement("div");
    const pwinner = document.createElement("div");
    paperRank.className = "rankArea";
    paperRank.id = "paperRank";
    paperRank.innerText = `第 1 名`;
    pwinner.className = "winner";
    pwinner.id = "winner";
    pwinner.innerText = "林昰斈被我打爛 ！";
    // pwinner.innerText = "paperWin ！";
    document.getElementById("paperCountArea").after(paperRank);
    document.getElementById("win").after(pwinner);
    console.log("paperWin");
  }else if(scissorWin) {
    clearInterval(game);
    
    rank += 2;
    startButton.disabled = false;
    const scissorRank = document.createElement("div");
    const srwinner = document.createElement("div");
    scissorRank.className = "rankArea";
    scissorRank.id = "scissorRank";
    scissorRank.innerText = `第 1 名`;
    srwinner.className = "winner";
    srwinner.id = "winner";
    srwinner.innerText = "林昰斈被我打爛 ！";
    // srwinner.innerText = "scissorWin ！";
    document.getElementById("scissorCountArea").after(scissorRank);
    document.getElementById("win").after(srwinner);
    console.log("scissorWin");
  }else if(stoneWin){
    clearInterval(game);
    
    rank += 2;
    startButton.disabled = false;
    const stoneRank = document.createElement("div");
    const swinner = document.createElement("div");
    stoneRank.className = "rankArea";
    stoneRank.id = "stoneRank";
    stoneRank.innerText = `第 1 名`;
    swinner.className = "winner";
    swinner.id = "winner";
    swinner.innerText = "林昰斈被我打爛 ！";
    // swinner.innerText = "stoneWin ！";
    document.getElementById("stoneCountArea").after(stoneRank);
    document.getElementById("win").after(swinner);
    console.log("stoneWin");
  }
  
  function checkRanking() {

    if (paperCount === 0 && !document.getElementById("paperRank")) {
      const paperRank = document.createElement("div");
      paperRank.className = "rankArea";
      paperRank.id = "paperRank";
      paperRank.innerText = `第 ${rank} 名`;
      document.getElementById("paperCountArea").after(paperRank);
      rank--;
    }
    
    if (scissorCount === 0 && !document.getElementById("scissorRank")) {
      const scissorRank = document.createElement("div");
      scissorRank.className = "rankArea";
      scissorRank.id = "scissorRank";
      scissorRank.innerText = `第 ${rank} 名`;
      document.getElementById("scissorCountArea").after(scissorRank);
      rank--;
    }
    
    if (stoneCount === 0 && !document.getElementById("stoneRank")) {
      const stoneRank = document.createElement("div");
      stoneRank.className = "rankArea";
      stoneRank.id = "stoneRank";
      stoneRank.innerText = `第 ${rank} 名`;
      document.getElementById("stoneCountArea").after(stoneRank);
      rank--;
    }
  }
  function moveTenTimes(){
    for(let i = 0; i<10; i++){
      
      console.log("hahaha");
    }
  }
  
  }

  //全部組合起來
  function animate(){
    handleCollision();
    move();
    boundaryCheck();
    drawBalls();
    checkWinner();
  }
  function count(){
    let paperCount = 0;
    let scissorCount = 0;
    let stoneCount = 0;
    for(let ball of balls){
      if(ball.imgSrc === "paper.png"){
        paperCount++;
      }else if(ball.imgSrc === "scissor.png"){
        scissorCount++;
      }else if(ball.imgSrc === "stone.png"){
        stoneCount++;
      }
      console.log("布有" + paperCount + "個" + " "+
                  "剪刀有" + scissorCount + "個" + " "+
                  "石頭有" + stoneCount + "個" + " "
      );
    }
  }
  
  setTimeout(() => {
    game = setInterval( animate, 25);
    console.log("setTimeout");
  },500);


}





