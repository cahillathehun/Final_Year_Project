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

The rendering of the Boids will be done client-side on the browser using Javascript. The server will mainly deal with instances of when Boids cross over into a different territory; letting the other client know the coordinates and heading of the flock so that it knows what to render and where.



### Outline

> Outline the proposed project.

Our proposed project is to make a multiplayer game where players have to chase flocks of animals from their screen to their opponent's screen using their cursor, or their finger in the case of touch screen phones/tablets.

There is scope in the project to also use the capabilities built into modern phones and tablets. Flocking could be controlled using the gyroscopes or accelerometers in the devices.

The flock's behaviour will be implemented using Boids as they flock together and avoid obstacles (the cursor).

### Background

> Where did the ideas come from?

The fact that we had completed an "Ant colony simulation" had inspired us to steer away from simple food/enemy based pathfinding to BOIDS.
The learning that had resulted directly from working on the Ant Colony intrigued and highly interested both of us.
The pathfinding in the ant colony simulation was very basic and each ant only "thought" about it's own best interests, with BOIDS the emphasis is on large flocking behaviours.

We originally found the idea to include the use of Boids in our project by looking at Marija Brezbadica's website, but as she will not be around in  the second semester she is unable to take on any final year projects. We then went to other lecturers and professors in the school of computing and found one who was interested and willing to take us on.

### Achievements

> What functions will the project provide? Who will the users be?

The program will be a simulation using BOIDS to simulate flocking behaviours, demonstrating a form of swarm intelligence.

This program will also be demonstrating multiple users being hosted on a single instance.

We anticipate the main users to be other students and people who may want to demonstrate Boids algorithm we intend to make.


### Justification

> Why/when/where/how will it be useful?

The justification for doing this project will be mostly academic; to further our understanding of artificial intelligence/life algorithms as our previous project made use of swarm intelligence algorithms. We are also interested in the graphical aspect of this project, again building on our knowledge from last year, the challenge of using 3D graphics will help us in this area. 



### Programming language(s)

> List the proposed language(s) to be used.

The primary languages we intend to use are Javascript for client side graphical rendering and NodeJS for communication between clients and the server. We will also be making use of external graphical libraries gotten from Three.js, an open source JavaScript library that uses WebGL.



### Programming tools / Tech stack

> Describe the compiler, database, web server, etc., and any other software tools you plan to use.

SocketIO is what we plan to use from connectivity. It is an open source library that allows real time bi-directional communication between clients and servers.
It has a server side library for NodeJS and client side library that runs within the browser.

This is exactly what we need for this project as we require real time communication between clients and servers.

After some development we plan to move hosting from our local machines to either an Amazon EC2 instance or to Digital Ocean. Using an Amazon EC2 instance is preferable primarily because there is a free version that will has more than enough capability to handle the needs of this project.

IntelliJ IDE is what we plan to do most of the development on.

### Hardware

> Describe any non-standard hardware components which will be required.

We will be using our own machines for hosting and development, and also the lab machines in DCU for development.

There are no hardware requirements beyond these and no non-standard hardware requirements.


### Learning Challenges

> List the main new things (technologies, languages, tools, etc) that you will have to learn.

The main new challenge facing us is the networking aspect of the project. We have only encountered a limited amount of this before so most of what we will be undertaking in this area will be new to us. We look forward to gaining more knowledge in networking and sockets.

Another new area we will encounter is the graphical aspect of the project. In our 3rd year project we had limited experience simple 2d graphics using PyGame, which is very limited in complexity. With this project we will be using 3d models from external libraries, namely Three.js.

Although the writing of the Boids algorithm will be somewhat new to us, some of the skills used to write the pathfinding algorithms in our 3rd year project will be transferrable.



### Breakdown of work



#### Student 1 (Liam)

> *Liam*
>
As I have experience working with UI from my internship (Angular) I have opted to dive into learning and becoming comfortable with three.js.
I realise these will be worlds apart, however as neither of us have any direct experience in this field I am happy to take responsibility for it.
#### Student 2 (Alex)

> *Alex*

As I have experience with NodeJS and Javascript, which is what we'll being using in to handle communication between the clients and server with the Socket.IO library, I will be taking most responsibility for the networking and server side work.

We will be undertaking the completion of the documentation for the project together, except for some parts that require architecture diagrams where one of us will have more understanding of the component than the other.

#### Pair programming.
As there are many aspects to this project which neither of us have much experience with we will be doing independent learning in our own time and a lot of pair programming where we will apply what we learned to keep each other up to speed
as well as to ensure the workload has been spread fairly and evenly.
 One aspect we hope to work closest together on is the writing of the algorithms for the Boids.

 The upside of this is that both of us will benefit from learning together.
