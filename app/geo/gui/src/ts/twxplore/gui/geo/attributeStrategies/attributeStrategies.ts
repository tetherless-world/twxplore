// In an OOP Language -

import { FeatureAttributeName, FeatureAttributeKey } from "../states/map/FeatureAttributeName";

// TypeScript



 export abstract class FeatureAttribute{
    constructor() {
    }
    static valueOf(name: string): FeatureAttribute {
        switch(FeatureAttributeName[name as FeatureAttributeKey]) {
            case FeatureAttributeName.timestamp: {
               return TimestampFeatureAttribute.getInstance()
            }
            case FeatureAttributeName.frequency: {
                return FrequencyFeatureAttribute.getInstance()
            }
            case FeatureAttributeName.transmissionPower: {
                return TransmissionPowerFeatureAttribute.getInstance()
            }
            
            default : {
                return IgnoreFeatureAttribute.getInstance()
                
            }
         }
    }
    abstract get name(): string

    ignore(): boolean {
        return false
    }
    getFilterType(){
        return 'none'
    }

    abstract isNumeric() : boolean 

    abstract isString() : boolean 
    
}

class TimestampFeatureAttribute extends FeatureAttribute {
    private static instance: TimestampFeatureAttribute;

    private constructor() {
        super()
    }

    public static getInstance(): TimestampFeatureAttribute {
        if (!TimestampFeatureAttribute.instance) {
            TimestampFeatureAttribute.instance = new TimestampFeatureAttribute();
        }

        return TimestampFeatureAttribute.instance;
    }
    get name(): string{
        return FeatureAttributeName.timestamp
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

class FrequencyFeatureAttribute extends FeatureAttribute {
    private static instance: FrequencyFeatureAttribute;

    private constructor() {
        super()
    }

    public static getInstance(): TimestampFeatureAttribute {
        if (!FrequencyFeatureAttribute.instance) {
            FrequencyFeatureAttribute.instance = new FrequencyFeatureAttribute();
        }

        return FrequencyFeatureAttribute.instance;
    }
    get name(): string{
        return FeatureAttributeName.frequency
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

class TransmissionPowerFeatureAttribute extends FeatureAttribute {
    private static instance: TransmissionPowerFeatureAttribute;

    private constructor() {
        super()
    }

    public static getInstance(): TimestampFeatureAttribute {
        if (!TransmissionPowerFeatureAttribute.instance) {
            TransmissionPowerFeatureAttribute.instance = new TransmissionPowerFeatureAttribute();
        }

        return TransmissionPowerFeatureAttribute.instance;
    }

    get name(): string{
        return FeatureAttributeName.transmissionPower
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

class IgnoreFeatureAttribute extends FeatureAttribute {
    private static instance: IgnoreFeatureAttribute;

    private constructor() {
        super()
    }

    public static getInstance(): TimestampFeatureAttribute {
        if (!IgnoreFeatureAttribute.instance) {
            IgnoreFeatureAttribute.instance = new IgnoreFeatureAttribute();
        }

        return IgnoreFeatureAttribute.instance;
    }
    get name(): string{
        return "ignore"
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


