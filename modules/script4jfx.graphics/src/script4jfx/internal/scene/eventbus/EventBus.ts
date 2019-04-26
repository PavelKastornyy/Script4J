/*
 * Copyright (c) 2018-2019 Pavel Kastornyy. All rights reserved.
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.
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

import { BusEvent } from './BusEvent';
import { BusEventListener } from './BusEventListener';
import { Class } from 'script4j.base';
import { Map } from 'script4j.base';
import { HashMap } from 'script4j.base';
import { Set } from 'script4j.base';
import { HashSet } from 'script4j.base';
import { Iterator } from 'script4j.base';
import { EventType } from 'script4jfx.base';

export class EventBus {
    
    private listenersByEventType: Map<EventType<any>, Set<BusEventListener<any>>> = new HashMap();
    
    public register<T extends BusEvent>(eventType: EventType<T>, listener: BusEventListener<T>): void {
        let listeners: Set<BusEventListener<any>> = this.listenersByEventType.get(eventType);
        if (listeners === null) {
            listeners = new HashSet();
            this.listenersByEventType.put(eventType, listeners);
        }
        listeners.add(listener);
    }
    
    public unregister<T extends BusEvent>(eventType: EventType<T>, listener: BusEventListener<T>): void {
        const listeners: Set<BusEventListener<any>> = this.listenersByEventType.get(eventType);
        if (listeners === null) {
            return;
        }
        listeners.remove(listener);
        if (listeners.isEmpty()) {
            this.listenersByEventType.remove(eventType);
        }
    }
    
    public post(event: BusEvent): void {
        const eventType: EventType<any> = event.getEventType();
        const listeners: Set<BusEventListener<any>> = this.listenersByEventType.get(eventType);
        if (listeners === null) {
            return;
        }
        const iterator: Iterator<BusEventListener<any>> = listeners.iterator();
        while(iterator.hasNext()) {
            try {
                iterator.next().handle(event);
            } catch (e) {
                console.log(e);
            }
        }
    }
}