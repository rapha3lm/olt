/**********************************************************
 ___       __          _   __  __   _       _   _         
| _ \__ _ / _|__ _ ___| | |  \/  | /_\  _ _| |_(_)_ _  ___
|   / _` |  _/ _` / -_) | | |\/| |/ _ \| '_|  _| | ' \(_-<
|_|_\__,_|_| \__,_\___|_| |_|  |_/_/ \_\_|  \__|_|_||_/__/

Ophthalmic lenses tools v1.0                    06/10/2015

Dependencies: None
***********************************************************

USAGE:
    var thisLens = new Lens(
        nearSphere, nearCylinder,   nearAxis,   //Near data
        farSphere,  farCylinder,    farAxis     //Far Data
    );

    Notes:  Providing both data will generate a progressive lens;
            Accepts data as strings, integer number or floating number;
            Both near or far data can be undefined.
    
    //Near data
        nearSphFloat    //Float near sphere
        nearCylFloat    //Float near cylinder
        nearSphAbs      //Absolute near sphere
        nearCylAbs      //Absolute near cylinder (Always positive)
        farAx           //Integer near axis
    
    //Far data
        farSphFloat     //Float far sphere
        farCylFloat     //Float far cylinder
        farSphAbs       //Absolute far sphere
        farCylAbs       //Absolute far cylinder (Always positive)      
        farAx           //Integer far axis

EXEMPLES:
    Exemple Monofocal near lens:
    var monofocalNearLens = new Lens(
        "-2.00", "+0.75", "90"
    );
    var monofocalNearLensAbsSph = monofocalNearLens.nearSphAbs;

    Exemple Monofocal far lens:
    var monofocalFarLens = new Lens(
        undefined,  undefined,  undefined,
        "-2.00",    "+2.00",    "90"
    );
    var monofocalFarLensAbsSph = monofocalFarLens.farSphAbs;

    Exemple Progressive lens:
    var progressiveLens = new Lens(
        "-2.50", "+0.75", "30",
        "-2.00", "+2.00", "90"
    );
    var progressiveLensNearAbsSph = monofocalNearLens.nearSphAbs;
    var progressiveLensFarAbsSph  = monofocalFarLens.farSphAbs;

METHODS:
    maxDiopter();

        Return associative array with three values:
            maxDiopter.near         // Max absolute diopter for near data
            maxDiopter.far          // Max absolute diopter for far data
            maxDiopter.progressive  // Max absolute diopter between max absolute near diopter and max absolute far diopter
        
        Exemple:
        var progLens = new Lens (
            "-2.50", "+0.75", "30",
            "-2.00", "+2.00", "90"
        );
        var progLensMaxDiopter = progLens.maxDiopter();
        var progLensMaxDiopterProgressive = progLensMaxDiopter.progressive;
    
    =======================================================
   
    transpose();
        
        Notes:  Accept parameter "plus" and "minus"
                    transpose("plus")   //will output all values transposed with positive cylinders;
                    transpose("minus")  //will output all values transposed with negative cylinders;
                    transpose()         //will output all values transposed with opposite cylinder.
                                            Plus to minus and minus to plus.

        Return a multidimensionalarray with transposed near and far data:

            transpose.near
                transpose.near.sph
                transpose.near.cyl
                transpose.near.ax

            transpose.far
                transpose.far.sph
                transpose.far.cyl
                transpose.far.ax

        Exemple:
        var progLens = new Lens (
            "-1.00", "6.00", "2",
            "+1.25", "2.00", "50"
        );
        var progLensTranspose = progLens.transpose("plus");
        console.log(progLensTranspose);

**********************************************************/
function Lens(nearSphere, nearCylinder, nearAxis, farSphere, farCylinder, farAxis) {
    "use strict";
    //Near data
    this.nearSph = nearSphere;
    this.nearCyl = nearCylinder;
    this.nearAx = parseInt(nearAxis, 10);
    this.nearSphFloat = parseFloat(this.nearSph);
    this.nearCylFloat = parseFloat(this.nearCyl);
    this.nearSphAbs = Math.abs(this.nearSphFloat);
    this.nearCylAbs = Math.abs(this.nearCylFloat);
    //Far data
    this.farSph = farSphere;
    this.farCyl = farCylinder;
    this.farAx = parseInt(farAxis, 10);
    this.farSphFloat = parseFloat(this.farSph);
    this.farCylFloat = parseFloat(this.farCyl);
    this.farSphAbs = Math.abs(this.farSphFloat);
    this.farCylAbs = Math.abs(this.farCylFloat);
    //Check lens type
    if (typeof this.nearSph === "undefined" || typeof this.nearCyl === "undefined" || typeof this.nearAx === "undefined") {
        this.nearLens = false;
    } else {
        this.nearLens = true;
    }
    if (typeof this.farSph === "undefined" || typeof this.farCyl === "undefined" || typeof this.farAx === "undefined") {
        this.farLens = false;
    } else {
        this.farLens = true;
    }
    if (this.nearLens && this.farLens) {
        this.progressiveLens = true;
    } else {
        this.progressiveLens = false;
    }
    this.transponseAux = function (sph, cyl, ax) {
        this.sph = sph;
        this.cyl = cyl;
        this.ax = ax;
        this.newSph = this.sph + this.cyl;
        this.newCyl = this.cyl * -1;
        if (this.ax > 90) {
            this.newAx = this.ax - 90;
        } else {
            this.newAx = this.ax + 90;
        }
        this.result = {
            sph: this.newSph,
            cyl: this.newCyl,
            ax: this.newAx
        };
        return this.result;
    };
    var parent = this;
    this.maxDiopter = function () {
        this.maxDiopterResult = [];
        //Near
        if (parent.nearLens) {
            if (parent.nearSphFloat * parent.nearCylFloat > 0) {
                //Iqual signs
                this.maxDiopterResult.near = parent.nearSphAbs + parent.nearCylAbs;
            } else {
                //Different signs
                this.maxDiopterResult.near = Math.max(parent.nearSphAbs, parent.nearCylAbs);
            }
        } else {
            this.maxDiopterResult.near = undefined;
        }
        //Far
        if (parent.farLens) {
            if (parent.farSphFloat * parent.farCylFloat > 0) {
                //Iqual signs
                this.maxDiopterResult.far = parent.farSphAbs + parent.farCylAbs;
            } else {
                //Different signs
                this.maxDiopterResult.far = Math.max(parent.farSphAbs, parent.farCylAbs);
            }
        } else {
            this.maxDiopterResult.far = undefined;
        }
        //Progressive
        if (parent.progressiveLens) {
            this.maxDiopterResult.progressive = Math.max(this.maxDiopterResult.near, this.maxDiopterResult.far);
        } else {
            this.maxDiopterResult.progressive = undefined;
        }
        return this.maxDiopterResult;
    };
    this.transpose = function (form) {
        this.form = form;
        switch (this.form) {
            case "plus":
                this.plus = true;
                break;
            case "minus":
                this.minus = true;
                break;
            default:
                this.opposite = true;
            break;
        }
        //Near
        if (parent.nearLens) {
            if (this.opposite || this.plus && parent.nearCylFloat < 0 || this.minus && parent.nearCylFloat > 0) {
                this.resultNear = parent.transponseAux(parent.nearSphFloat, parent.nearCylFloat, parent.nearAx);
                this.newNearSphPower = this.resultNear.sph;
                this.nearCylFloatInverted = this.resultNear.cyl;
                this.newNearAx = this.resultNear.ax;
            } else {
                this.newNearSphPower = parent.nearSphFloat;
                this.nearCylFloatInverted = parent.nearCylFloat;
                this.newNearAx = parent.nearAx;
            }
        } else {
            this.newNearSphPower = undefined;
            this.nearCylFloatInverted = undefined;
            this.newNearAx = undefined;
        }
        //Far
        if (parent.farLens) {
            if (this.opposite || this.plus && parent.farCylFloat < 0 || this.minus && parent.farCylFloat > 0) {
                this.resultFar = parent.transponseAux(parent.farSphFloat, parent.farCylFloat, parent.farAx);
                this.newFarSphPower = this.resultFar.sph;
                this.farCylFloatInverted = this.resultFar.cyl;
                this.newFarAx = this.resultFar.ax;
            } else {
                this.newFarSphPower = parent.farSphFloat;
                this.farCylFloatInverted = parent.farCylFloat;
                this.newFarAx = parent.farAx;
            }
        } else {
            this.newFarSphPower = undefined;
            this.farCylFloatInverted = undefined;
            this.newFarAx = undefined;
        }
        if (parent.nearLens) {
            this.near = {
                sph: this.newNearSphPower.toFixed(2),
                cyl: this.nearCylFloatInverted.toFixed(2),
                ax: this.newNearAx
            };
        }
        if (parent.farLens) {
            this.far = {
                sph: this.newFarSphPower.toFixed(2),
                cyl: this.farCylFloatInverted.toFixed(2),
                ax: this.newFarAx
            };
        }
        if (parent.progressiveLens) {
            this.bothTransposes = {
                near: this.near,
                far: this.far
            };
        } else if (parent.nearLens) {
            this.bothTransposes = {
                near: this.near
            };
        } else {
            this.bothTransposes = {
                far: this.far
            };
        }
        return this.bothTransposes;
    };
}