// In an OOP Language -

import { FeatureAttributeName } from "../states/map/FeatureAttributeName";

// TypeScript
interface FeatureAttributeTypes {
    isNumeric() : boolean
    isString(): boolean
    getFilterType(): string
    ignore(): boolean
    attributeName: FeatureAttributeName
}


 export abstract class FeatureAttribute implements FeatureAttributeTypes{
    public attributeName: FeatureAttributeName 
    constructor(attributeName: FeatureAttributeName) {
        this.attributeName = attributeName
    }
    static AttributeTypeOf(attributeName: FeatureAttributeName): FeatureAttribute {
        switch(attributeName) {
            case FeatureAttributeName.timestamp: {
               return TimestampFeatureAttribute.getInstance(attributeName)
            }
            case FeatureAttributeName.frequency: {
                return FrequencyFeatureAttribute.getInstance(attributeName)
            }
            case FeatureAttributeName.transmissionPower: {
                return TransmissionPowerFeatureAttribute.getInstance(attributeName)
            }
            
            default : {
                return IgnoreFeatureAttribute.getInstance(attributeName)
                
            }
         }
    }

    ignore(): boolean {
        return false
    }
    getFilterType(){
        return 'none'
    }

    abstract isNumeric() : boolean 

    abstract isString() : boolean 
    
}

class TimestampFeatureAttribute extends FeatureAttribute implements FeatureAttributeTypes {
    private static instance: TimestampFeatureAttribute;

    private constructor(attributeName: FeatureAttributeName) {
        super(attributeName)
    }

    public static getInstance(attributeName: FeatureAttributeName): TimestampFeatureAttribute {
        if (!TimestampFeatureAttribute.instance) {
            TimestampFeatureAttribute.instance = new TimestampFeatureAttribute(attributeName);
        }

        return TimestampFeatureAttribute.instance;
    }
    isNumeric() : boolean {
        return true
    }
    isString() : boolean{
        return false
    }

    getFilterType(){
        return 'timeRange'
    }
    
}

class FrequencyFeatureAttribute extends FeatureAttribute implements FeatureAttributeTypes {
    private static instance: FrequencyFeatureAttribute;

    private constructor(attributeName: FeatureAttributeName) {
        super(attributeName)
    }

    public static getInstance(attributeName: FeatureAttributeName): TimestampFeatureAttribute {
        if (!FrequencyFeatureAttribute.instance) {
            FrequencyFeatureAttribute.instance = new FrequencyFeatureAttribute(attributeName);
        }

        return FrequencyFeatureAttribute.instance;
    }
    isNumeric() : boolean {
        return true
    }
    isString() : boolean{
        return false
    }

    getFilterType(){
        return 'range'
    }
}

class TransmissionPowerFeatureAttribute extends FeatureAttribute implements FeatureAttributeTypes {
    private static instance: TransmissionPowerFeatureAttribute;

    private constructor(attributeName: FeatureAttributeName) {
        super(attributeName)
    }

    public static getInstance(attributeName: FeatureAttributeName): TimestampFeatureAttribute {
        if (!TransmissionPowerFeatureAttribute.instance) {
            TransmissionPowerFeatureAttribute.instance = new TransmissionPowerFeatureAttribute(attributeName);
        }

        return TransmissionPowerFeatureAttribute.instance;
    }
    isNumeric() : boolean {
        return true
    }
    isString() : boolean{
        return false
    }
    getFilterType(){
        return 'range'
    }
}

class IgnoreFeatureAttribute extends FeatureAttribute implements FeatureAttributeTypes {
    private static instance: IgnoreFeatureAttribute;

    private constructor(attributeName: FeatureAttributeName) {
        super(attributeName)
    }

    public static getInstance(attributeName: FeatureAttributeName): TimestampFeatureAttribute {
        if (!IgnoreFeatureAttribute.instance) {
            IgnoreFeatureAttribute.instance = new IgnoreFeatureAttribute(attributeName);
        }

        return IgnoreFeatureAttribute.instance;
    }
    isNumeric() : boolean {
        return false
    }
    isString() : boolean{
        return false
    }
    
    ignore() : boolean {
        return true
    }
} 


