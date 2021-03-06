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

import { TextArea } from './../../../scene/control/TextArea';
import { TextAreaSkin } from './../../../scene/control/skin/TextAreaSkin';
import { TextField } from './../../../scene/control/TextField';
import { TextFieldSkin } from './../../../scene/control/skin/TextFieldSkin';
import { Button } from './../../../scene/control/Button';
import { ButtonSkin } from './../../../scene/control/skin/ButtonSkin';
import { Label } from './../../../scene/control/Label';
import { LabelSkin } from './../../../scene/control/skin/LabelSkin';
import { ComboBox } from './../../../scene/control/ComboBox';
import { ComboBoxBase } from './../../../scene/control/ComboBoxBase';
import { ComboBoxListViewSkin } from './../../../scene/control/skin/ComboBoxListViewSkin';
import { HTMLSkinFactoryManager } from 'script4jfx.graphics';
import { HTMLSkinFactory } from 'script4jfx.graphics';
import { HTMLSkin } from 'script4jfx.graphics';
import 'jquery';

export class SkinFactoryRegistrator {
    
    private static hasRegistered: boolean = SkinFactoryRegistrator.register();
    
    private static register(): boolean {
        HTMLSkinFactoryManager.registerFactory(TextArea.class(), 
                HTMLSkinFactory.lambda((control: TextArea, element: HTMLElement) => {
            return new TextAreaSkin(control, element);
        }));
        HTMLSkinFactoryManager.registerFactory(TextField.class(), 
                HTMLSkinFactory.lambda((control: TextField, element: HTMLElement) => {
            return new TextFieldSkin(control, element);
        }));
        HTMLSkinFactoryManager.registerFactory(Button.class(), 
                HTMLSkinFactory.lambda((control: Button, element: HTMLElement) => {
            return new ButtonSkin(control, element);
        }));
        HTMLSkinFactoryManager.registerFactory(Label.class(), 
                HTMLSkinFactory.lambda((control: Label, element: HTMLElement) => {
            return new LabelSkin(control, element);
        }));
        HTMLSkinFactoryManager.registerFactory(ComboBox.class(), 
                HTMLSkinFactory.lambda((control: ComboBox<any>, element: HTMLElement) => {
            return <HTMLSkin<ComboBox<any>>><unknown> new ComboBoxListViewSkin<ComboBox<any>>(control, element);
        }));
        
        return true;
    }
}    

