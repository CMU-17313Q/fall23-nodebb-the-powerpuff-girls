# Use an official Python runtime as a parent image
FROM python:3.11

WORKDIR /python-microservice

# Install any additional dependencies
COPY requirements.txt .

RUN pip install flask
RUN pip install --no-cache-dir -r requirements.txt

COPY . .



EXPOSE 8080

ENV PORT 8080

ENV HOSTNAME "0.0.0.0"

CMD ["flask", "run", "--host", "0.0.0.0", "--port", "8080"]

# CMD ["python", "app.py", ]
# Expose the port on which the app will run
# EXPOSE 5000

# Define the command to run your Flask app
# CMD ["python", "app.py"]

# p1109-404313: project id