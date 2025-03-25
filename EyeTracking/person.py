import cv2
from ultralytics import YOLO

# Load YOLO model
model = YOLO("yolov8s.pt")  # Pretrained YOLO model

# Define allowed class IDs and confidence thresholds
CLASS_THRESHOLDS = {
    0: 0.85,  # person
    62: 0.80, # tv
    63: 0.90, # laptop
    67: 0.60  # cell phone
}

# Open webcam
cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Run YOLO inference on the frame
    results = model(frame)

    for result in results:
        boxes = result.boxes.xyxy  # Bounding box coordinates (x1, y1, x2, y2)
        confidences = result.boxes.conf  # Confidence scores
        class_ids = result.boxes.cls.int()  # Class indices

        for box, conf, class_id in zip(boxes, confidences, class_ids):
            class_id_int = int(class_id)
            if class_id_int in CLASS_THRESHOLDS and conf >= CLASS_THRESHOLDS[class_id_int]:
                x1, y1, x2, y2 = map(int, box)  # Convert to int for OpenCV
                label = f"{model.names[class_id_int]}: {conf:.2f}"  # Class name and confidence

                # Draw bounding box and label
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # Display the frame with detections
    cv2.imshow("YOLO Live Detection", frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
