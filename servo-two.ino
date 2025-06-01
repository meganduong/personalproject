#include <Servo.h>

Servo myServo1;
Servo myServo2;

bool faceDetected = false;
unsigned long lastToggleTime = 0;
int currentPos = 0;

void setup() {
  Serial.begin(9600);
  myServo1.attach(9);  
  myServo2.attach(10); 

  myServo1.write(0);
  myServo2.write(90); 

  Serial.println("Arduino Ready");
}

void loop() {
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    Serial.println("Received: " + input); 

    if (input == "1") {
      faceDetected = true;
    } else if (input == "0") {
      faceDetected = false;
      myServo1.write(0);
      myServo2.write(90);
    }
  }

  if (faceDetected) {
    unsigned long now = millis();
    if (now - lastToggleTime >= 2000) {
      lastToggleTime = now;
      currentPos = (currentPos == 0) ? 90 : 0;
      myServo1.write(currentPos);
      myServo2.write(90 - currentPos); 
      Serial.println("Moved to: Servo1 " + String(currentPos) + ", Servo2 " + String(90 - currentPos)); 
    }
  }
}
