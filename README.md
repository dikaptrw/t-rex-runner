# T-Rex Runner Clone

This is a clone of the popular T-Rex Runner game from Google Chrome's offline page, implemented using Next.js, TypeScript, and Tailwind CSS.

## Features

- Block-based approach for game elements and collision detection
- Responsive design
- Day/night cycle
- High score tracking
- Sound effects

## How to Play

- Press SPACE or UP arrow key to start the game and make the dinosaur jump
- Press DOWN arrow key to duck
- Avoid obstacles (cacti and pterodactyls)
- Try to achieve the highest score possible

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to play the game.

## Build for Production

```bash
npm run build
```

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- React Hooks

## Implementation Details

The game uses a block-based approach for rendering game elements and handling collision detection. Each game element (dinosaur, obstacles, clouds) is represented as a collection of blocks with specific positions and dimensions, making collision detection straightforward and efficient.

## License

This project is open source and available under the MIT License.
