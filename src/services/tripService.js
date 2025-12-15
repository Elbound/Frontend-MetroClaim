
const tripService = {
  getTrips: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { 
            id: 1, 
            title: "Visit APL", 
            destination: "Indonesia", 
            dates: "10 Jan - 10 Jan 2026", 
            participants: 1, 
            status: "Ongoing" 
          },
          { 
            id: 2, 
            title: "Visit Client Japan", 
            destination: "Hokkaido, Japan", 
            dates: "30 Dec - 31 Dec 2025", 
            participants: 3, 
            status: "Ongoing" 
          },
          { 
            id: 3, 
            title: "1 - QA TRIP CREATE TO WAKANDA", 
            destination: "Wakanda", 
            dates: "20 Dec - 23 Dec 2025", 
            participants: 3, 
            status: "Ongoing" 
          },
          { 
            id: 4, 
            title: "TRIP TO JAPANG", 
            destination: "jepang", 
            dates: "12 Dec - 18 Dec 2025", 
            participants: 3, 
            status: "Ongoing" 
          }
        ]);
      }, 500);
    });
  },
  createTrip: async (tripData) => {
      return new Promise((resolve) => {
          setTimeout(() => {
              console.log("Trip created:", tripData);
              resolve({ success: true, id: Math.floor(Math.random() * 1000) });
          }, 800);
      });
  }
};

export default tripService;
