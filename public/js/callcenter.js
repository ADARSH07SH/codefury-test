// public/js/callcenter.js

function getEmergencyNumber(state) {
  // Define the emergency numbers for each state
  const emergencyNumbers = {
    Karnataka: "080-22340676",
    Delhi: "011-23389999",
    // Add more states and their numbers here
    Maharashtra: "022-24110000",
    // Continue adding states...
  };
  return emergencyNumbers[state] || "Emergency number not available";
}
