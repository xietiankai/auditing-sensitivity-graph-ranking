FROM python:3.7.3

WORKDIR /app 

COPY . /app 

RUN pip install -r requirements.txt 

# CMD ["python", "server.py"]
# CMD ["gunicorn", "server:app", "-c", "./gunicorn.conf.py", "--daemon"]
