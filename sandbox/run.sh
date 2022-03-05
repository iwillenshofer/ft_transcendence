CONTAINER_NAME=my-node
IMAGE_NAME=node-image
ROOT_USER=""
if [ "$1" == "root" ]; then
	ROOT_USER="-uroot";
fi

docker rm -f $CONTAINER_NAME
docker rmi -f $IMAGE_NAME
docker build --build-arg http_proxy=$http_proxy -t $IMAGE_NAME .
docker run -ti --name $CONTAINER_NAME $ROOT_USER -v $PWD/volume:/home/node/sandbox:rw -v $PWD/../srcs:/home/node/srcs:rw $IMAGE_NAME /bin/bash
