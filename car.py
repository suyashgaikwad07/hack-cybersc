import pygame
import random
import time
import sys

pygame.init()

# Screen dimensions
display_width = 800
display_height = 600

# Colors
black = (0, 0, 0)
white = (255, 255, 255)
red = (200, 0, 0)
green = (0, 200, 0)
bright_red = (255, 0, 0)
bright_green = (0, 255, 0)

# Set up display
gameDisplay = pygame.display.set_mode((display_width, display_height))
pygame.display.set_caption('Car Racing Game')
clock = pygame.time.Clock()

car_width = 49

# Load images - make sure these files exist in the same directory
player_car = pygame.image.load('player_car.png')
car_images = [
    pygame.image.load('car.jpg'),
    pygame.image.load('car1.jpg'),
    pygame.image.load('car2.jpg'),
    pygame.image.load('car4.jpg'),
    pygame.image.load('car5.jpg')
]
road = pygame.image.load('road.png')


def things_dodged(count):
    font = pygame.font.SysFont(None, 25)
    text = font.render("Score: " + str(count), True, white)
    gameDisplay.blit(text, (0, 0))


def message_display(text):
    large_text = pygame.font.SysFont('freesansbold.ttf', 80)
    text_surf = large_text.render(text, True, white)
    text_rect = text_surf.get_rect()
    text_rect.center = (display_width / 2, display_height / 2)
    gameDisplay.blit(text_surf, text_rect)
    pygame.display.update()
    time.sleep(2)


def crash():
    message_display('You Crashed!')
    game_intro()


def button(msg, x, y, w, h, ic, ac, action=None):
    mouse = pygame.mouse.get_pos()
    click = pygame.mouse.get_pressed()
    if x + w > mouse[0] > x and y + h > mouse[1] > y:
        pygame.draw.rect(gameDisplay, ac, (x, y, w, h))
        if click[0] == 1 and action is not None:
            action()
    else:
        pygame.draw.rect(gameDisplay, ic, (x, y, w, h))

    small_text = pygame.font.SysFont('freesansbold.ttf', 20)
    text_surf = small_text.render(msg, True, black)
    text_rect = text_surf.get_rect()
    text_rect.center = (x + w / 2, y + h / 2)
    gameDisplay.blit(text_surf, text_rect)


def quit_game():
    pygame.quit()
    sys.exit()


def game_intro():
    intro = True

    while intro:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                quit_game()

        gameDisplay.fill(black)
        large_text = pygame.font.SysFont('freesansbold.ttf', 80)
        text_surf = large_text.render('Car Racing Game', True, white)
        text_rect = text_surf.get_rect()
        text_rect.center = (display_width / 2, display_height / 2 - 100)
        gameDisplay.blit(text_surf, text_rect)

        button("Start", 150, 450, 100, 50, green, bright_green, game_loop)
        button("Quit", 550, 450, 100, 50, red, bright_red, quit_game)

        pygame.display.update()
        clock.tick(15)


def paused():
    paused = True

    font = pygame.font.SysFont('freesansbold.ttf', 80)
    text_surf = font.render('Paused', True, white)
    text_rect = text_surf.get_rect()
    text_rect.center = (display_width / 2, display_height / 2 - 100)

    while paused:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                quit_game()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_c:
                    paused = False
                elif event.key == pygame.K_q:
                    quit_game()

        gameDisplay.fill(black)
        gameDisplay.blit(text_surf, text_rect)

        button("Continue", 150, 450, 150, 50, green, bright_green, lambda: unpause())
        button("Quit", 500, 450, 100, 50, red, bright_red, quit_game)

        pygame.display.update()
        clock.tick(15)


def unpause():
    global paused
    paused = False


def game_loop():
    x = display_width * 0.45
    y = display_height * 0.8
    x_change = 0

    thing_startx = random.randrange(200, 600)
    thing_starty = -600
    thing_speed = 7
    thing_width = 49
    thing_height = 100

    dodged = 0
    level = 1
    global paused
    game_exit = False

    while not game_exit:

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                quit_game()

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT:
                    x_change = -5
                if event.key == pygame.K_RIGHT:
                    x_change = 5
                if event.key == pygame.K_p:
                    paused = True
                    paused_loop()

            if event.type == pygame.KEYUP:
                if event.key == pygame.K_LEFT or event.key == pygame.K_RIGHT:
                    x_change = 0

        x += x_change
        gameDisplay.fill(black)
        gameDisplay.blit(road, (0, 0))

        obs_car_image = random.choice(car_images)
        gameDisplay.blit(obs_car_image, (thing_startx, thing_starty))

        thing_starty += thing_speed
        gameDisplay.blit(player_car, (x, y))
        things_dodged(dodged)

        font = pygame.font.SysFont(None, 25)
        level_text = font.render("Level: " + str(level), True, white)
        gameDisplay.blit(level_text, (display_width - 100, 0))

        if x > display_width - car_width or x < 0:
            crash()
            game_exit = True

        if thing_starty > display_height:
            thing_starty = 0 - thing_height
            thing_startx = random.randrange(0, display_width - thing_width)
            dodged += 1

            if dodged % 10 == 0:
                level += 1
                thing_speed += 2
                message_display("Level " + str(level))

        if y < thing_starty + thing_height:
            if x > thing_startx and x < thing_startx + thing_width or x + car_width > thing_startx and x + car_width < thing_startx + thing_width:
                crash()
                game_exit = True

        pygame.display.update()
        clock.tick(60)


def paused_loop():
    global paused
    while paused:
        for event in pygame.event.get():
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_c:
                    paused = False
                elif event.key == pygame.K_q:
                    quit_game()


if __name__ == '__main__':
    paused = False
    game_intro()
