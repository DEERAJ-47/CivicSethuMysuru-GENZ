const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

const int LED_PIN = 6;
const int BUZZER_PIN = 7;

const int DETECTION_DISTANCE = 50;

bool manualLed = false;
bool manualBuzzer = false;

void setup() {

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  Serial.begin(9600);

  Serial.println("Security system started");
}

void loop() {

  // -------------------------------
  // Check commands from website
  // -------------------------------

  if (Serial.available()) {

    String command = Serial.readStringUntil('\n');

    command.trim();

    if (command == "LED_ON") {
      manualLed = true;
    }

    else if (command == "LED_OFF") {
      manualLed = false;
    }

    else if (command == "BUZZER_ON") {
      manualBuzzer = true;
    }

    else if (command == "BUZZER_OFF") {
      manualBuzzer = false;
    }
  }


  // -------------------------------
  // Ultrasonic measurement
  // -------------------------------

  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);

  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(
    ECHO_PIN,
    HIGH,
    30000
  );

  float distance;

  if (duration == 0) {
    distance = -1;
  }
  else {
    distance = duration * 0.0343 / 2;
  }


  // -------------------------------
  // Send distance to website
  // -------------------------------

  if (distance < 0) {

    Serial.println(
      "Distance: OUT_OF_RANGE"
    );

  }
  else {

    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
  }


  // -------------------------------
  // Automatic detection
  // -------------------------------

  bool personDetected =
    distance > 0 &&
    distance <= DETECTION_DISTANCE;


  // -------------------------------
  // LED
  // -------------------------------

  if (personDetected || manualLed) {
    digitalWrite(LED_PIN, HIGH);
  }
  else {
    digitalWrite(LED_PIN, LOW);
  }


  // -------------------------------
  // Buzzer
  // -------------------------------

  if (personDetected || manualBuzzer) {
    digitalWrite(BUZZER_PIN, HIGH);
  }
  else {
    digitalWrite(BUZZER_PIN, LOW);
  }


  // -------------------------------
  // Alert message
  // -------------------------------

  if (personDetected) {
    Serial.println(
      "ALERT: Person detected!"
    );
  }


  delay(200);
}
