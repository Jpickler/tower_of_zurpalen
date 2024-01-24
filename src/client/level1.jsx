// level1.jsx

import {CST} from "./loading_menu/CST.jsx"

import eventsCenter from './EventsCenter.jsx' // this allows communication between scenes

import { PauseScene } from "./pauseScene.jsx";


export class Level1 extends Phaser.Scene {
    constructor(){
        super({
            key: CST.SCENES.LEVEL1
        })    
    this.player;
    this.chest1;
    this.chest2;
    this.cursors;
    this.gameOver=false;

    }
    
  init(){

  }

  preload ()
  {
      this.load.image('floor', '/assets/floor.png');
      this.load.image('tiles', '/assets/25x25Tiles.png');
      this.load.tilemapTiledJSON('map', '/assets/level1.json');
  
  
      // the three classes sprites load here
      // ************************** needs logic to choose sprite based on character sheet ***********************
      // this.load.spritesheet('playerSprite', 'assets/knight78x60.png', { frameWidth: 78, frameHeight: 60 });
      this.load.spritesheet('playerSprite', 'assets/mage78x60.png', { frameWidth: 78, frameHeight: 60 });
      // this.load.spritesheet('playerSprite', 'assets/rogue78x60.png', { frameWidth: 78, frameHeight: 60 });

      
      
      this.load.spritesheet('chest', 'assets/chest_sprite.png', {frameWidth: 32, frameHeight: 32 })
      this.load.spritesheet('goldCoin', 'assets/goldCoin.png', {frameWidth: 40, frameHeight: 40})
  
  }
  
  create ()
  {
  
    this.scene.run('pauseScene'); // used to keep the pause scene updated with stats causes pausescene to run in the background

    //  A simple background for our game
      this.add.image(800, 600, 'floor');
  
  
    // loads the map and makes the walls solid    
      const map = this.make.tilemap({key:"map"});
      const tileset = map.addTilesetImage('25x25Tiles', 'tiles');
      const WorldLayer = map.createLayer("WorldLayer", tileset, 0, 0);
      WorldLayer.setCollisionByProperty({ collides: true });
  
  
     
      // The player and its settings
      this.player = this.physics.add.sprite(90, 90, 'playerSprite');
      this.player.setSize(60,54);
  
      // keep the player on the map
      this.player.setCollideWorldBounds(true); 
      this.physics.add.collider(this.player, WorldLayer);
  
      //  Our player animations, turning, walking left and walking right.
      this.anims.create({
          key: 'left',
          frames: this.anims.generateFrameNumbers('playerSprite', { start: 9, end: 12 }),
          frameRate: 10,
          repeat: -1
      });
  
      this.anims.create({
          key: 'turn',
          frames: [ { key: 'playerSprite', frame: 1 } ],

          frameRate: -1
      });
  
      this.anims.create({
          key: 'right',
          frames: this.anims.generateFrameNumbers('playerSprite', { start: 2, end: 5 }),
          frameRate: 10,
          repeat: -1
      });

      this.anims.create({
        key: 'attackRight',
        frames: this.anims.generateFrameNumbers('playerSprite', { start: 14, end: 19 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'attackLeft',
        frames: this.anims.generateFrameNumbers('playerSprite', { start: 20, end: 25 }),
        frameRate: 10,
        repeat: -1
    });
  
      //  Input Events
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys({
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D,
        k: Phaser.Input.Keyboard.KeyCodes.K,
        p: Phaser.Input.Keyboard.KeyCodes.P,
    
       });
  
       this.collectItem = (item) => {
        console.log('collecting item function');
        item.destroy();        //item is removed from the scene

        //item is added to inventory
          console.log('Character Gold should be increasing');
          eventsCenter.emit('updateGold', 3);
          eventsCenter.emit('Test');
          console.log('emit should have been sent');
      };

       //chests
      const openChest = (chest) => {
          if (this.keys.k.isDown){  // this line requires attack button to open chest
          chest.setFrame(1);
          // eventsCenter.emit('Test');

        //add code here for loot
            const gold = this.physics.add.sprite(370,60,'goldCoin');
            gold.setSize(22,22);
            this.physics.add.collider(this.player, gold, () => {
                    console.log('Player collided with gold coin');
                    this.collectItem(gold);
            }, null, this);
          };
      };   

      this.chest1 = this.physics.add.staticSprite(300, 40, 'chest', 2);
      this.chest2 = this.physics.add.staticSprite(700, 550, 'chest', 2);
  
 
  
      this.physics.add.collider(this.player, this.chest1, ()=>openChest(this.chest1));
      this.physics.add.collider(this.player, this.chest2, ()=>openChest(this.chest2));
    //   this.physics.add.collider(this.player, this.gold, ()=>collectItem(this.gold));


  
      
       //camera controls, follows player and zooms in
       this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
       this.cameras.main.setZoom(3); // 1 is the default zoom level
        // Set boundaries for the camera
    //   this.cameras.main.setBounds(0, 0, 1600, 1200);k
      this.cameras.main.setBounds(-200, -200, 2000, 1600);

     
      eventsCenter.on('gameOver', (bool)=> {
        console.log('someone quit the game');
        this.gameOver = bool;

    }, this);
      
  }
  
  update ()
  {
      if (this.gameOver)
      {
          return;
      }
  
      if (this.keys.a.isDown || this.cursors.left.isDown)
      {
          this.player.setVelocityX(-160);
  
          this.player.anims.play('left', true);
      }
      else if (this.keys.d.isDown || this.cursors.right.isDown)
      {
          this.player.setVelocityX(160);
  
          this.player.anims.play('right', true);
      }
      else
      {
        this.player.setVelocityX(0);
  
        this.player.anims.play('turn', true);
      }
      if(this.keys.w.isDown || this.cursors.up.isDown)
      {
          this.player.setVelocityY(-160);
  
          this.player.anims.play('left', true);
      }
      else if(this.keys.s.isDown || this.cursors.down.isDown)
      {
          this.player.setVelocityY(160);
  
          this.player.anims.play('right', true);
      }
      else
      {
        this.player.setVelocityY(0);
      }
  
      if (this.keys.k.isDown)
      {
          this.player.anims.play('attackLeft', true);
        //   this.player.on('animationupdate-attackRight', function (animation, frame) {
        //     console.log(frame.frame.name);
   
        
  
      }
      if (this.keys.p.isDown)
      {
          console.log('p is pressed, pausing game');
            this.scene.pause("LEVEL1");
            this.scene.launch("PAUSE");
      }
  
  }
  
  };
