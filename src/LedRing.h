#pragma once

namespace LedRing {

  typedef enum mode_t
  {

    modeWakeUp,           // Power up. One green LED
    modeNFCSetup,         // Setting up NFC. green + yellow.
    modeNFCSetupComplete, // NFC setup successful. Two greens.
    modeTryDHCP,          // trying to get an IP address using DHCP. 2 greens + 1 yellow.
    modeDHCPFailed,       // connecting and getting a DHCP address failed. 2 greens + 1 red.
    modeDHCPSuccess,      // connecting and getting a DHCP address succeeded. 3 greens.
    modeTryServer,        // trying to connect to the server. 3 greens, 1 yellow
    modeServerFailed,     // failed to connect to the server. 3 greens, 1 red

    modeReady,
    modeReading,
    modeFail,
    modeSuccess,

  } mode_t;

  void setMode(mode_t modeNew);
  void setup();
  void loop();
};