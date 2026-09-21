import tkinter as tk
from tkinter import filedialog, messagebox
from ultralytics import YOLO
import cv2
from PIL import Image, ImageTk
import os

model = YOLO("y8best.pt")

window = tk.Tk()
window.title("CivicSethu - Mysuru")
window.geometry("900x650")
window.configure(bg="#00A86B")

try:
    logo_image = Image.open("mys_logo.jpg")
    logo_image.thumbnail((250, 150))
    logo_photo = ImageTk.PhotoImage(logo_image)

    logo_label = tk.Label(
        window,
        image=logo_photo,
        bg="#00A86B"
    )
    logo_label.pack(pady=(20, 5))

except:
    logo_label = tk.Label(
        window,
        text="CivicSethu",
        font=("Arial", 30, "bold"),
        fg="white",
        bg="#00A86B"
    )
    logo_label.pack(pady=(30, 5))

title_label = tk.Label(
    window,
    text="CivicSethu - Mysuru",
    font=("Arial", 30, "bold"),
    fg="white",
    bg="#00A86B"
)
title_label.pack(pady=5)

subtitle_label = tk.Label(
    window,
    text="Smart Detection for a Cleaner and Better Mysuru",
    font=("Arial", 16),
    fg="#E8FFF5",
    bg="#00A86B"
)
subtitle_label.pack(pady=5)

info_label = tk.Label(
    window,
    text="Upload any picture or video and CivicSethu will detect:",
    font=("Arial", 15),
    fg="white",
    bg="#00A86B"
)
info_label.pack(pady=(25, 5))

pothole_label = tk.Label(
    window,
    text="1. Potholes",
    font=("Arial", 15, "bold"),
    fg="white",
    bg="#00A86B"
)
pothole_label.pack(pady=3)

garbage_label = tk.Label(
    window,
    text="2. Garbage",
    font=("Arial", 15, "bold"),
    fg="white",
    bg="#00A86B"
)
garbage_label.pack(pady=3)

def select_file():
    file = filedialog.askopenfilename(
        title="Select a picture or video",
        filetypes=[
            (
                "Pictures and Videos",
                "*.jpg *.jpeg *.png *.bmp *.mp4 *.avi *.mov *.mkv"
            ),
            ("All files", "*.*")
        ]
    )

    if not file:
        return

    ext = os.path.splitext(file)[1].lower()

    if ext in [".jpg", ".jpeg", ".png", ".bmp"]:
        results = model.predict(
            source=file,
            conf=0.25,
            verbose=False
        )

        result = results[0].plot()

        cv2.imshow("CivicSethu - Detection Result", result)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    elif ext in [".mp4", ".avi", ".mov", ".mkv"]:
        video = cv2.VideoCapture(file)

        if not video.isOpened():
            messagebox.showerror(
                "Error",
                "Could not open the selected video."
            )
            return

        while True:
            success, frame = video.read()

            if not success:
                break

            results = model.predict(
                source=frame,
                conf=0.25,
                verbose=False
            )

            result = results[0].plot()

            cv2.imshow(
                "CivicSethu - Detection Result",
                result
            )

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

        video.release()
        cv2.destroyAllWindows()

    else:
        messagebox.showerror(
            "Error",
            "Unsupported file type."
        )

upload_button = tk.Button(
    window,
    text="UPLOAD PICTURE / VIDEO",
    font=("Arial", 16, "bold"),
    fg="#006B45",
    bg="white",
    activeforeground="white",
    activebackground="#006B45",
    width=25,
    height=2,
    relief="raised",
    bd=3,
    cursor="hand2",
    command=select_file
)
upload_button.pack(pady=35)

footer_label = tk.Label(
    window,
    text="CivicSethu • Mysuru",
    font=("Arial", 11),
    fg="#D9FFF0",
    bg="#00A86B"
)
footer_label.pack(side="bottom", pady=15)

window.mainloop()
