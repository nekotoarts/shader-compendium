---
title: Navier-Stokes Equations and Finite Difference Models
slug: navier-stokes-finite-difference
---

## Navier-Stokes Equations

The Navier-Stokes Equations are a series of partial differential equations that are used to describe the motion of viscous fluids.

In order to simulate fluid-like motion we need to calculate a solution to the Navier-Stokes equations in real time, which proves to be quite a challenge.

**For this chapter, we are only going to focus on developing a _2D Eulerian_ solution for incompressible Newtonian fluids (like water) with constant density and constant viscosity**. Detailing exactly how the Navier-Stokes equations were developed is beyond the scope of this book, we are only going to discuss methods to solve these equations in real-time using the GPU.

> "Eulerian" simulations means that the solution domain is a grid of cells and the solution for the equations are calculated for every cell in the grid. This "grid" is very similar to a texture with pixels, which makes it ideal for us to implement an Eulerian solution on the GPU because then our solution domain is simply the values of the texture.

The two governing equations for our model are as follows:

$$
\tag{1}
\nabla \cdot \vec{u} = 0 \; \textrm{(Incompressible Flow)}
$$

$$
\tag{2}
\frac{\partial \vec{u}}{\partial t} = \underbrace{-(\vec{u}\cdot\nabla)\vec{u}}_{\text{Advection}} - \underbrace{\frac{1}{\rho}\nabla p}_{\text{Pressure}} + \underbrace{\nu \nabla^2 \vec{u}}_{\text{Diffusion}} + \underbrace{\vec{F}}_{\text{External Forces}}
$$

where:

- $\vec{u}$ is the fluid velocity field
- $\rho$ is the fluid density
- $p$ is the fluid pressure
- $\nu$ is the fluid viscosity
- $\vec{F}$ is the vector field of external forces applied to the fluid

### Advection

Advection is the movement of some quantity in the direction of the velocity vectors of the velocity vector field. For fluids, properties such as the the fluid temperature, substances in the fluid, and even the velocities themselves!

### Pressure

External forces applied to a fluid do not instantly propagate through the entire fluid, first pressure builds up near the applied area and then that pushes on particles further away. Any pressure in the fluid naturally leads to acceleration (GPU Gems 1).

### Diffusion

Diffusion is the movement of some quantity in the fluid from a region of higher concentration to a region of lower concentration.

Diffusion is primarily controlled by viscosity. Viscosity is a measure of the fluid's resistance to flow. Fluids with higher viscosity such as honey or maple syrup take more effort to get moving.

{% include figure.html
    caption="Honey is a viscous fluid so it requires more effort to move"
    url="/assets/images/chapter6/pexels-roman-odintsov-6422025.jpg"
    class="row"
%}

## Vector Calculus Operators

In the Navier-Stokes equations above we see a lot of these upside down triangle symbols $\nabla$. That symbol is a Greek letter called lambda, and it is used to represent quite a few different vector calculus operations.

Here's a table that describes their notation and what they mean:

| Vector Calculus Operator |         Notation        | Definition                                                  |
|:------------------------:|:-----------------------:|-------------------------------------------------------------|
| Gradient Operator        | $\nabla x$        | Shows the direction and rate of fastest increase of a scalar field |
| Divergence Operator      | $\nabla \cdot \vec{x}$  | Shows how much a point acts like a source or sink           |
| Curl Operator            | $\nabla \times \vec{x}$ | Shows how much a field swirls or rotates around a point     |
| Laplacian Operator       | $\nabla^2 \; \vec{x}$ OR $\nabla^2 \; x$   | Shows how a value differs from the average around it        |

### Finite Difference Approximations

The definitions of these operators are used over **continuous** vector fields, however, our simulation data only exists at **discrete** intervals (which is wherever our pixels are located).

This means that we can't directly use the definition of these operators in our equation but instead need to develop a discretized representation of them instead. This is done using **finite difference models**.

This table illustrates each operator and its equivalent finite difference approximation, which we will use when developing our shaders. Specifically, the approximations shown here are _second-order centered finite difference approximations_.

For simplicity, let $\vec{u} = (u,v)$


| Operator | Continuous Definition | Finite Difference Approximation |
|:--------:|:---------------------:|:-------------------------------:|
| $\nabla p$  | $\Large\left[ \frac{\partial p}{\partial x}, \frac{\partial p}{\partial y} \right]$ | $\Large\left[ \frac{p_{i+1,j} - p_{i-1,j}}{2\delta x}, \frac{p_{i,j+1} - p_{i,j-1}}{2\delta y} \right]$               |
| $\nabla \cdot \vec{u}$ | $\Large\frac{\partial u}{\partial x} + \frac{\partial v}{\partial y}$                           | $\Large\frac{u_{i+1,j} - u_{i-1,j}}{2\delta x} + \frac{v_{i,j+1} - v_{i,j-1}}{2\delta y}$                             |
| $\nabla \times \vec{u}$ | $\Large\frac{\partial v}{\partial x} - \frac{\partial u}{\partial y}$                           | $\Large \begin{bmatrix} 0,0, \frac{v_{i+1,j} - v_{i-1,j}}{2\delta x} - \frac{u_{i,j+1} - u_{i,j-1}}{2\delta y} \end{bmatrix}$ |
| $\nabla^2 p$  | $\Large\frac{\partial^2 p}{\partial x^2} + \frac{\partial^2 p}{\partial y^2}$                   | $\Large\frac{p_{i+1,j} - 2p_{i,j} + p_{i-1,j}}{(\delta x)^2} + \frac{p_{i,j+1} - 2p_{i,j} + p_{i,j-1}}{(\delta y)^2}$ |
| $\nabla^2 \vec{u}$  | $\Large\frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 v}{\partial y^2}$ | $\Large\begin{bmatrix}\frac{u_{i+1,j} - 2u_{i,j} + u_{i-1,j}}{(\delta x)^2} + \frac{u_{i,j+1} - 2u_{i,j} + u_{i,j-1}}{(\delta y)^2} \atop \frac{v_{i+1,j} - 2v_{i,j} + v_{i-1,j}}{(\delta x)^2} + \frac{v_{i,j+1} - 2v_{i,j} + v_{i,j-1}}{(\delta y)^2}\end{bmatrix}$ |