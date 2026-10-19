// World coordinates: never apply the legacy river-bank translation to these.
// Taller outer silhouettes surround lower trees beside the open activity areas.
const tree=(id,region,kind,x,z,size,rotation)=>({id,region,kind,x,z,size,rotation,axis:'y'});
export const FOREST_TREES=[
  tree('west-01','west','tree_birch',-25.6,-10,5.2,.4),
  tree('west-02','west','tree',-26.1,-5.5,4.5,1.8),
  tree('west-03','west','tree_maple',-25.5,-.8,4.6,2.7),
  tree('west-04','west','tree_birch',-25.4,2.8,4.5,.9),
  tree('west-05','west','tree_maple',-16.4,10,4.6,2.1),
  tree('west-06','west','tree',-13.4,9.6,3.6,3.5),
  tree('west-07','west','tree_birch',-10.5,10,3.1,1.3),
  tree('west-08','west','tree_maple',-7.3,9.8,3.5,4.6),
  tree('east-01','east','tree_birch',25.6,-10,5.2,2.4),
  tree('east-02','east','tree_maple',26.5,-6.8,5.5,.7),
  tree('east-03','east','tree',27,-3.7,5.3,1.5),
  tree('east-04','east','tree_birch',28.2,.6,4.5,3.1),
  tree('east-05','east','tree_maple',27.9,4.9,4.4,4.2),
  tree('east-06','east','tree',25.5,7.8,3.7,2.2),
  tree('east-07','east','tree_birch',22.8,9.5,3.2,.2),
  tree('east-08','east','tree_maple',19.4,10.2,3.6,2.9),
  tree('east-09','east','tree',16,10,4,4.9),
  tree('east-10','east','tree_birch',12.5,10.2,3.6,1.1),
  tree('east-11','east','tree_maple',8.9,9.5,3.2,3.8),
  tree('east-12','east','tree',9.6,-7.5,4.1,5.2),
  tree('foothill-01','foothill','tree',-23.6,-16,5.8,2.6),
  tree('foothill-02','foothill','tree_birch',-17.4,-16.1,6,.5),
  tree('foothill-03','foothill','tree_maple',8.3,-13.5,5.1,1.9),
  tree('foothill-04','foothill','tree',15.1,-12.6,5.5,3.3),
];
// The only two decorative land rocks. River and structural stone are independent.
export const FOREST_ROCKS=[
  {id:'valley-rock-01',kind:'rock',x:13,z:-13,size:1.6,rotation:2.8,axis:'y',buried:true},
  {id:'valley-rock-02',kind:'rock',x:25.5,z:-6,size:1,rotation:5.3,axis:'y',buried:true},
];
