docker run -it --rm --name agent -p 8080:8080 -v "$PWD":/app -w /app node:4 node src/index.js 
