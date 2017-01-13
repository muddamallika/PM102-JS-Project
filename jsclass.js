//Example 1
function Car(type, color, maxspeed) {
  this.type = type;
  this.color = color;
  this.maxspeed = maxspeed;
}
//In the browser it will the global object.
//Here the car object has inherited from the base Object{}

var car = new Car('cabrio','red','300km/');
//a new empty object will be created with above variables and then be assigned the values.

console.log(car.type + ''+car.maxspeed);
//Will print this in the console

console.log(car.constructor.name);
//car

console.log(car.constructor.prototype);
//result will be an object

// In JS we will have 'Base Objects' concept. This from where the other objects inherit the behaviour

//Problem with the constructors - if the
//Example 2
function Car(type, color, maxspeed) {
  this.type = type;
  this.color = color;
  this.maxspeed = maxspeed;
  this.setSpeed = function(speed){ //if the objects are intialised in this manner then there will be no protection for the objects
    this.speed = speed;
  }
}
//In the browser it will the global object.
//Here the car object has inherited from the base Object{}

var car = new Car('cabrio','red','300km/');
//a new empty object will be created with above variables and then be assigned the values.
car.setSpeed('120km/h')
console.log(car.type + ''+car.maxspeed);
//Will print this in the console

console.log(car.constructor.name);
//car
console.log(car.constructor.prototype);



//Example 3
function Car(type, color, maxspeed) {
  var i_type = type;
  var i_color = color;
  var i_maxspeed = maxspeed;

  this.getType = fucntion(){
    return i_type;
  }

  this.getcolor = fucntion(){
    return i_color;
  }

  this.getMaxSpeed = fucntion(){
    return i_maxspeed;
  }

  var i_speed = '0km/hr';


  this.setSpeed = function(speed){ //if the objects are intialised in this manner then there will be no protection for the objects
    this.speed = speed;
  };

  this.getSpeed = function(){
    return i_Speed;
  };

  var i_method = fucntion(){
    return i_type; //this cant be called from outside, because this is private method
  };

  var i_method = fucntion(){

    return i_type; //this cant be called from outside
  };
}
//In the browser it will the global object.
//Here the car object has inherited from the base Object{}

var car = new Car('cabrio','red','300km/');
//a new empty object will be created with above variables and then be assigned the values.
car.setSpeed('120km/h')
console.log(car.getcolor());
console.log(car.getMaxSpeed());
console.log(car.getType());
console.log(car.getSpeed());


//Sometimes you might wanna change the base object. then
Object.sayHello = function(){
  console.log('Hello');
};

car.sayHello();

//the above code doesn't work

Object.prototype.sayHello = function(){
  console.log('Hello');
};

car.sayHello();
// the above code will work and prints 'Hello'
