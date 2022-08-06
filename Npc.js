
export default class Npc{
  constructor(scene, x, y){
    this.x=x
    this.y=y
    this.maxX=300
    this.maxY=250
    this.timer=0
    this.direccion="down"
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x,y, "npc")
    this.sprite.onCollide =true
  }


  update(){
    //metodo que moverá el npc
 
    this.timer++
    if(this.timer == 150){
      this.direccion = this.cambiaDireccion()
      this.timer = 0

    }
    
    switch(this.direccion){
      case "down":
        this.sprite.body.setVelocityY(50);
        break;
      case "up":
        this.sprite.body.setVelocityY(-50);
        break
      case "left":
        this.sprite.body.setVelocityX(-50)
        break
      case "right":
        this.sprite.body.setVelocityX(50)
        break
    }

    //limites de movimiento
    if(this.sprite.body.position.x<=0){
     this.direccion='right' 
     this.sprite.anims.play("right")
     this.sprite.body.setVelocityY(0)
    }else if(this.sprite.body.position.x >= this.x +this.maxX){
      this.direccion='left' 
      this.sprite.anims.play("left")
      this.sprite.body.setVelocityY(0)
    }else if(this.sprite.body.position.y <=0){
      this.direccion = 'down'
      this.sprite.anims.play("down")
      this.sprite.body.setVelocityX(0)

    }else if(this.sprite.body.position.y >= this.y+this.maxY){
      this.direccion = 'up'
      this.sprite.anims.play("up")
      this.sprite.body.setVelocityX(0)

    }

    
  }

  cambiaDireccion(){

  let numero = Math.floor(Math.random()*4)


  if(numero == 0){
    this.sprite.body.setVelocityX(0)
    this.sprite.anims.play("down")
    return 'down'
  }else if(numero == 1){
    this.sprite.body.setVelocityX(0)
    this.sprite.anims.play("up")
    return "up"
  }else if(numero == 2){
    this.sprite.body.setVelocityY(0);
    this.sprite.anims.play("right")
    return "right"
  }else if(numero == 3)
    this.sprite.body.setVelocityY(0);
    this.sprite.anims.play("left")
    return 'left'
  }

  //asigna sprites
  createAnims(sprite){
    this.sprite.anims.create(
      {
      key: 'down',
      frames: this.sprite.anims.generateFrameNumbers(sprite, {start:0, end:2}),
      frameRate:3.5,
      repeat: -1
    })
    this.sprite.anims.create(
      {
      key: 'left',
      frames: this.sprite.anims.generateFrameNumbers(sprite, {start:11, end:13}),
      frameRate:4,
      repeat: -1
    })
    this.sprite.anims.create(
      {
      key: 'right',
      frames: this.sprite.anims.generateFrameNumbers(sprite, {start:22, end:24}),
      frameRate:4,
      repeat: -1
    })
    this.sprite.anims.create(
      {
      key: 'up',
      frames: this.sprite.anims.generateFrameNumbers(sprite, {start:33, end:35}),
      frameRate:4,
      repeat: -1
    })
  }

  handleCollisions(){
    
    switch(this.direccion){
      case "up": 
        this.sprite.body.setVelocityX(0)
        this.sprite.anims.play("down")
        this.direccion="down"
        this.update()
       break
     case "down": 
     this.sprite.body.setVelocityX(0)
     this.sprite.anims.play("up")
     this.direccion = "up"
     this.update()
      break
     case "left": 
     this.sprite.body.setVelocityY(0)
        this.sprite.anims.play("right")
        this.direccion= "right"
        this.update()
      break
     case "right": 
     this.sprite.body.setVelocityY(0)
        this.sprite.anims.play("left")
        this.direccion="left"
        this.update() 
           }
  }

}