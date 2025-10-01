---
title: The GPU Design
slug: gpu-design
---

We like to think of the GPU as "much faster" than the CPU for large scale computational tasks. This is however, not exactly true.

To understand what makes the GPU a better choice for a large scale computational task, as well as what limitations apply to it, we must first understand the way the GPU is designed.

## Strength in Numbers

The primary benefit of GPU hardware is it's number of cores. While most consumer CPUs have some 10s of cores, most modern GPUs have upwards of 1000 or even 10,000 cores!

However, the GPU relies on using a **single set of instructions for all its cores** and pushing through a very large amount of data for processing simultaneously.

The CPU, while being able to switch between multiple different instruction sets quickly, can only process a much smaller volume of data at once.

This is where the true "speed" of the GPU is demonstrated. Although GPU cores may not be significantly faster than the CPU in computing a single item in a repetitive task list, their ability to process a very large volume of these at once makes them significantly quicker overall.

## Limitations

Our understanding of how the GPU is able to compute many things very quickly introduces us to certain limitations with what these tasks can be. Particularly, we have two main limitations:

-   Task Independence
-   Single Set of Instructions

### Task Independence

Perhaps the biggest issue with moving any repetitive task to the GPU is ensuring all tasks are independent of each other.

Since the GPU processes multiple tasks at once, in a random order, none of these tasks can be interdependent, that is to say that they cannot rely on each other's outputs.

Also, in the case of compute shaders, the GPU can only batch together a certain number of "threads" or "invocations" at once, so even shared memory is extremely limited.

Fragment processing for example, is perfectly suited to the GPU as you don't need to know any information about any other fragments in order to process the color of a fragment.

### Single Set of Instructions

The GPU dispatches a certain number of cores at a time (called a warp), each with access to buffers located in GPU memory, but they all receive the same set of instructions.

GPU programs are written such that each core figures out what part of the GPU memory it needs to access in order to complete its task. Effectively, **one** program is written **for all** GPU cores to execute.

![](/assets/images/chapter1/all_might_fist.jpg)
