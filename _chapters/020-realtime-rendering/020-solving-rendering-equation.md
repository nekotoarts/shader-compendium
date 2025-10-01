---
title: Solving the Rendering Equation
slug: solving-rendering-equation
---

Now that we understand the rendering equation, the natural next step is to solve it so that we can render beautiful scenes! Except... we can't.

The integral we saw in the rendering equation in the last chapter, is actually impossible to solve:

$$
\int_{\Omega} L_i (\vec{x},\vec{\omega_o}) \cdot \textbf{BSDF} (\vec{x},\vec{\omega_i},\vec{\omega_o}) \cdot (\vec{\omega_i} \cdot \vec{n}) \; d\vec{\omega_i}
$$

Specifically, this type of integral is called a Fredholm integral equation of the second kind, which is a type of integral you can find in many other beginner-friendly fields of science such as quantum field theory.

So... how exactly do you even go about solving the rendering equation then? The answer is pretty simple, you don't. We can't average the behavior of an infinite number of incident directions $\vec{\omega_i}$, but if you really think about it, you'll realize that we don't need to.

For starters, there's only so many pixels on your screen, and they are in discrete locations. That means we're really only interested in a discrete solution to the rendering equation.

So, an approximation to the solution of the rendering equation is good enough for us as long as it provides sufficient detail and information for all pixels on our screen.

As of the time of writing, there are two main methods you can use to solve the integral shown earlier: Finite Element Method (FEM) and Monte Carlo Sampling.

Using FEM leads to the radiosity rendering method, although now it is becoming increasingly popular to employ ray-tracing to solve the rendering equation. Most ray-tracing approaches use Monte Carlo Sampling instead to solve the integral.

Monte Carlo Sampling essentially includes picking many uniformly distributed random incident directions $\vec{\omega_i}$ and then simply averaging the results to approximate the integral. The more points sampled, the closer the approximation is to the true solution.
