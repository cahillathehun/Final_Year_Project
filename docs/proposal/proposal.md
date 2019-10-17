# School of Computing &mdash; Year 4 Project Proposal Form

> Edit (then commit and push) this document to complete your proposal form.
> Make use of figures / diagrams where appropriate.
>
> Do not rename this file.

## SECTION A

|                     |                   |
|---------------------|-------------------|
|Project Title:       | xxxxxx            |
|Student 1 Name:      | Liam Ó Cearbhaill |
|Student 1 ID:        | 15384941          |
|Student 2 Name:      | Alexander Cahill  |
|Student 2 ID:        | 15321711          |
|Project Supervisor:  | xxxxxx            |

> Ensure that the Supervisor formally agrees to supervise your project; this is only recognised once the
> Supervisor assigns herself/himself via the project Dashboard.
>
> Project proposals without an assigned
> Supervisor will not be accepted for presentation to the Approval Panel.

## SECTION B

> Guidance: This document is expected to be approximately 3 pages in length, but it can exceed this page limit.
> It is also permissible to carry forward content from this proposal to your later documents (e.g. functional
> specification) as appropriate.
>
> Your proposal must include *at least* the following sections.


### Introduction

> Describe the general area covered by the project.

This will be a JavaScript project using Websockets and WebGL graphics to create a game with the aim of flocking objects away from your world and into another players.
The aim of this project is to create a real time multi-user environment as well as to implement a Boids algorithm.

    


### Outline

> Outline the proposed project.

Our proposed project is to make a multiplayer game where players have to chase flocks of animals from their screen to their opponent's screen using their cursor, or their finger in the case of touch screen phones/tablets.

The flock behaviour will be similar to Boids in how they flock together and avoid obstacles (the cursor).

### Background

> Where did the ideas come from?

The fact that we had completed an "Ant colony simulation" had inspired us to steer away from simple food/enemy based pathfinding to BOIDS. 
The learning that had resulted directly from working on the Ant Colony intruiged and highly interested both of us. 
The pathfinding in the ant colony simulation was very basic and each ant only "thought" about it's own best interests, with BOIDS the emphasis is on large flocking behaviours.

### Achievements

> What functions will the project provide? Who will the users be?

The program will be a simulation using BOIDS to simulate flocking behaviours, demonstrating a form of swarm intelligence.

This program will also be demonstrating multiple users being hosted on a single instance.

### Justification

> Why/when/where/how will it be useful?

### Programming language(s)

> List the proposed language(s) to be used.

The primary languages we intend to use are Javascript for client side graphical rendering and NodeJS for communication between clients and the server. We will also be making use of external graphical libraries gotten from Three.js, an open source JavaScript library that uses WebGL.



### Programming tools / Tech stack

> Describe the compiler, database, web server, etc., and any other software tools you plan to use.

Java Socket/ServerSocket/Websockets will be used for connectivity and hosting.

Node.js

IntelliJ IDE.

### Hardware

> Describe any non-standard hardware components which will be required.

We will be using our own machines for hosting and development, and also the lab machines in DCU for development.

There are hardware requirements beyond these and no non-standard hardware requirements.


### Learning Challenges

> List the main new things (technologies, languages, tools, etc) that you will have to learn.

The main new challenge facing us is the networking aspect of the project. We have only encountered a limited amount of this before so most of what we will be undertaking in this area will be new to us. We look forward to gaining more knowledge in networking and sockets.

Another new area we will encounter is the graphical aspect of the project. In our 3rd year project we had limited experience with using simple 2d graphics. With this project we will be using 3d models from external libraries, namely Three.js.

Although the writing of the Boids' algorithm will be somewhat new to us, some of the skills used to write the pathfinding algorithms in our 3rd year project will be transferrable.



### Breakdown of work

> Clearly identify who will undertake which parts of the project.
>
> It must be clear from the explanation of this breakdown of work both that each student is responsible for
> separate, clearly-defined tasks, and that those responsibilities substantially cover all of the work required
> for the project.


#### Student 1 (Liam)

> *(Liam) should complete this section.*
>
As I have experience working with UI from my internship (Angular) I have opted to dive into learning and becoming comfortable with three.js.
I realise these will be worlds apart, however as neither of us have any direct experience in this field I am happy to take responsibility for it. 
#### Student 2 (Alex)

> *(Alex) should complete this section.*

As I have experience with NodeJS and Javascript, which is what we'll being using in to handle communication between the clients and server with the Socket.IO library, I will be taking most responsibility for the networking and server side work.

We will be undetaking the complaetion of the documentation for the project together, except for some parts that require architecture diagrams where one of us will have more understanding of the component than the other.

#### Pair programming.
As there are many aspects to this project which neither of us have much experience with we will be doing independent learning in our own time and a lot of pair programming where we will apply what we learned to keep each other up to speed
as well as to ensure the workload has been spread fairly and evenly. Another upside of this is that both of us will benefit from learning together.
## Example

> Example: Here's how you can include images in markdown documents...

<!-- Basically, just use HTML! -->

<p align="center">
  <img src="./res/cat.png" width="300px">
</p>

