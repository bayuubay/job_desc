# job_desc
Backend app for showing simple job desc

# start the app
1. clone the project then go to project dir
2. set `.env` file containing `POSTGRES_USER` `POSTGRES_PASSWORD` `POSTGRES_DB` `POSTGRES_HOST` `POSTGRES_PORT` `NODE_ENV` `APP_VERSION` `APP_NAME` `ACCESS_TOKEN_SECRET``ACCESS_TOKEN_EXPIRED` `EXTERNAL_URL`
3. make sure `docker` and `docker-compose` is installed in your local machine, please refer to https://docs.docker.com/get-docker/ for installation guide
4. run `dokcer-compose build; docker-compose up -d`
5. go to browser and goto `http://localhost:88/api`