import cv2
import numpy as np

def get_brightness(image_path):
    """
    Calculates the average brightness of an image.

    Args:
        image_path (str): The path to the image file.

    Returns:
        float: The average brightness of the image.
    """
    img = cv2.imread(image_path)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    v = hsv[:, :, 2]
    brightness = np.mean(v)
    return brightness
