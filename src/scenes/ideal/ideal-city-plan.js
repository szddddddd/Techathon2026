export const IDEAL_CITY_PLAN = {
  roadWidth: 2.9,
  // Uniform scaling preserves each building's silhouette; the core remains dominant.
  groups: [
    [-11, -17, 1.4], [11, -17, 1.5], [-20, -5, 1.65], [20, -5, 1.65],
    [-4, -20, 1.65], [5, -20, 1.65], [-9, 18, 1.2], [9, 18, 1.3], [-20, 5, 1.3],
  ],
  staticBuilding: {x:20,z:5,scale:1.3},
  satellites: [
    {id:'city-inner-west',slot:0,x:-10.3,z:-2,width:3.6,depth:3.8,height:18},
    {id:'city-inner-east',slot:1,x:10.3,z:-2,width:3.6,depth:3.8,height:17},
    {id:'city-front-west',slot:2,x:-5.8,z:10,width:3.6,depth:3.8,height:10.5},
    {id:'city-front-east',slot:3,x:5.8,z:10,width:3.6,depth:3.8,height:11.5},
  ],
};

