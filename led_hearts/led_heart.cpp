#include <kernel.h>
#include <t_syslog.h>
#include <t_stdlib.h>
#include "syssvc/serial.h"
#include "syssvc/syslog.h"
#include "kernel_cfg.h"
#include "arduino_app.h"
#include "arduino_main.h"
/* GR-PEACH Sketch Template V1.00 */
#include <Arduino.h>
#define INTERVAL 100
int value1;
int value2;
int value3;
int sw;

void setup()
{
    value1 = 0;
    value2 = 0;
    sw = 0;
    pinMode(PIN_LED_RED   , OUTPUT);
    pinMode(PIN_LED_GREEN , OUTPUT);
    pinMode(PIN_LED_BLUE  , OUTPUT);
    pinMode(PIN_LED_USER  , OUTPUT);
    pinMode(PIN_SW        , INPUT);
}
void cyclic_handler(intptr_t exinf) {
  irot_rdq(LOOP_PRI); /* change the running loop. */
}
void loop()
{
    digitalWrite(PIN_LED_RED, 1);
    delay(200);
    digitalWrite(PIN_LED_RED, 0);
    delay(200);
    goto end0;
end0:
    ;
}
void loop1()
{
end1:
    ;
}
