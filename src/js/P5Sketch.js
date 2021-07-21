import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import ShuffleArray from "./functions/ShuffleArray.js";

const P5Sketch = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.sqaureSize = 0;

        p.pattern = [
            127, 127, 127, 127, 127, 127, 127,
            127, 255, 190, 255, 190, 255, 127,
            127, 127,  63,   0,  63, 127, 127,
            127, 127,   0,  31,   0, 127, 127,
            127, 127,  63,   0,  63, 127, 127,
            127, 255, 190, 255, 190, 255, 127,
            127, 127, 127, 127, 127, 127, 127,
        ];

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.sqaureSize = p.width / 40; 
            p.noLoop();
        };

        p.draw = () => {
            p.background(0);
            const patternSize = (p.sqaureSize * 6),
                xMod = (p.width - p.sqaureSize) % patternSize, 
                yMod = (p.height - p.sqaureSize) % patternSize,
                initialXTranslate = (xMod + p.sqaureSize) / 2 - (p.sqaureSize /2),
                initialYTranslate = (yMod + p.sqaureSize) / 2 - (p.sqaureSize /2);
            p.translate(-initialXTranslate, -initialYTranslate);
            for(let x =0; x < p.width; x = x + (p.sqaureSize * 6)){
                for(let y =0; y < p.height; y = y + (p.sqaureSize * 6)){
                    p.translate(x, y);
                    p.drawPattern();
                    p.translate(-x, -y);
                }    
            }
        };

        p.drawPattern = () => {
            let patternIndex = 0;
            for(let i=0; i< 7;i++){
                for(let j=0; j< 7;j++){
                    p.fill(p.pattern[patternIndex]);      
                    p.rect(i * p.sqaureSize, j * p.sqaureSize, p.sqaureSize, p.sqaureSize);
                    patternIndex++;
                }   
            }
        };

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.redraw();
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
        </div>
    );
};

export default P5Sketch;
