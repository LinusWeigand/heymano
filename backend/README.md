# How to run the backend



## Make sure you have a postgresql instance running

Either in google cloud like I do or as a local docker container.

For a local docker container I provided a docker-compose.yml

docker-compose up -d


## Skip the rest if you want to run the whole project as Docker container

You can skip all the following steps if you run the whole project: Frontend, backend & nginx as a Docker container

If you want to run individually locally, follow the following steps:

## Prepare .env

I provided a .template.env

For local testing leave URL and DOMAIN as localhost

make sure you have gmail with smtp enabled

Configure DATABASE_URL depending on where the postgresdb is running.


## Run project

cargo run

If everything works fine, it should output: Connection to database successful


### For x86_64 compilation

cargo zigbuild --release --target x86_64-unknown-linux-gnu
