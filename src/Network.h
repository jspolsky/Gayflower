#pragma once

namespace Network
{
    // results of loop()
    typedef enum result_t
    {
        resultNoop,         // nothing to do - the default
        resultPump,         // a message was received instructing us to turn on the pump
        resultUnauthorized, // you tried to swipe but you are unauthorized
        resultAuthorized,   // you tried to swipe and you are authorized
    } result_t;

    void setup();
    result_t loop(uint32_t* piPumpTimeInSeconds);
    void swipe(uint8_t *uid, uint8_t uidLength);
};
