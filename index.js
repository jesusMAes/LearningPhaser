
import Npc from './Npc.js';
//en game tenemos una clase que implementa la escena del juego

let dialogBox = document.querySelector('#UI')


const config = {
  type: Phaser.AUTO,
  width:768,
  height:768,
  parent: 'game-container',
  zoom:2,
   scene: {
    preload: preload,
    create: create,
    update: update
  },//la escena que se ejecuta, la programamos en game.js
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y:0},
      debug: false
    }
  }
}

//la fisica arcade incluye colisiones, si queremos movimiento libre en eje y como en un mapa visto desde arriba ponemos gravedad 0

var game = new Phaser.Game(config)


  //ejecuta cosas como cargar imagenes, mapas y tal antes de que empiece el juego
  //la función load crea la imagen y te libra de movidas con el evento onload
function  preload(){

    this.load.image('tiles', './Assets/pokemonTileset.png');
    this.load.tilemapTiledJSON('map', './Assets/phaserMap.json')
    this.load.spritesheet('player', './Assets/player1.png', {frameWidth:68, frameHeight:72})

    this.load.spritesheet('npc','./Assets/npcs.png',{frameWidth:70, frameHeight:92} )
    //emotes
    this.load.spritesheet('emotes','./Assets/stardewValleyEmotes.png',{frameWidth:16, frameHeight:16})

    //plugin de animated tiles
    this.load.scenePlugin({
      key: 'AnimatedTiles',
      url: './node_modules/phaser-animated-tiles/dist/AnimatedTiles.js',
      
  },true);

    //background del dialogo
    this.load.spritesheet('dialog','./Assets/dialog.png',{frameWidth:320, frameHeight:200})


  }

let player;
let npc;
let cursors;
let interact;
let emote;
let talking;
var escena;
let content;
var i = 0;
  //se ejecuta una vez preload termine
  //en el se mete todo lo de la escena, personaje, enemigos, mapa y tal, y se actualizan luego en update
function create(){
   escena= this.scene

  //registro de teclas
   cursors = this.input.keyboard.createCursorKeys()
   interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    console.log(this.sys)
    //creamos el mapa
    const map = this.make.tilemap({key: 'map'})

    //le añadimos el tileset
    const tileset = map.addTilesetImage('pokemonTileset', 'tiles')

    //creamos las capas
    const belowLayer = map.createLayer('Below Player', tileset, 0,0);
    const worldLayer = map.createLayer('World', tileset, 0,0);
    const animateLayer = map.createLayer('Animated', tileset,0,0)
    //es después de creadas las capas que se dibuja

    //colisiones
    worldLayer.setCollisionByProperty({collides:true})
    
    npc = new Npc(this, 250,50)
    npc.sprite.setScale(0.4)
    npc.sprite.setSize(48,5)
    npc.createAnims('npc');
    npc.sprite.body.immovable = true
    npc.sprite.anims.play('down')
     
    //usar un objeto de tiled para posicionar al player
     const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point")
    //añadir jugador
    player = this.physics.add.sprite(spawnPoint.x,spawnPoint.y,'player')
    player.setOrigin(0,0)//para que la camara pueda seguirle

    player.setScale(0.5)
    player.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player',{start:1, end:3}),
      frameRate:5,
      repeat:-1
    })
    player.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player',{start:4, end:7}),
      frameRate:5,
      repeat:-1
    })
    player.anims.create({
      key:'right',
      frames: this.anims.generateFrameNumbers('player',{start:8, end:11}),
      frameRate:5,
      repeat:-1
    })
    player.anims.create({
      key:'up',
      frames: this.anims.generateFrameNumbers('player',{start:12, end:15}),
      frameRate:5,
      repeat:-1
    })
    player.dialog = "eee"
    player.anims.play('down', true)
    

    //con esto cambiamos el tamaño del pj, lo que afecta a sus colisiones, he puesto la y peque porque me hace colisiones raras
    player.body.setSize(48,45)

    //movemos esta capa para que se dibuje después del player
    const aboveLayer =map.createLayer('Above Player', tileset, 0,0);

    //colisiones, le dice que esos dos objetos pueden chocar

    this.physics.add.collider(player,worldLayer)
    this.physics.add.collider(player,npc.sprite,npc.handleCollisions, null, npc)
    this.physics.add.collider(npc.sprite,worldLayer, npc.handleCollisions,null,npc)

 

    this.cameras.main.setBounds(0,0)//limites de la camara, se pueden poner por el otro lado pero no me sale, mejor hacer el mapa más grande y poner colisiones en los límites
    this.cameras.main.startFollow(player,true);//true habilita pixeles redondeados, evita que el mapa se desdibuje cuando te mueves

    //emote para hablar con npcs 
     emote = this.add.sprite(player.x,player.y,'emotes')
     emote.visible = false
     emote.anims.create({
      key: 'begin',
      frames: this.anims.generateFrameNumbers('emotes',
      {start:0, end:3}),
      frameRate:20,
      
    })
    emote.anims.create({
      key: 'talk',
      frames: this.anims.generateFrameNumbers('emotes',
      {start:40, end:43}),
      frameRate:5,
      
    })
    
     content = "este es mi primer dialogo"
    //pausar la escena durante el dialogo
    talking = function (escena){
     escena.pause()
     dialogBox.style.bottom = player.y+50
    
     dialogBox.style.display = 'block'
     typeWriter(escena)
    }
    

    //animated tiles
     console.log(this.sys.AnimatedTiles)
    this.sys.AnimatedTiles.init(map)
  }

  //el metodo que se ejecuta continuamente
function update(){

    //mover el jugador
   player.body.setVelocity(0)
   emote.x = player.x+15
   emote.y = player.y
   npc.update()
   let distancia = Phaser.Math.Distance.Between(player.x,player.y, npc.sprite.x, npc.sprite.y)
  
   if(distancia <50){
    if(interact.isDown){
      talking(escena);
    }
   }
   if(distancia < 50 && distancia >45){
    emote.visible =true
    emote.anims.play('begin')
    emote.on('animationcomplete',()=> emote.anims.play('talk'))
   }else if(distancia > 50){
    emote.visible = false
   }

   if(cursors.left.isDown){
    player.body.setVelocityX(-100)
    player.body.setVelocityY(0)
    player.anims.play('left',true)
   }else if(cursors.right.isDown){
    player.body.setVelocityX(100)
    player.body.setVelocityY(0)
    player.anims.play('right',true)
   }else 

  if(cursors.up.isDown){
    player.body.setVelocityY(-100)
    player.body.setVelocityX(0)
    player.anims.play('up',true)
   }else if(cursors.down.isDown){
    player.body.setVelocityY(100)
    player.body.setVelocityX(0)
    player.anims.play('down',true)
   }


  }



var speed = 25; /* The speed/duration of the effect in milliseconds */

function typeWriter(escena) {
  if (i < content.length) {
    dialogBox.innerHTML += content.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }else{
    i=0
    checkState(escena)
  }
}

function checkState(){
   
   window.addEventListener('keydown', (e)=>{
    if(e.key=='a'){
      dialogBox.style.display='none'
      dialogBox.innerHTML=''
      i=0
      window.removeEventListener("keydown",this)
      game.scene.resume('default')
      
    }
   })
}


//CREAR MAPAS DESDE TILED:
//debemos exportar el mapa como json y asegurarnos de que el tileset está embebido

//luego en preload usamos this.load.image para cargar el tileset y this.load.tilemapTiledJSON para cargar el json:

//this.load.tilemapTiledJSON ("clave", "ubicacion del mapa")

//una vez precargado nos vamos a la función create, allí creamos una variable map y decimos que es igual a this.make.tilemap y le pasamos la clave que le dimos 

//podemos crear capas en el mapa, para eso creamos una variable y le decimos que es igual a map.createLayer("Nombre de la capa de tiled", tiledet, posicion x e y)

//eso sirve para renderizar en un orden concreto, como las cosas que queremos que tapen a nuestro jugador

//CREAR COLISIONES

//para crear colisiones necesitas cuatro cosas:
// 1. marcar algunas casillas de la capa worl como colisionables, para que arcade physics sepa que lo son

// 2. Habilitar arcade physics

// 3. crear un sprite physic based para tu jugador

// 4. decirle al jugador que colisiona con worldlayer (el objeto de la capa world)

//paso 1: marcar casillas: para eso vamos a tiled, al tileset, seleccionamos todas las casillas y añadimos una propiedad collides, luego vamos a las casillas en las que queremos colision y ponemos esa propiedad en true

//paso 2, le decimos a la capa world que ponga las colisiones en base a una propiedad del tile (el json da las propiedades de cada tile)
// worldLayer.setCollisionsByProperty({collides: true})


//añadir al jugador. Imagino que habrá mejores maneras, aquí lo hace creando una variable player= this.physic.add.sprite, si lo entiendo le dice que es un sprite y que tiene fisicas, en los parametros creo que le pasa la x, la y, el nombre del spritesheet y el nombre de la animación 

//parece que usar los sprites en phgaser es más dificil, 
//tenemos que cargar el spritesheet, en preload ponemos: this.load.spritesheet('player', './Assets/npcsSprites.png' pero los dos ultimos parametros son el alto y ancho de cada frame), podemos crear animaciones, así:
//  player.anims.create({
//      key: 'left',
//   frames: this.anims.generateFrameNumbers('player',{start:1, end:3}),
//      frameRate:5,
//      repeat:-1  })

//key es la clave por la que la llamamos para que se reproduzca: player.anims.play('left', true)

//generate frame numbers es importante porque es lo que corta la imagen

//hacer las colisiones es tan fácil como esto this.physics.add.collider(player,worldLayer)

//para manipular la camara llamamos  this.cameras.main.startFollow(player,true);, player lo mueve, importante poner el origin de player en 0,0 para que la camara empiece desde arriba a la izquierda, y los limites (bounds) en 0,0 para que no pase del limite del mapa


//algo muy curioso es que podemos poner puntos en tiled para que aparezcan los personajes, para ello creamos una capa de objetos, para ello la creamos en tiled y le ponemos el botoncito ese de ubicacion,al objeto le damos un nombre para recuperarlo luego por el, esto sirve para nosotros y lo mismo también para npcs y hacerles paths y tal

//para recuperar ese objeto usamos map.findobjects, le pasamos la capa y esto raro : obj => obj.name === spawn point, que entiendo que es como una pseudo arrow que recorre los objetos y devuelve el que le coincida el nombre

//para gestionar eventos de colisiones lo hacemos en el metodo que añade la colision, this.physics.add.collider y le pasamos los objetos que pueden colisionar, como tercer argumento la función que se llamará cuando esos objetos colisionen, como cuarto null, y como quinto el contexto de esa función, si la tienes escrita en este archivo será this pero si el que tiene la función es el npc será npc, y si es el player pues será player

//cuando hacemos una collision nos pasa el objeto que la inicio, es decir si chocamos con el npc y decimos console.log(e) nos dará todas las propiedades de player, si le ponemos una propiedad dialogo podemos crear una función para llamarla, una forma de detectar cuando están cerca es:

// Mas facil, phaser nos da un metodo distance que nos dice la distancia entre dos objetos, chequeando esa distancia podemos lanzar una función

//IMPORTANTE, guarda la escena en una variable para luego en el metodo de la conversación poder usar su metodo pause

//una vez parada la escena creamos el dialogo, se usa un plugin raro, hay que cargarlo en el preload

//IMPORTANTE hay un plugin llamado grid system que permite mover los npcs de manera aleatoria y con colisiones sin problemas

//Para las casillas animadas también hay un plugin phaser-animated-tiles, si lo entiendo bien creas el mapa como quieras pero luego en la capa que tenga animaciones en lugar de createlayer debes usar createDynamicLayer

//el plugin se carga como cualquier otro y luego para usarlo en la función create pones: this.sys.animatedTiles.init(map), eso llama a la función del plugin y supongo que anima todas las capas dinámicas del mapa que le pasas