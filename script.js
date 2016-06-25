var Pole = function(table) {
    this._$pole = $(table).children("tbody");
    this._pole = [];
    this._tr = $(this._$pole).children("tr");
    this.clear();
}

Pole.prototype = {
    get pole (){
        return this._pole;
    },
    
    set pole (value){
        if( Object.prototype.toString.call( value ) === '[object Array]' ) {
            this._pole = value;
            this.draw_pole(value);
        } else {
            throw TypeError;
        }
    } 
}

Pole.prototype.draw_pole = function(pole) {
    for (array = 0; array < pole.length; array++) {
            for (inserted_array = 0; inserted_array < pole[array].length; inserted_array++) {
                
                var td = $(this._tr[array]).children("td");
                
                if (Number.isInteger(pole[array][inserted_array])) {
                    if ($(td[inserted_array]).hasClass("food"))
                        $(td[inserted_array]).removeClass("food");
                    
                    $(td[inserted_array]).attr("id",pole[array][inserted_array]);
                    $(td[inserted_array]).addClass("snake");
                }
                
                else if ((typeof pole[array][inserted_array]) == "string") {
                    
                    if (pole[array][inserted_array] == "*") {
                        if ($(td[inserted_array]).hasClass("snake")) {
                            $(td[inserted_array]).removeAttr("id");
                            $(td[inserted_array]).removeClass("snake"); 
                        }
                        else if ($(td[inserted_array]).hasClass("food"))
                            $(td[inserted_array]).removeClass("food"); 
                    }
                    
                    else if (pole[array][inserted_array] == "food") {
                        $(td[inserted_array]).addClass("food");
                    }
                }
                
                else throw TypeError;
            }
      }
}

Pole.prototype.clear = function() {
    var clear_pole = [];
    for (i = 0; i < this._tr.length; i++) {
        clear_pole.push(new Array);
        for (j = 0; j < $(this._tr[0]).children("td").length; j++)
            clear_pole[i].push("*");
    }
    
    this.pole = clear_pole;
}



var Snake = function(lenght,pole) {
    this.length = lenght;
    this.pole = pole;
}

Snake.prototype.create = function(pole) {
    if (this.length < pole[0].length) {
        for (i = this.length,j = 0; i >= 1; i--,j++) {
            pole[0][j] = i;
        }
        return pole;
    }
    
    else throw Error("Snake length > Pole length");
}

Snake.prototype.move = function(pole,my,mx) {
    var max_length = 0;
    for (i = 0; i < pole.length; i++)
        for (j = 0; j < pole[i].length; j++)
            if (Number.isInteger(pole[i][j]))
                if (pole[i][j] > max_length)
                    max_length = pole[i][j];
    
    
    var y;
    var x;
    for (i = 1; i <= max_length; i++)
        for (j = 0; j < pole.length; j++) {
            if (pole[j].indexOf(i) != -1) {
                if (i == 1) {
                    x = pole[j].indexOf(i);
                    y = j;
                    var result = this.checkCollision(pole,my,mx,x,y);
                    if (result)
                        return false;
                    else if (typeof result == "object") {
                        x = result.x;
                        y = result.y; 
                    }
                    pole[y + my][x + mx] = pole[y][x];
                    pole[y][x] = "*";
                } else {
                    var prev = pole[j].indexOf(i);
                    if (prev != -1) {
                        pole[j][prev] = "*";
                        pole[y][x] = i;
                        x = prev;
                        y = j;
                    }
                } 
                break;
            }
        }
    return pole;
}

Snake.prototype.getSnake = function(pole) {
    var snake = [];
    for (i = 0; i < pole.length; i++)
        for (j = 1; j <= this.length; j++) {
            x = pole[i].indexOf(j);
            if (x != -1) {
                snake.push(new Object);
                snake[snake.length - 1] = new Object({y: i,x: x,number: pole[i][x]});
            }
            
            if (snake.length == this.length)
                return snake;
        }
    return snake;
}

Snake.prototype.delateSnake = function(pole) {
    for (i = 0; i < pole.length; i++)
        for (j = 0; j < pole[i].length; j++)
            if (typeof pole[i][j] == "number")
                pole[i][j] = "*";
    return pole;
}

Snake.prototype.setSnake = function(pole,snake) {
    pole = this.delateSnake(pole);
    for (i = 0; i < snake.length; i++)
        pole[snake[i].y][snake[i].x] = snake[i].number;
    return pole;
}

Snake.prototype.checkCollision = function(pole,my,mx,x,y) {
    if (y + my >= pole.length || y + my < 0 || x + mx == pole[j].length || x + mx < 0)
        return true;
    else if (pole[y + my][x + mx] != "*" && pole[y + my][x + mx] != "food")
        return true;
    else if (pole[y + my][x + mx] == "food") {
        this.length++;
        var current_snake = this.getSnake(pole);
        current_snake.forEach(function(obj,num) {
            obj.number++;
        });
        current_snake.unshift(new Object({y: y + my, x: x + mx, number: 1}));
        console.log("food");
        console.log(current_snake);
        this.pole.pole = this.setSnake(this.pole.pole,current_snake);
        console.log(current_snake);
        return new current_snake[0];
    }
}


//food
var Food = function() {
    
}

Food.prototype.setFood = function(pole) {
    var position = {
        x: this.randomInt(0,pole.length),
        y: this.randomInt(0,pole[0].length)
    };
    
    if (pole[position.y][position.x] == "*") {
        pole[position.y][position.x] = "food";
        return pole;
    }
        
    else this.setFood(pole);
} 

Food.prototype.randomInt = function randomInteger(min, max) {
    var rand = min + Math.random() * (max - min)
    rand = Math.round(rand);
    return rand;
}

Food.prototype.exist = function (pole) {
    for (i = 0; i < pole.length; i++)
        for (j = 0; j < pole[i].length; j++)
            if (pole[i][j] == "food")
                return true;
    return false;
}



// Game object
var Game = function(mx,my,speed,snake_length) {
    this.mx = mx;
    this.my = my;
    this.speed = speed;
    this.snake_length = snake_length;
    this._interval;
    this.pole = new Pole("#pole");
    this.snake = new Snake(snake_length,this.pole);
    this.food = new Food();
}

Game.prototype.start = function() {
    this.pole.pole = this.food.setFood(this.pole.pole);
    score = 0;
    $("#score").html("You score: " + score);
    this.snake.length = 5;
    this.pole.pole = this.snake.create(this.pole.pole);
    this.interval = setInterval((function() {
        var get_move = this.snake.move(this.pole.pole,this.my,this.mx);
        if (get_move != false)
            this.pole.pole = get_move;
        else this.game_over();
        
        if (!this.food.exist(this.pole.pole)) {
            this.pole.pole = this.food.setFood(this.pole.pole);
            score += 13;
            $("#score").html("You score: " + score);
        }
            
        
    }).bind(this),this.speed);
        console.log(this.snake.getSnake(this.pole.pole));
}

Game.prototype.game_over = function() {
    alert("GAME OVER");
    this.stop_game();
    this.mx = 1;
    this.my = 0;
    this.pole.clear();
    this.start();
}

Game.prototype.stop_game = function() {
    clearInterval(this.interval);
}



var Snake_Game;
var score = 0;
$(document).ready(function() {
    $(window).keydown(keydown);
    Snake_Game  = new Game(1,0,100,5);
    $(window).bind("click",function() {
        Snake_Game.stop_game();
        var s = Snake_Game.snake.getSnake(Snake_Game.pole.pole);
    });
    
    Snake_Game.start();
    //Snake_Game.stop_game();
    console.log(typeof 1);
});


var KEY_CODE = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    W: 87,
    D: 68,
    A: 65,
    S: 83
};

function keydown(event) {
    var snake_x;
    var snake_y;
    
    for (i = 0; i < Snake_Game.pole.pole.length; i++) {
        snake_x = Snake_Game.pole.pole[i].indexOf(1);
        if (snake_x != -1) {
            snake_y = i;
            break;
        }
            
    }
            
    switch(event.keyCode) {
        case KEY_CODE.LEFT:
        if (Snake_Game.mx != 1) {
            Snake_Game.mx = -1;
            Snake_Game.my = 0; 
        }  
        break;
        case KEY_CODE.A:
        if (Snake_Game.mx != 1) {
            Snake_Game.mx = -1;
            Snake_Game.my = 0; 
        }  
        break;
        case KEY_CODE.UP:
        if (Snake_Game.my != 1) {
            Snake_Game.mx = 0;
            Snake_Game.my = -1;
        }
        break;
        case KEY_CODE.W:
        if (Snake_Game.my != 1) {
            Snake_Game.mx = 0;
            Snake_Game.my = -1;
        }
        break;    
        case KEY_CODE.RIGHT:
        if (Snake_Game.mx != -1) {
            Snake_Game.mx = 1;
            Snake_Game.my = 0;
        }
        break;
        case KEY_CODE.D:
        if (Snake_Game.mx != -1) {
            Snake_Game.mx = 1;
            Snake_Game.my = 0;
        }
        break;
        case KEY_CODE.DOWN:
        if (Snake_Game.my != -1) {
            Snake_Game.mx = 0;
            Snake_Game.my = 1;
        }
        break;     
        case KEY_CODE.S:
        if (Snake_Game.my != -1) {
            Snake_Game.mx = 0;
            Snake_Game.my = 1;
        }
        break;   
        }
}


