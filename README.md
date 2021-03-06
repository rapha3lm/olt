OLT - Ophthalmic lenses tools v1.0
===================


JavaScript ophthalmic lens calculator by **Rafael Martins**.

----------


USAGE
-------------
```
var thisLens = new Lens(
	nearSphere, nearCylinder,   nearAxis,   //Near data
	farSphere,  farCylinder,    farAxis     //Far Data
);

//Retrieving returned data
console.log( thisLens.nearCylAbs );
```

> **Note:**

> - Providing both data will generate a progressive lens.
> - Accepts data as strings, integer number or floating number.
> - Both near or far data can be undefined.

#### Returned near data:
```
nearSphFloat    //Float near sphere
nearCylFloat    //Float near cylinder
nearSphAbs      //Absolute near sphere
nearCylAbs      //Absolute near cylinder (Always positive)
farAx           //Integer near axis
```

#### Returned  far data:
```
farSphFloat     //Float far sphere
farCylFloat     //Float far cylinder
farSphAbs       //Absolute far sphere
farCylAbs       //Absolute far cylinder (Always positive)      
farAx           //Integer far axis
```

#### Exemples:
```
var monofocalNearLens = new Lens(
	"-2.00", "+0.75", "90"
);
var monofocalNearLensAbsSph = monofocalNearLens.nearSphAbs;


//Exemple Monofocal far lens:
var monofocalFarLens = new Lens(
	undefined,  undefined,  undefined,
	"-2.00",    "+2.00",    "90"
);
var monofocalFarLensAbsSph = monofocalFarLens.farSphAbs;


//Exemple Progressive lens:
var progressiveLens = new Lens(
	"-2.50", "+0.75", "30",
	"-2.00", "+2.00", "90"
);
var progressiveLensNearAbsSph = monofocalNearLens.nearSphAbs;
var progressiveLensFarAbsSph  = monofocalFarLens.farSphAbs;
```

----------


METHODS
-------------------

#### maxDiopter();

Return associative array with three values:

```
maxDiopter.near;         // Max absolute diopter for near data
maxDiopter.far;          // Max absolute diopter for far data
maxDiopter.progressive  // Max absolute diopter between max absolute near diopter and max absolute far diopter
```

#### Exemples:
```
var progLens = new Lens (
	"-2.50", "+0.75", "30",
	"-2.00", "+2.00", "90"
);
var progLensMaxDiopter = progLens.maxDiopter();
var progLensMaxDiopterProgressive = progLensMaxDiopte`
.progressive;
```
#### transpose();

Return a multidimensionalarray with transposed near and far data:

```
transpose.near.sph;
transpose.near.cyl
transpose.near.ax

transpose.far.sph;
transpose.far.cyl;
transpose.far.ax;
```

```
transpose("plus");   //will output all values transposed with positive cylinders;
transpose("minus");  //will output all values transposed with negative cylinders;
transpose();         //will output all values transposed with opposite cylinder. Plus to minus and minus to plus.
```

#### Exemples:
```
var progLens = new Lens (
	"-1.00", "6.00", "2",
	"+1.25", "2.00", "50"
);
var progLensTranspose = progLens.transpose("plus");
console.log(progLensTranspose);
```