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

import { assert } from 'chai';
import { Class } from './../../../src/script4j/lang/Class';
import { ArrayList } from './../../../src/script4j/util/ArrayList';
import { HashSet } from './../../../src/script4j/util/HashSet';
import { describe } from 'mocha';
import { it } from 'mocha';

describe('ClassTest', () => {

    class TheTest {

        constructor() {
            
        }
    }

    it('getName_forClass_correctResult', () => {
        assert.equal(TheTest.class().getName(), "TheTest");
    });

    it('getName_forInstance_correctResult', () => {
        let test = new TheTest();
        assert.equal(test.getClass().getName(), "TheTest");
    });

    it('forConstructor_multipleCall_sameClassInstance', () => {
        const klass: Class<ArrayList<any>> = Class.forConstructor(ArrayList);
        assert.equal(klass.getName(), "ArrayList");
        assert.equal(klass, Class.forConstructor(ArrayList));
    });
});
