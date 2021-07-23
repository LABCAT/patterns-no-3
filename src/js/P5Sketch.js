import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from '../audio/patterns-no-3.ogg';
import cueSet1 from "./cueSet1.js";
import cueSet2 from "./cueSet2.js";
import NewtonsColourMapper from "./functions/NewtonsColourMapper.js";

const P5Sketch = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.sqaureHeight = 0;

        p.sqaureWidth = 0;

        p.pattern = [
            127, 127, 127, 127, 127, 127, 127, 127,
            127, 255, 190, 190, 255, 190, 255, 127, 
            127, 127,  63,   0,   0,  63, 127, 127,
            127, 127,   0,  31,  31,   0, 127, 127,
            127, 127,  63,   0,   0,  63, 127, 127,
            127, 255, 190, 190, 255, 190, 255, 127,
            127, 127, 127, 127, 127, 127, 127, 127,
        ];

        p.cueSet1Completed = [];

        p.cueSet2Completed = [];

        p.preload = () => {
            p.song = p.loadSound(audio);
        }

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.rectMode(p.CENTER);
            p.sqaureHeight = p.height / 39; 
            p.sqaureWidth = p.width / 64; 
            p.noLoop();
            
            for (let i = 0; i < cueSet1.length; i++) {
              let vars = {
                currentCue: i + 1,
                duration: cueSet1[i].duration,
                time: cueSet1[i].time,
                midi: cueSet1[i].midi,
              };
              p.song.addCue(cueSet1[i].time, p.executeCueSet1, vars);
            }

            for (let i = 0; i < cueSet2.length; i++) {
              let vars = {
                currentCue: i + 1,
                duration: cueSet2[i].duration,
                time: cueSet2[i].time,
                midi: cueSet2[i].midi,
              };
              p.song.addCue(cueSet2[i].time, p.executeCueSet2, vars);
            }
        }

        p.heightAdjuster = 0;

        p.heightAdjuster2 = 0;

        p.executeCueSet1 = (vars) => {
            const { currentCue, midi } = vars;
            if (!p.cueSet1Completed.includes(currentCue)) {
                p.cueSet1Completed.push(currentCue);
                const modulo = currentCue % 64 > 0 ? currentCue % 64 : 64,
                    x1 = (modulo - 1) * p.sqaureWidth,
                    x2 = (64 - modulo) * p.sqaureWidth,
                    y1 = Math.floor(p.map(midi, 50, 86, 36, 0)),
                    y2 =  Math.floor(p.map(midi, 50, 86, 0, 36)),
                    colour = NewtonsColourMapper(midi);
                p.fill(colour);
                if(modulo === 1 && currentCue > 1){
                    //p.heightAdjuster++;
                }
                p.rect(x1, y1 * p.sqaureHeight - (p.sqaureHeight * p.heightAdjuster), p.sqaureWidth, p.sqaureHeight);
                p.rect(x2, y2 * p.sqaureHeight + (p.sqaureHeight * p.heightAdjuster), p.sqaureWidth, p.sqaureHeight);
            }
        };

        p.executeCueSet2 = (vars) => {
            const { currentCue, midi } = vars;
            if (!p.cueSet2Completed.includes(currentCue)) {
                const modulo = currentCue % 64 > 0 ? currentCue % 64 : 64,
                    x1 = (modulo - 1) * p.sqaureWidth,
                    x2 = (64 - modulo) * p.sqaureWidth,
                    colour = NewtonsColourMapper(midi),
                    colour2 = NewtonsColourMapper(midi + 12);
                let y1 = Math.floor(p.map(midi, 50, 86, 36, 0)),
                    y2 =  Math.floor(p.map(midi, 50, 86, 0, 36));
                p.fill(colour);
                if(modulo === 1 && currentCue > 1){
                   // p.heightAdjuster2++;
                }
               
                //p.ellipse(x1, y1 * p.sqaureHeight - (p.sqaureHeight * p.heightAdjuster2), p.sqaureWidth, p.sqaureHeight);
                //p.ellipse(x2, y2 * p.sqaureHeight + (p.sqaureHeight * p.heightAdjuster2), p.sqaureWidth, p.sqaureHeight);
                
                p.noStroke();
                p.fill(colour);
                p.rect(x1, y1 * p.sqaureHeight - (p.sqaureHeight * p.heightAdjuster), p.sqaureWidth, p.sqaureHeight);
                p.rect(x2, y2 * p.sqaureHeight + (p.sqaureHeight * p.heightAdjuster), p.sqaureWidth, p.sqaureHeight);
                y1 = y1 * p.sqaureHeight;
                y2 = y2 * p.sqaureHeight;
                p.fill(colour2);
                p.quad(x1 - p.sqaureWidth / 2, y1, x1, y1 - p.sqaureHeight / 2, x1 + p.sqaureWidth / 2, y1, x1, y1 + p.sqaureHeight / 2)
                p.quad(x2 - p.sqaureWidth / 2, y2, x2, y2 - p.sqaureHeight / 2, x2 + p.sqaureWidth / 2, y2, x2, y2 + p.sqaureHeight / 2)
            }
        };

        p.draw = () => {
            p.background(0);
            // const patternSize = (p.sqaureSize * 6),
            //     xMod = (p.width - p.sqaureSize) % patternSize, 
            //     yMod = (p.height - p.sqaureSize) % patternSize,
            //     initialXTranslate = (xMod + p.sqaureSize) / 2 - (p.sqaureSize /2),
            //     initialYTranslate = (yMod + p.sqaureSize) / 2 - (p.sqaureSize /2);
            p.translate(p.sqaureWidth / 2, p.sqaureHeight + p.sqaureHeight / 2);
            for(let x =0; x < p.width; x = x + (p.sqaureWidth * 8)){
                let y =0
                for(let i =0; i < 6; i++){
                    p.translate(x, y);
                    p.drawPattern();
                    p.translate(-x, -y);
                    y = y + (p.sqaureHeight * 6)
                }    
            }
        };

        p.drawPattern = () => {
            let patternIndex = 0;
            for(let j=0; j< 7;j++){
                for(let i=0; i< 8;i++){
                    p.fill(p.pattern[patternIndex]);      
                    p.rect(i * p.sqaureWidth, j * p.sqaureHeight, p.sqaureWidth, p.sqaureHeight);
                    patternIndex++;
                }   
            }
        };

        p.mousePressed = () => {
            if (p.song.isPlaying()) {
                p.song.pause();
            } else {
                if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                }
                p.canvas.removeClass('fade-out');
                p.song.play();
            }
        };

        p.creditsLogged = false;

        p.logCredits = () => {
            if (!p.creditsLogged && parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                p.creditsLogged = true;
                console.log(
                    'Music By: http://labcat.nz/',
                    '\n',
                    'Animation By: https://github.com/LABCAT/patterns-no-3'
                );
                p.song.stop();
            }
        }

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
