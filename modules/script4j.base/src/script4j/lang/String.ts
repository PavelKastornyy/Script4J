/*
 * Copyright (c) 2018-2019 Pavel Kastornyy. All rights reserved.
 * The specified copyright does not cover application programming interface
 * (API) and the documentation for this API, which were taken from other
 * libraries. See NOTICE file for more information.
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation. Copyright holder designates
 * this particular file as subject to the "Classpath" exception as provided
 * by copyright holder in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 */

import './Object';
import { Comparable } from './Comparable';

/**
 * In JS there are primitive string and String object.
 * A string primitive is parsed to a v8::String object. Hence, methods can be invoked directly on it.
 * A String object, in the other hand, is parsed to a v8::StringObject which extends Object and, apart from being
 * a full fledged object, serves as a wrapper for v8::String.
 * See details here : https://stackoverflow.com/a/17256419/5057736
 * That's why:
 * typeof "abc"; //"string"
 * typeof String("abc"); //"string"
 * typeof new String("abc"); //"object"
 * typeof (new String("abc")).valueOf(); //"string"
 * The same is about Number, Boolean.
 */
declare global {

    /**
     * For static methods. See https://stackoverflow.com/a/32144161/5057736
     */
    interface StringConstructor {
        of(str:string):String;
        
        valueOf(obj?: Object): string;
    }

    interface String extends Comparable<string> {
        hashCode(): number;

        equals(obj: Object): boolean;

        toString(): string;
        
        startsWith(prefix: string, toffset?: number): boolean;
        
        compareTo(anotherString: string): number;
    }
}

const defineStringPrototype = (name, value) => {
    Object.defineProperty(String.prototype, name, {
        value,
        writable: true,
        configurable: true,
        enumerable: false
    });
}

//for static methods
const defineString = (name, value) => {
    Object.defineProperty(String, name, {
        value,
        writable: true,
        configurable: true,
        enumerable: false
    });
}

defineStringPrototype("equals", function(obj: Object) {
    if (obj === null) {
        return false;
    };
    if (typeof this === "string") {
        if (typeof obj === "string") {
            return this === obj;
        } else if (obj instanceof String) {
            return this === obj.valueOf();
        } else {
            return false;
        }
    //this is object
    } else {
        if (typeof obj === "string") {
            return this.valueOf() === obj;
        } else if (obj instanceof String) {
            return this.valueOf() === obj.valueOf();
        } else {
            return false;
        }
    }
});

/**
 * Primitive can not have propeties -> it can not have saved hashCode. Although this method doesn't save
 * generated hash for next call (as it can be used also for primitives) it is clear, that long string are rare used
 * for keys in map.
*/
defineStringPrototype("hashCode", function () {
    let hashCode: number;
    if (this.length === 0){
        hashCode = 0;
    } else {
        for (let i: number = 0; i < this.length; i++) {
            let char: number = this.charCodeAt(i);
            //As in Java. The hash << 5 - hash is the same as hash * 31 + char but faster.
            hashCode  = ((hashCode << 5) - hashCode) + char;
            //An example: hash = 7264728162427 (which is 69B738AA07B in hex).
            //hash | 0 will chop off everything above 32 bits (in this case, 69B) to leave
            //738AA07B, which is 1938464891 in decimal.
            //So you'll find that (hash | 0) === 1938464891.
            hashCode = hashCode | 0;
        }
    }
    return hashCode;
});

defineStringPrototype("toString", function() {
    if (typeof this === "string") {
        return this;
    //it is a String wrapper
    } else {
        return this.valueOf();
    }
});

defineStringPrototype("startsWith", function(prefix: string, toffset?: number) {
    if (toffset === undefined) {
        toffset = 0;
    }
    return (this.lastIndexOf(prefix, toffset) === toffset);
});

defineStringPrototype("compareTo", function(anotherString: string) {
    return this.localeCompare(anotherString);
});

//we save original function
const stringPrototypeValueOf = String.prototype.valueOf;

defineString("valueOf", function(obj?: Object) {
    if (obj === undefined) {
        return stringPrototypeValueOf.call(this);
    } else {
        return (obj === null) ? "null" : obj.toString();
    }
});