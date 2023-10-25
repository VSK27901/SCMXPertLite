# Use the official Python image as the base image
FROM python:3.11.4

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create and set the working directory
WORKDIR /Backend

# Copy the requirements.txt file into the container
COPY requirements.txt /Backend/

# Install project dependencies
RUN pip install -r requirements.txt

# Copy the FastAPI application files into the container
COPY . .

# Expose the port that FastAPI will run on
EXPOSE 8000

# Command to start the FastAPI application using Uvicorn
CMD ["uvicorn", "Backend.index:app", "--host", "0.0.0.0", "--port", "8000"]
