## Table of content
* Getting Started
* Installation
* Testing
* Documentation

## Getting Started

Clone the repo using git clone and the repo link. Unzip the files.

Environment file - run this command - ```cp .env.example .env ```

> If using docker run the following command in the root directory of the project
* ```docker build -t sc:latest . ``` to build the docker container
* ```docker run -d -p 9090:9090 vivek:t1```  to run container in detached mode.
* Now visit http://localhost:9000 


## Installation

Run command ```npm install``` in the root directory of the project to execute the code.

## Testing

Run command ```npm test``` in the root directory of the project to test the code.

It uses eslint and istanbul for code coverage report generation and that can be found in coverage folder.

## Documentation

Please visit this link [Postman Documentation](https://documenter.getpostman.com/view/2494122/RWMJq6rQ) to get the api documentation.