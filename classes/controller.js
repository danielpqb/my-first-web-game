class Controller {
  constructor({
    t = 0, //Count number of frames since animate starts
    position = { x: 0, y: 0 }, //Relative to canvas window
    lastKeyWS = "", //Was 'w' or 's' the Last Key Pressed
    lastKeyAD = "", //Was 'a' or 'd' the Last Key Pressed
    moveKeysDown = {
      w: isKeyDown("w"),
      a: isKeyDown("a"),
      s: isKeyDown("s"),
      d: isKeyDown("d"),
    },
    attackKeyDown = { space: isKeyDown(" ") },
    mobileTouchStart = null,
  }) {
    this.position = position;
    this.t = t;
    this.lastKeyWS = lastKeyWS;
    this.lastKeyAD = lastKeyAD;
    this.moveKeysDown = moveKeysDown;
    this.attackKeyDown = attackKeyDown;
    this.mobileTouchStart = mobileTouchStart;
  }

  //Listen wich keys was pressed down
  listenKeysDown() {
    this.mobileTouchHandler();

    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "w":
          this.lastKeyWS = "w";
          break;
        case "s":
          this.lastKeyWS = "s";
          break;
        case "a":
          this.lastKeyAD = "a";
          break;
        case "d":
          this.lastKeyAD = "d";
          break;
        case " ":
          if (player.isDead === false && player.state != "attacking") {
            player.attack();
          }
          break;
      }
    });
  }

  takeDamage(object, dmg) {
    //Calculate damage
    dmg = Math.min(object.hp, dmg);

    //Show damage numbers on screen
    if (object.isDead === false) {
      object.takingDamages.push({ damage: dmg, time: this.t });
    }

    //Reduce object hp
    if (object.hp - dmg <= 0) {
      object.hp = 0;
      object.die();
    } else {
      object.hp -= dmg;
      if (object.snared === false) {
        object.changeState("aching");
      }
    }
  }

  useSkill(object, id) {
    skActId++;
    const skill = new Skill({ id: id, caster: object, activationId: skActId });
    skill.creationTime = controller.t;
    skill.getSkillInfo();

    activeSkills.push(skill);
  }

  isIntersecting(block1, block2) {
    const left = block1[0] - block2[0];
    const up = block1[1] - block2[1];
    const right = block1[2] - block2[2];
    const down = block1[3] - block2[3];

    if (right >= 0 && left <= 0 && up <= 0 && down >= 0) {
      return true;
    } else {
      return false;
    }
  }

  mobileTouchHandler() {
    //TouchStart Event
    document.addEventListener("touchstart", (e) => {
      this.mobileTouchStart = {
        x: e.changedTouches[0].screenX,
        y: e.changedTouches[0].screenY,
      };
    });

    //TouchMove Event
    document.addEventListener("touchmove", (e) => {
      player.isMoving = true;

      //AD
      if (e.changedTouches[0].screenX > this.mobileTouchStart.x + 20) {
        this.lastKeyAD = "d";

        this.moveKeysDown = {
          ...this.moveKeysDown,
          a: false,
          d: true,
        };
      } else if (e.changedTouches[0].screenX < this.mobileTouchStart.x - 20) {
        this.lastKeyAD = "a";

        this.moveKeysDown = {
          ...this.moveKeysDown,
          a: true,
          d: false,
        };
      } else {
        this.moveKeysDown = {
          ...this.moveKeysDown,
          a: false,
          d: false,
        };
      }

      //WS
      if (e.changedTouches[0].screenY < this.mobileTouchStart.y - 20) {
        this.lastKeyWS = "w";

        this.moveKeysDown = {
          ...this.moveKeysDown,
          w: true,
          s: false,
        };
      } else if (e.changedTouches[0].screenY > this.mobileTouchStart.y + 20) {
        this.lastKeyWS = "s";

        this.moveKeysDown = {
          ...this.moveKeysDown,
          w: false,
          s: true,
        };
      } else {
        this.moveKeysDown = {
          ...this.moveKeysDown,
          w: false,
          s: false,
        };
      }
    });

    //TouchEnd Event
    document.addEventListener("touchend", () => {
      player.isMoving = false;
      this.moveKeysDown = {
        w: false,
        a: false,
        s: false,
        d: false,
      };
      this.mobileTouchStart = null
    });
  }
}
