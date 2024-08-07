FROM python:3.12.4

# Update and install required packages
RUN apt-get update -y && apt-get install -y \
    gobject-introspection \
    libgirepository1.0-dev \
    build-essential

RUN pip install --upgrade pip

# Installing requirements
COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000
ENV FLASK_ENV=development
ENV FLASK_DEBUG=1

# Expose the port
EXPOSE 5000

# Working directory
WORKDIR /app

# Copying the source code
COPY app .


CMD ["flask", "run", "--reload"]
