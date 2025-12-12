from ursina import *
import random

app = Ursina()

# ---------------- Player ----------------
player = Entity(model='cube', color=color.azure, scale=(1,2,1), collider='box', position=(0,1,0))
player.health = 100

# ---------------- Ground ----------------
ground = Entity(model='plane', scale=(50,1,50), texture='white_cube', texture_scale=(50,50), collider='box')

# ---------------- Zombies ----------------
zombies = []
zombie_count = 5

score = 0
score_text = Text(text=f"Score: {score}", position=(-.85,.45), origin=(0,0), scale=1.5)
health_text = Text(text=f"Health: {player.health}", position=(-.85,.4), origin=(0,0), scale=1.5, color=color.red)

def spawn_zombie():
    z = Entity(model='cube', color=color.red, scale=(1.5,2,1.5),
               position=(random.randint(-20,20),1,random.randint(-20,20)),
               collider='box')
    z.health = 50
    zombies.append(z)

for i in range(zombie_count):
    spawn_zombie()

# ---------------- Sounds ----------------
# Placeholder: Add your .wav or .mp3 files here
# attack_sound = Audio('attack.wav', autoplay=False)
# zombie_sound = Audio('zombie_groan.wav', autoplay=False)

# ---------------- Update Loop ----------------
def update():
    global score

    speed = 5 * time.dt

    # ---------------- Player Controls ----------------
    move = Vec3(held_keys['d'] - held_keys['a'], 0, held_keys['s'] - held_keys['w'])
    player.position += move * speed

    # Camera follow
    camera.position = (player.x, 10, player.z - 20)
    camera.look_at(player)

    # ---------------- Zombies AI ----------------
    for z in zombies:
        direction = (player.position - z.position).normalized()
        z.position += direction * time.dt * 2.5  # speed

        # Attack player if collision
        if z.intersects(player).hit:
            player.health -= 10 * time.dt  # damage per second
            health_text.text = f"Health: {int(player.health)}"
            if player.health <= 0:
                application.pause()
                Text(text="💀 Game Over!", scale=2, origin=(0,0), background=True, color=color.red)

# ---------------- Input / Attack ----------------
def input(key):
    global score
    if key == 'space':
        # attack nearest zombie
        if zombies:
            target = min(zombies, key=lambda z: distance(player, z))
            if distance(player, target) < 3:
                target.health -= 50
                # attack_sound.play()  # Uncomment when sound added
                if target.health <= 0:
                    destroy(target)
                    zombies.remove(target)
                    score += 1
                    score_text.text = f"Score: {score}"
                    spawn_zombie()

# ---------------- Mobile Touch (simulated) ----------------
# Note: For real mobile, integrate Kivy or Godot touch joystick
def touch_input_simulation():
    if held_keys['left arrow']:
        player.x -= 0.1
    if held_keys['right arrow']:
        player.x += 0.1
    if held_keys['up arrow']:
        player.z -= 0.1
    if held_keys['down arrow']:
        player.z += 0.1

# Call touch_input_simulation in update loop
app.run()