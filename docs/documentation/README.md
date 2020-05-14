Place your user manual and technical documentation in this directory.

PDF is the preferred format.

The first page of each document should contain at least:

- your names,
- your project title,
- the type of document (e.g. *Technical Manual*)
- your student IDs, and
- the date you finished working on the document.

In addition, the file names you choose to use should make clear what the document content is.

**The final version of your documents should be converted to PDF and stored in this same directory**

*Do not place any other files in this directory.*

This is a project undertaken by Alexander Cahll and Liam O Cearbhaill.
The aim of this project is to implement a boids algorithm and achieving multiple
users within a single instance with the use of websockets.
# ==============================
It is worth noting here that due to the lack of documentation with regards to socekt.io
multiple errors have been encountered which were found to be unavoidable.
Some errors thrown are known issues with socket.io however they have never been
addressed. What this means is that certain functions could not be imported for
unit testing. As such, functions have been recreated to allow for such testing,
however this means that test driven development was never on the cards for this
project. We both wish that socket.io would have more comprehensive documentation
as on paper it looks useful and easy to use while in reality it turns out to be
a headache.
We found StackOverflow to contain more useful information than socket.io's own
official documentation.
# ==============================

This project aims to recreate flocking mechanics and display multi-user environments.
We have chosen to wrap these up in a game as we felt that this best portrayed
the different systems we wished to create the best. We also believe that this way
is the best way forward in terms of keeping user engagement and providing a purpose
to encompass all of the technologies.
Due to the technologies we have chosen, this project will run over the web using
OpenGL and running on an EC2 instance.
Users will be able to access the project given a link. Due to the nature of OpenGL
becoming supported on the vast majority of devices both desktop and mobile, there
are few compatability issues which arise. This allows our project to be versatile
and run on a wide rage of devices, even the phone in your pocket!
