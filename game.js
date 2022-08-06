//la clase game extiende a phaser.scene

export class Game extends Phaser.Scene {
  constructor(){
    super({key: 'game'})//super usa el constructor de la clase scene, con la key podemos llamar a la escena cuando haga falta
  }

  //ejecuta cosas como cargar imagenes, mapas y tal antes de que empiece el juego
  //la función load crea la imagen y te libra de movidas con el evento onload
  preload(){
    this.load.image('tiles', './Assets/pokemonTileset.png');
    this.load.tilemapTiledJSON('map', './Assets/phaserMap.json')
    this.load.spritesheet('player', './Assets/player1.png', {frameWidth:68, frameHeight:70})
  }
let 
  //se ejecuta una vez preload termine
  //en el se mete todo lo de la escena, personaje, enemigos, mapa y tal, y se actualizan luego en update
  create(){

    
    //creamos el mapa
    const map = this.make.tilemap({key: 'map'})

    //le añadimos el tileset
    const tileset = map.addTilesetImage('pokemonTileset', 'tiles')

    //creamos las capas
    const belowLayer = map.createLayer('Below Player', tileset, 0,0);
    const worldLayer = map.createLayer('World', tileset, 0,0);
    const aboveLayer =map.createLayer('Above Player', tileset, 0,0);
    //es después de creadas las capas que se dibuja

    //colisiones
    worldLayer.setCollisionByProperty({collides:true})
    
    //añadir jugador
    let player = this.physics.add.sprite(100,100,'player')
    player.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player',{start:1, end:3}),
      frameRate:5,
      repeat:-1
    })
    player.anims.play('left', true)
    

  }

  //el metodo que se ejecuta continuamente
  update(time, delta){

    //mover el jugador
   player.body.setVelocity(0)

  }
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