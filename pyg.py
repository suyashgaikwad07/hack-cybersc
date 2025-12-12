import pygame
import random
import sys

# --- 1. INITIALIZATION ---
pygame.init()

# Define Screen/Game Constants
WIDTH, HEIGHT = 800, 600
SCREEN = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pygame Zombie Shooter")

# Define Colors
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 200, 0) # Player Color
WHITE = (255, 255, 255) # Zombie Color
YELLOW = (255, 255, 0) # Bullet Color

# Player Settings
PLAYER_SIZE = 40
player_x = WIDTH // 2 - PLAYER_SIZE // 2
player_y = HEIGHT - 60
PLAYER_SPEED = 5

# Game Objects Lists
bullets = [] # Format: [x, y]
zombies = [] # Format: [x, y]

# Game State
score = 0
font = pygame.font.Font(None, 36) # Default font, size 36

# Game Clock
clock = pygame.time.Clock()
FPS = 60

# --- 2. GAME FUNCTIONS ---

def draw_objects():
    """Draws all game objects (player, bullets, zombies) to the screen."""
    
    # Draw Player (Green Square)
    player_rect = pygame.Rect(player_x, player_y, PLAYER_SIZE, PLAYER_SIZE)
    pygame.draw.rect(SCREEN, GREEN, player_rect)

    # Draw Bullets (Yellow Rectangles)
    for bullet in bullets:
        pygame.draw.rect(SCREEN, YELLOW, (bullet[0], bullet[1], 5, 15))

    # Draw Zombies (White Squares)
    for zombie in zombies:
        pygame.draw.rect(SCREEN, WHITE, (zombie[0], zombie[1], PLAYER_SIZE, PLAYER_SIZE))

    # Draw Score
    score_text = font.render(f"Score: {score}", True, WHITE)
    SCREEN.blit(score_text, (10, 10))

def spawn_zombie():
    """Adds a new zombie at a random top position."""
    if random.randint(1, 40) == 1: # Randomly spawn about once every 40 frames
        # Zombie spawns randomly across the top edge
        zombie_x = random.randint(0, WIDTH - PLAYER_SIZE)
        zombies.append([zombie_x, -PLAYER_SIZE]) # Start slightly off-screen above

def update_zombies():
    """Moves zombies down and checks for game over condition."""
    global running # Need to modify the running state if game over
    ZOMBIE_SPEED = 2
    
    for zombie in zombies[:]: 
        zombie[1] += ZOMBIE_SPEED # Move down
        
        # Game Over Check: If zombie reaches the bottom
        if zombie[1] > HEIGHT:
            print("Game Over! A zombie escaped!")
            running = False # Exit the main loop
            
def check_collisions():
    """Handles collisions between bullets and zombies."""
    global score
    
    # Iterate backwards to safely remove items while iterating
    for i in range(len(bullets) - 1, -1, -1):
        bullet = bullets[i]
        bullet_rect = pygame.Rect(bullet[0], bullet[1], 5, 15)
        
        for j in range(len(zombies) - 1, -1, -1):
            zombie = zombies[j]
            zombie_rect = pygame.Rect(zombie[0], zombie[1], PLAYER_SIZE, PLAYER_SIZE)
            
            if bullet_rect.colliderect(zombie_rect):
                # Hit! Remove both the bullet and the zombie
                score += 10
                zombies.pop(j) 
                bullets.pop(i) 
                # Break the inner loop since the bullet is gone
                break

# --- 3. MAIN GAME LOOP ---
running = True
while running:
    # A. EVENT HANDLING (Input)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Get all currently pressed keys
    keys = pygame.key.get_pressed()
    
    # Player Movement
    if keys[pygame.K_LEFT] and player_x > 0:
        player_x -= PLAYER_SPEED
    if keys[pygame.K_RIGHT] and player_x < WIDTH - PLAYER_SIZE:
        player_x += PLAYER_SPEED
        
    # Shooting (Spacebar) - Only shoot once per key press (simple check)
    if keys[pygame.K_SPACE]:
        # Center the bullet on the player
        bullet_start_x = player_x + PLAYER_SIZE // 2 - 2 # -2 to center the 5-pixel-wide bullet
        # Add bullet to the list
        bullets.append([bullet_start_x, player_y])


    # B. GAME LOGIC UPDATES
    
    # Bullet Movement: Move all bullets up
    BULLET_SPEED = 10
    for bullet in bullets[:]:
        bullet[1] -= BULLET_SPEED # Move bullet up (decrease Y)
        # Remove bullets that go off screen
        if bullet[1] < 0:
            bullets.remove(bullet)

    spawn_zombie()
    update_zombies()
    check_collisions()

    # C. DRAWING
    SCREEN.fill(BLACK) # Clear the screen
    draw_objects()
    
    # D. END OF LOOP
    pygame.display.flip()  # Update the full screen
    clock.tick(FPS)        # Cap the frame rate

# --- 4. QUIT GAME ---
pygame.quit()
sys.exit()