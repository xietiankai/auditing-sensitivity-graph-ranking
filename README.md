# refactored-dollop 
Refactored graph auditing project 01292020 
In root folder 
# run 
build the docker images 
``` 
docker build -t grsavis . 
``` 
create the container based on the images 
``` 
docker run -it --rm -p 5000:5000 grsavis 
```