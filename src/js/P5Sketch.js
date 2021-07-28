import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from '../audio/patterns-no-3.ogg';
import cueSet1 from "./cueSet1.js";
import cueSet2 from "./cueSet2.js";
import PlayIcon from './PlayIcon.js';
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
            255, 223, 223, 223, 223, 223, 223, 255,
            223, 127, 127, 190, 190, 127, 127, 223, 
            223, 190,  79,  79,  79,  79, 190, 223,
            223, 190,  47,   0,   0,  47, 190, 223,
            223, 190,  79,  79,  79,  79, 190, 223,
            223, 127, 127, 190, 190, 127, 127, 223,
            255, 223, 223, 223, 223, 223, 223, 255,
        ];

        p.cueSet1Completed = [];

        p.cueSet2Completed = [];

        p.preload = () => {
            p.song = p.loadSound(
                audio,
                function() {
                    document.getElementById("play-icon").classList.add("fade-in")    
                    document.getElementById("overlay").classList.add("fade-out")    
                }
            );
        }

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.sqaureHeight = p.height / 49; 
            p.sqaureWidth = p.width / 64; 
            p.angleMode(p.DEGREES);
            p.rectMode(p.CENTER);
            p.noLoop();
            p.background(0, 0, 0, 0);
            p.stroke(255);
            
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
        
        p.startX = 0;

        p.startY = 0;

        p.executeCueSet1 = (vars) => {
            const { currentCue, midi } = vars;
            if (!p.cueSet1Completed.includes(currentCue)) {
                p.cueSet1Completed.push(currentCue);
                const 
                    x1 = p.startX * (p.sqaureWidth * 8) + (p.sqaureWidth * 3.5),
                    y1 = p.startY * (p.sqaureHeight * 6) + p.sqaureHeight + (p.sqaureHeight * 2),
                    colour1 = NewtonsColourMapper(currentCue > 64 ? midi - 12 : midi),
                    colour2 = NewtonsColourMapper(midi - 48),
                    colour3 = NewtonsColourMapper(currentCue > 64 ? midi : midi - 24),
                    circleDivisor = currentCue > 64 ? 3 : 2, 
                    quadMultiplier  = currentCue > 64 ? 2 : 1;
                
                
                p.push();
                p.fill(colour1);
                p.noStroke();
                p.quad(x1 - p.sqaureWidth * quadMultiplier, y1, x1, y1 - p.sqaureHeight * quadMultiplier, x1 + p.sqaureWidth * quadMultiplier, y1, x1, y1 + p.sqaureHeight * quadMultiplier);
                if(currentCue > 128){
                    p.stroke(255);
                }
                p.fill(colour2);
                p.rect(x1, y1, p.sqaureWidth * quadMultiplier, p.sqaureHeight * quadMultiplier);
                if(currentCue > 64){
                    p.fill(colour1);
                    p.quad(x1 - p.sqaureWidth / 2, y1, x1, y1 - p.sqaureHeight / 2, x1 + p.sqaureWidth / 2, y1, x1, y1 + p.sqaureHeight / 2)
                    p.fill(colour3);
                    p.ellipse(x1, y1, p.sqaureWidth / circleDivisor, p.sqaureHeight / circleDivisor);
                }
                p.pop();

                p.startX++;
                if(p.startX === 8){
                    p.startX = 0;
                    p.startY++;
                    if(p.startY === 8){
                        p.startY = 0;
                    }
                }
            }
        };

        p.startX2 = 0;

        p.startY2 = 0;

        p.executeCueSet2 = (vars) => {
            const { currentCue, midi } = vars;
            if (!p.cueSet2Completed.includes(currentCue)) {
                p.cueSet2Completed.push(currentCue);
                const 
                    x1 = p.startX2 * (p.sqaureWidth * 8) + (p.sqaureWidth * 2), 
                    y1 = p.startY2 * (p.sqaureHeight * 6) + (p.sqaureHeight * 1.5), 
                    x2 = p.startX2 * (p.sqaureWidth * 8) + (p.sqaureWidth * 2), 
                    y2 = p.startY2 * (p.sqaureHeight * 6) + (p.sqaureHeight * 4.5), 
                    x3 = p.startX2 * (p.sqaureWidth * 8) + (p.sqaureWidth * 5), 
                    y3 = p.startY2 * (p.sqaureHeight * 6) + (p.sqaureHeight * 1.5), 
                    x4 = p.startX2 * (p.sqaureWidth * 8) + (p.sqaureWidth * 5), 
                    y4 = p.startY2 * (p.sqaureHeight * 6) + (p.sqaureHeight * 4.5), 
                    colour1 = NewtonsColourMapper(midi),
                    colour2 = NewtonsColourMapper(midi + 24), 
                    colour3 = NewtonsColourMapper(midi + 12), 
                    quadXAdjustor = currentCue > 64 ? p.sqaureWidth / 4 : p.sqaureWidth,
                    quadYAdjustor = currentCue > 64 ? p.sqaureHeight / 4 : p.sqaureHeight;
                
                p.fill(colour1);
                p.noStroke();
                if(currentCue > 64){
                    p.stroke(0);
                    p.fill(colour3);
                    p.quad(x1 - quadXAdjustor * 2, y1, x1, y1 - quadYAdjustor * 2, x1 + quadXAdjustor * 2, y1, x1, y1 + quadYAdjustor * 2)
                    p.quad(x2 - quadXAdjustor * 2, y2, x2, y2 - quadYAdjustor * 2, x2 + quadXAdjustor * 2, y2, x2, y2 + quadYAdjustor * 2)
                    p.quad(x3 - quadXAdjustor * 2, y3, x3, y3 - quadYAdjustor * 2, x3 + quadXAdjustor * 2, y3, x3, y3 + quadYAdjustor * 2)
                    p.quad(x4 - quadXAdjustor * 2, y4, x4, y4 - quadYAdjustor * 2, x4 + quadXAdjustor * 2, y4, x4, y4 + quadYAdjustor * 2)
                }
                p.fill(currentCue > 64 ? colour2 : colour1);
                p.quad(x1 - quadXAdjustor, y1, x1, y1 - quadYAdjustor, x1 + quadXAdjustor, y1, x1, y1 + quadYAdjustor)
                p.quad(x2 - quadXAdjustor, y2, x2, y2 - quadYAdjustor, x2 + quadXAdjustor, y2, x2, y2 + quadYAdjustor)
                p.quad(x3 - quadXAdjustor, y3, x3, y3 - quadYAdjustor, x3 + quadXAdjustor, y3, x3, y3 + quadYAdjustor)
                p.quad(x4 - quadXAdjustor, y4, x4, y4 - quadYAdjustor, x4 + quadXAdjustor, y4, x4, y4 + quadYAdjustor)

                p.startX2++;
                if(p.startX2 === 8){
                    p.startX2 = 0;
                    p.startY2++;
                    if(p.startY2 === 8){
                        p.startY2 = 0;
                    }
                }
            }
        };

        p.draw = () => {
            p.translate(p.sqaureWidth / 2, p.sqaureHeight / 2);
            for(let x =0; x < p.width; x = x + (p.sqaureWidth * 8)){
                let y =0
                for(let i =0; i < 8; i++){
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
                    const x = i * p.sqaureWidth,
                        y = j * p.sqaureHeight,
                        quadYAdjustor = p.sqaureHeight / 2,
                        quadXAdjustor = p.sqaureWidth / 2,
                        fillColour = p.pattern[patternIndex];
                    
                    p.noStroke();
                    p.fill(fillColour);      
                    p.quad(x - quadXAdjustor, y, x, y - quadYAdjustor, x + quadXAdjustor, y, x, y + quadYAdjustor)
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
                document.getElementById("play-icon").classList.remove("fade-in");
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
            <PlayIcon />
        </div>
    );
};

export default P5Sketch;
