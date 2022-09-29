FROM satel/python-base:202112.1-python3.9

# Copy the files for the server
COPY ./server/requirements.txt /python/app

# Install dependencies for Python package Pillow
USER root
RUN apt-get update && apt-get install -y libjpeg-dev zlib1g-dev gcc

USER python

# Install pip packages
RUN pip install --user -r requirements.txt

# Copy the files for the server
COPY ./server /python/app
# Add the client's files
COPY ./client/build /python/app/static

RUN mkdir /python/images /python/dynamic && cp /python/app/static/index.html /python/dynamic

# Run command for production. Overwrite in docker-compose for development.
CMD [ "startapp" ]
