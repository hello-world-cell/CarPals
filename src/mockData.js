export const carparks = [
  {
    id: 1,
    name: "Raffles Place Car Park",
    address: "1 Raffles Place, Singapore 048616",
    lat: 1.2838, lng: 103.8515,
    floors: ["B1", "B2", "B3"],
    totalSpaces: 150, availableSpaces: 47,
    pricePerHour: 2.50, rating: 4.8,
    walkingMins: 3, topPlacement: true,
    operatorName: "Raffles Place Pte Ltd",
    aiTags: ["AI Top Pick", "Cheapest nearby", "Covered parking"]
  },
  {
    id: 2,
    name: "Marina Bay Car Park",
    address: "10 Bayfront Ave, Singapore 018956",
    lat: 1.2834, lng: 103.8607,
    floors: ["B1", "B2"],
    totalSpaces: 200, availableSpaces: 23,
    pricePerHour: 3.00, rating: 4.5,
    walkingMins: 5, topPlacement: false,
    operatorName: "Marina Bay Sands",
    aiTags: ["Best views", "EV charging"]
  },
  {
    id: 3,
    name: "Tanjong Pagar Plaza",
    address: "7 Tanjong Pagar Plaza, Singapore 081007",
    lat: 1.2762, lng: 103.8454,
    floors: ["B1", "B2", "B3", "B4"],
    totalSpaces: 300, availableSpaces: 120,
    pricePerHour: 1.80, rating: 4.2,
    walkingMins: 8, topPlacement: false,
    operatorName: "Tanjong Pagar Management",
    aiTags: ["Most available", "Budget friendly"]
  }
];

export const mockUser = {
  name: "Alex",
  isPremium: true,
  credits: 0.40,
  savedCar: "SBA 1234 A"
};

export const mockSession = {
  carparkName: "Raffles Place Car Park",
  spot: "A-23",
  floor: "B1",
  timeIn: null,
  duration: 0,
  amount: 0
};
