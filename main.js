//ゲームのオブジェクトの生成
var Object;
//障害物の配列作成
var Obstacles = [];
//スコア定義
var Score;

//onloadしたときに読み込む関数
function startGame(){
  //オブジェクトの詳細定義
  Object = new component(30, 30, "red", 10, 120);
  Object.gravity = 0.05;
  Score = new component("30px", "Consolas", "black", 280, 40, "text");
  myGameArea.start();

}



var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d"); //canvasをhtmlで有効にする
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

//属性が同じときにはコンポーネントを作っておくとやりやすい
//jsベタうちではコンポーネントは自分でコンポーネント関数を作成して定義しなければならない
function component(width, height, color, x, y, type) {
  //this.props(プロップス名)
    this.type = type; //このコンポーネントの属性は引数typeにする
    this.score = 0;　//このコンポーネントのスコアは0
    this.width = width;　//このコンポーネントの横幅は引数widthにする
    this.height = height;　//このコンポーネントの縦幅は引数heightにする
    this.speedX = 0; //x軸方向のスピード0
    this.speedY = 0; //y軸方向のスピード0
    this.x = x; //x座標初期位置は引数xから受け取る
    this.y = y; //y座標初期位置は引数yから受け取る
    this.gravity = 0; //初期の重力propsは0
    this.gravitySpeed = 0; //初期の重力加速度は0
    //update関数の定義
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    //位置の更新
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }

    //床に当たったら
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }

    //衝突判定(true or falseで判定する)
    this.crashWith = function(otherobj) {
        var myleft = this.x; //Objectの左の座標
        var myright = this.x + (this.width); //Objectの右の座標
        var mytop = this.y; //Objectの上の座標
        var mybottom = this.y + (this.height); //Objectの下の座標
        var otherleft = otherobj.x; //障害物の左座標
        var otherright = otherobj.x + (otherobj.width); //障害物の右座標
        var othertop = otherobj.y; //障害物の上座標
        var otherbottom = otherobj.y + (otherobj.height); //障害物の下座標
        var crash = true; //予めtrueにしておく

        //ブロックの下座標が障害物のトップを下回った場合 かつ
        //ブロックの上座標が障害物の下座標を上回った場合　かつ
        //ブロックの右座標が障害物の左座標よりも小さくなった場合　かつ
        //ブロックの左座標が障害物の右座標よりも大きくなった場合
        //faule判定
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

//ゲームステージの更新
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < Obstacles.length; i += 1) {
        if (Object.crashWith(Obstacles[i])) {
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        Obstacles.push(new component(10, height, "green", x, 0));
        Obstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < Obstacles.length; i += 1) {
        Obstacles[i].x += -1;
        Obstacles[i].update();
    }
    Score.text="SCORE: " + myGameArea.frameNo;
    Score.update();
    Object.newPos();
    Object.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    Object.gravity = n;
}
