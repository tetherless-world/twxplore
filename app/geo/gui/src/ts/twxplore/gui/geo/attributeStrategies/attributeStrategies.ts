// In an OOP Language -
// TypeScript
interface FeatureAttributeFunctions {
    isNumeric() : boolean
    isString(): boolean
}

enum Attributes {
    LABEL = "label",
    TYPE = "type",
    URI = "uri",
    FREQUENCY = "frequency",
    TIMESTAMP = "timestamp",
    LOCALITY = "locality",
    POSTALCODE = "postalcode",
    REGIONS =  "regions",
    TRANSMISSIONPOWER = "transmissionPower",
    GEOMETRY = "geometry",
}

export class FeatureAttribute implements FeatureAttributeFunctions{
    private attributeName: string 
    private subclass: any
    constructor(attributeName: string) {
        this.attributeName = attributeName
        this.subclass = null
        switch (this.attributeName) {
            case (Attributes.TIMESTAMP): {
                this.subclass = FeatureAttributeTimestamp.getInstance()
            }
        }
    }

    isNumeric() : boolean {
        return (this.subclass? this.subclass.isNumeric() : false)
    }

    isString() : boolean {
        return (this.subclass? this.subclass.isString() : false)

    }
    
    

}

class FeatureAttributeTimestamp implements FeatureAttributeFunctions {
    private static instance: FeatureAttributeTimestamp;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {}

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): FeatureAttributeTimestamp {
        if (!FeatureAttributeTimestamp.instance) {
            FeatureAttributeTimestamp.instance = new FeatureAttributeTimestamp();
        }

        return FeatureAttributeTimestamp.instance;
    }
    isNumeric() : boolean {
        return true
    }
    isString() : boolean{
        return false
    }
    setValue() : void {

    }
}




