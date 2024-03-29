const Joi = require("@hapi/joi");
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" }
];

// GET methods
app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send(`Requested ID: ${req.params.id} does not exist`);
  res.send(course);
});

//POST methods
app.post("/api/courses", (req, res) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required()
  });

  var result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

//PUT Method
app.put("/api/courses/:id", (req, res) => {
  //Valid Id
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send(`Requested ID: ${req.params.id} does not exist`);
    return;
  }

  //Valid input
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required()
  });

  var result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  //Update the id
  course.name = req.body.name;
  res.send(course);
});

//Delete method
app.delete("/api/courses/:id", (req, res) => {
  //Valid Id
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send(`Requested ID: ${req.params.id} does not exist`);
    return;
  }

  const idx = courses.indexOf(course);
  const del_course = courses.splice(idx, 1);
  res.send(del_course);
});

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}..`));
