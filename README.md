#Sandbox
> It is a Dockerfile running node.js used to fiddle with the code and develop.

> The version chosen is 16.14.0-bullseye (debian 11), as bullseye is used in node:latest, and 16.14.0 is the last version used by current nestjs cli.

> Directories mapped are ./sandbox/volume (which will be created if does not exist), as well as ../transcendence (which contain both front and backend).

> To Run the Sandbox:

> `cd ./sandbox && ./run.sh`


#Project Setup

Project was set up using the Sandbox.

In the /home/node/srcs directory, the following commands were run:

```
	ng new frontend
	nest new backend
```

after creating the backend and the frontend, a Dockerfile was created for each of them. Both dockerfiles are very similar to the one created using the Sandbox.




# References:

https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md

