---
title: Rasterization
slug: rasterization
---

Up until recent times when ray-tracing and path-tracing became viable options to numerically approximate a solution to the rendering equation, we rendered things using a completely different technique called **rasterization**.

But before we get into that lets talk a little bit about shading first. Lighting and shading can be broken down into two parts: direct lighting and indirect lighting.

## Lighting and Shading

### Direct Lighting

This is the light that travels straight from a source to a surface without bouncing around the scene. Imagine a flashlight shining on a wall: the bright spot you see is direct lighting, because the photons left the flashlight and hit the wall in a single step.

In rendering terms, direct lighting is what we get when we evaluate the rendering equation but only consider light that comes directly from visible sources. It is fast to compute and gives us sharp effects like highlights and hard shadows

### Indirect Lighting

While direct lighting comes straight from a source, indirect lighting is what happens after light bounces around the scene. Imagine sunlight entering a room through a window. The floor becomes bright where the sun hits directly, but the rest of the room is still softly lit. That gentle glow comes from light reflecting off the floor, walls, and ceiling before reaching your eyes. That is indirect lighting.

In rendering terms, indirect lighting is the part of the rendering equation that accounts for incoming light after one or more bounces. It is what gives us effects like color bleeding, soft shadows, and the overall sense of realism in an image. Without indirect lighting, scenes look flat and artificial, because we lose the way light naturally spreads and mixes.
