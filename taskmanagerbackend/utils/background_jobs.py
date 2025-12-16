import time

def send_notification(task_title: str):
    # simulate delay
    time.sleep(2)
    print(f"[Background Job] Notification sent for task: {task_title}")
