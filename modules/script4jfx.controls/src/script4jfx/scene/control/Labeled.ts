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

import { Control } from './Control';
import { ChangeListener } from 'script4jfx.base';
import { StringProperty } from 'script4jfx.base';
import { ObservableValue } from 'script4jfx.base';
import { SimpleStringProperty } from 'script4jfx.base';
import { LabeledSkinBase } from './skin/LabeledSkinBase';

export abstract class Labeled extends Control {

    /**
     * The text to display in the label. Don't set any value to this field, because textProperty
     * will be called before the value is set to this field.
     */    
    private text: StringProperty;
    
    /**
     * Creates a Label with text
     */    
    constructor​(text?: string) {
        super();
        if (this.text === undefined) {
            this.text = null;
        }
        if (text !== undefined) {
            this.setText(text);
        }
    }
    
    /**
     * The text to display in the label. The text may be null.
     */
    public textProperty(): StringProperty {
        //undefined because skin well be created in parent constructor, while this.text is undefined in this constructor.
        if (this.text === null || this.text === undefined) {
            this.text = new SimpleStringProperty(null, this);
            this.text.addListener(ChangeListener.lambda((observable: ObservableValue<string>, 
                    oldValue: string, newValue: string) => {
                (<LabeledSkinBase<Labeled>> this.getSkin()).setText(newValue);
            }));
        }
        return this.text;
    }
    
    /**
     * Gets the value of the property text.
     */
    public getText(): string {
        return this.text === null ? null : this.text.get();
    }

    /**
     * Sets the value of the property text.
     */    
    public setText(value: string): void {
        this.textProperty().set(value);
    }

}

