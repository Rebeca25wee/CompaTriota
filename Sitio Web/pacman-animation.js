class PacManPatrioticTest {
    constructor() {
        this.createStyles();
        this.createCanvas();
        this.initGame();
        this.animate();
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f0f0f0;
                font-family: Arial, sans-serif;
            }
            #pacman-canvas {
                border: 2px solid #333;
                background-color: #000;
            }
            #test-text {
                margin-top: 20px;
                font-size: 24px;
                text-align: center;
                color: #333;
                max-width: 600px;
            }
            #form-button {
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #0066cc;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
        `;
        document.body.appendChild(style);
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'pacman-canvas';
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
    }

    initGame() {
        this.pacman = {
            x: 50,
            y: this.canvas.height / 2,
            size: 50,
            speed: 3,
            mouthAngle: 0,
            mouthOpen: false
        };

        this.createBalls();
        this.createTestText();
        this.createFormButton();
    }

    createBalls() {
        this.balls = [
            // Lado izquierdo
            { x: 50, y: 50, color: 'red', size: 20, caught: false },
            { x: 50, y: 200, color: 'blue', size: 20, caught: false },
            { x: 50, y: 350, color: 'white', size: 20, caught: false },
            
            // Lado derecho
            { x: this.canvas.width - 50, y: 50, color: 'red', size: 20, caught: false },
            { x: this.canvas.width - 50, y: 200, color: 'blue', size: 20, caught: false },
            { x: this.canvas.width - 50, y: 350, color: 'white', size: 20, caught: false },
            
            // Arriba
            { x: 200, y: 50, color: 'red', size: 20, caught: false },
            { x: 400, y: 50, color: 'blue', size: 20, caught: false },
            { x: 600, y: 50, color: 'white', size: 20, caught: false }
        ];
    }

    createTestText() {
        const textDiv = document.createElement('div');
        textDiv.id = 'test-text';
        textDiv.textContent = 'Toma un test y descubre qué tan patriótico eres';
        document.body.appendChild(textDiv);
    }

    createFormButton() {
        this.formButton = document.createElement('a');
        this.formButton.id = 'form-button';
        this.formButton.href = 'https://docs.google.com/forms/d/e/1FAIpQLSe47omnL9STbCQizEqmYic59Y4ozh_H_0gVvJc1dbPoG6OFVA/viewform?usp=dialog';
        this.formButton.textContent = 'Realizar Test';
        this.formButton.target = '_blank';
        document.body.appendChild(this.formButton);
    }

    drawPacMan() {
        this.ctx.fillStyle = 'yellow';
        
        this.ctx.beginPath();
        this.ctx.arc(
            this.pacman.x, 
            this.pacman.y, 
            this.pacman.size, 
            0.2 * Math.PI + this.pacman.mouthAngle, 
            1.8 * Math.PI - this.pacman.mouthAngle
        );
        this.ctx.lineTo(this.pacman.x, this.pacman.y);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(
            this.pacman.x + this.pacman.size / 3, 
            this.pacman.y - this.pacman.size / 3, 
            5, 
            0, 
            2 * Math.PI
        );
        this.ctx.fill();
    }

    drawBalls() {
        this.balls.forEach(ball => {
            if (!ball.caught) {
                this.ctx.fillStyle = 'black';
                this.ctx.beginPath();
                this.ctx.arc(ball.x, ball.y, ball.size + 2, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = ball.color;
                this.ctx.beginPath();
                this.ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }

    movePacMan() {
        const nearestBall = this.balls.find(ball => !ball.caught);
        
        if (nearestBall) {
            const angle = Math.atan2(
                nearestBall.y - this.pacman.y, 
                nearestBall.x - this.pacman.x
            );
            
            this.pacman.x += Math.cos(angle) * this.pacman.speed;
            this.pacman.y += Math.sin(angle) * this.pacman.speed;

            this.pacman.mouthAngle = 0.1 * Math.sin(Date.now() * 0.01);
        }
    }

    checkCollisions() {
        this.balls.forEach(ball => {
            if (!ball.caught) {
                const dx = this.pacman.x - ball.x;
                const dy = this.pacman.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.pacman.size + ball.size) {
                    ball.caught = true;
                }
            }
        });

        if (this.balls.every(ball => ball.caught)) {
            this.createBalls();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.movePacMan();
        this.checkCollisions();
        this.drawPacMan();
        this.drawBalls();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PacManPatrioticTest();
});