"use strict";

const os = require("os");
const dgram = require("dgram");

/**
 * Finds the correct IPv4 address of the system.
 * Tries the UDP route detection method first, falls back to interface scanning.
 */
async function getLocalIPv4(timeoutMs = 200) {
  const udpDiscovery = () =>
    new Promise((resolve) => {
      const socket = dgram.createSocket("udp4");
      const cleanup = (res) => {
        try {
          socket.close();
        } catch {}
        resolve(res);
      };

      const timer = setTimeout(() => cleanup(null), timeoutMs);
      socket.once("error", () => cleanup(null));

      try {
        // Connect to Google's public DNS (no packets actually sent)
        socket.connect(53, "8.8.8.8", () => {
          clearTimeout(timer);
          const { address } = socket.address();
          cleanup(address || null);
        });
      } catch {
        cleanup(null);
      }
    });

  const ip = await udpDiscovery();
  if (ip) return ip;

  // Fallback: scan local interfaces
  const nets = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (
        net.family === "IPv4" &&
        !net.internal &&
        !net.address.startsWith("169.254.")
      ) {
        addresses.push({ iface: name, address: net.address });
      }
    }
  }

  if (addresses.length === 0) return "127.0.0.1";

  // Prefer physical/non-virtual interfaces
  addresses.sort((a, b) => {
    const avoid = ["docker", "veth", "br-", "vmnet", "virbr"];
    const aIsVirtual = avoid.some((v) => a.iface.startsWith(v));
    const bIsVirtual = avoid.some((v) => b.iface.startsWith(v));
    return aIsVirtual - bIsVirtual;
  });

  return addresses[0].address;
}

// Export an async getter function
module.exports = { getLocalIPv4 };
