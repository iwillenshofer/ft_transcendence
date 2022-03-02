docker rmi node-image
docker build --build-arg http_proxy=$http_proxy -t node-image .
docker run --rm --name my-node -v $PWD/volume:/home/node:rw -p3000:3000 node-image
