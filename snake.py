import turtle as t
import random
import time

d = 0.1  # delay
s = 0    # score
hs = 0   # high_score

# Screen setup
sc = t.Screen()
sc.title("Snake Game")
sc.bgcolor("blue")
sc.setup(width=600, height=600)
sc.tracer(0)

# Snake head
h = t.Turtle()
h.shape("square")
h.color("white")
h.penup()
h.goto(0, 0)
h.direction = "Stop"

# Food
f = t.Turtle()
f.speed(0)
f.shape(random.choice(['square', 'triangle', 'circle']))
f.color(random.choice(['red', 'green', 'black']))
f.penup()
f.goto(0, 100)

# Score display
p = t.Turtle()
p.speed(0)
p.shape("square")
p.color("white")
p.penup()
p.hideturtle()
p.goto(0, 250)
p.write("Score : 0 High Score : 0", align="center", font=("candara", 24, "bold"))

# Direction functions
def up():
    if h.direction != "down":
        h.direction = "up"

def down():
    if h.direction != "up":
        h.direction = "down"

def left():
    if h.direction != "right":
        h.direction = "left"

def right():
    if h.direction != "left":
        h.direction = "right"

# Move function
def move():
    if h.direction == "up":
        h.sety(h.ycor() + 20)
    if h.direction == "down":
        h.sety(h.ycor() - 20)
    if h.direction == "left":
        h.setx(h.xcor() - 20)
    if h.direction == "right":
        h.setx(h.xcor() + 20)

# Key bindings
sc.listen()
sc.onkeypress(up, "Up")
sc.onkeypress(down, "Down")
sc.onkeypress(left, "Left")
sc.onkeypress(right, "Right")

# Snake body
seg = []

# Main Gameplay Loop
while True:
    sc.update()
    move()
    time.sleep(d)
    # Add food and collision logic here
    # Add body movement and score handling here
