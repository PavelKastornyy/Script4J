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


import { ReadOnlyStringProperty } from "./ReadOnlyStringProperty";
import { Property } from "./Property";
import { WritableStringValue } from "./../value/WritableStringValue";
import { ObservableValue } from "./../value/ObservableValue";
import { Bindings } from './../binding/Bindings';

export abstract class StringProperty extends ReadOnlyStringProperty implements Property<string>, WritableStringValue {

    public abstract bind(observable: ObservableValue<string>): void;

    public abstract isBound(): boolean;

    public abstract unbind(): void;

    public abstract set(value: string);

    public bindBidirectional(other: Property<string>): void {
        Bindings.bindBidirectional(this, other);
    }

    public unbindBidirectional(other: Property<string>): void {
        Bindings.unbindBidirectional(this, other);
    }

    public setValue(value: string): void {
        this.set(value);
    }
}