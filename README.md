Register User

curl --request POST \
  --url http://localhost:3000/user \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/8.4.5' \
  --data '{
	"username": "Piyush",
	"email": "piyush_test@gmail.com",
	"password": "Test@123"
}'

Login

curl --request POST \
  --url http://localhost:3000/user/login \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/8.4.5' \
  --data '{
	"email": "piyush_test@gmail.com",
	"password": "Test@123"
}'