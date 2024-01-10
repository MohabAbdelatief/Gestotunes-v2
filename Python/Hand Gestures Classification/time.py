import time
import subprocess

while True:
    print("Running your Python code...")
    try:
        # Replace 'your_script.py' with the filename of your Python script
        subprocess.run(["python", "./Python/Hand Gestures Classification/Client.py"])
    except Exception as e:
        print(f"Error occurred: {e}")
    print("Restarting in 10 seconds...")
    time.sleep(10)  # Sleep for 10 seconds before restarting
