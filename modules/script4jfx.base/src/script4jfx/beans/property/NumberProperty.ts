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


import { ReadOnlyNumberProperty } from "./ReadOnlyNumberProperty";
import { Property } from "./Property";
import { WritableNumberValue } from "./../value/WritableNumberValue";
import { ObservableValue } from "./../value/ObservableValue";

export abstract class NumberProperty extends ReadOnlyNumberProperty implements Property<number>, WritableNumberValue {

    public bind(observable: ObservableValue<number>): void {
        this.getDelegate().bind(observable);
    }

    public bindBidirectional(other: Property<number>): void {
        this.getDelegate().bindBidirectional(other);
    }

    public isBound(): boolean {
        return this.getDelegate().isBound();
    }

    public unbind(): void {
        this.getDelegate().unbind();
    }

    public unbindBidirectional(other: Property<number>): void {
        this.getDelegate().unbindBidirectional(other);
    }

    public setValue(value: number): void {
        this.getDelegate().setValue(value);
    }
}