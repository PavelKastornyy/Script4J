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

import { EventBus } from './eventbus/EventBus';
import { SceneEventHandlerManager } from './SceneEventHandlerManager';

/**
 * There is no package scope in TypeScript. To solve this proplem this Unlocker is used.
 * In allows to keep JavaFX API and to check code at compilation time.
 */
export interface SceneUnlocker {
    
    /**
     * Returns event bus.
     */
    getEventBus(): EventBus;
    
    /**
     * Returns eventHandlerManager
     */
    getEventHandlerManager(): SceneEventHandlerManager;
    
}

