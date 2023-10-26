# Frontend side of project
To run the development server:

```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

## What is this project?
This is the frontend side of Traffic Planner Gadget, a web application I have created for the purpose of learning Typescript. 

## What does this project do?
In this version of Traffic Planner Gadget you can search for Göteborg public transport journeys using the Västtrafik Developer API (https://developer.vasttrafik.se).

Seven journeys will be fetched and rendered by the application, and you can see detailed journey information for each journey.

## Is the final version?
Not really. I plan to add more useful functionality to make use of what the Västtrafik Developer API provides, and because it is fun.

### Like what?
* Plan your journey by selecting departure or arrival timestamps to your search.
* Display next departures from origin stop (without having to add a destination).
* Utilize Tanstack React-Query to check if data is stale and refetch accordingly.
