const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

const courses = [
  { id: 1, name: 'course1'},
  { id: 2, name: 'course2'},
  { id: 3, name: 'course3'},
];
app.get('/', (req, res) => {
  res.send('Test messages');
});

app.get('/api/courses', (req, res) => {
  // Return a sample array, this would be an endpoint to return db objects for example
  res.send(courses);
});

// Get courses by id
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  // 404 if resource is not found
  if (!course) {
    return res.status(404).send('The course with the given id was not found');
  }
  res.send(course);
});

// Use post request to create a new course and add to our array
app.post('/api/courses', (req, res) => {
  // Joi validation schema
  // const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); // result.error
  if(error) {
    return res.status(400).send(error.details[0].message);
  }

  const course = {
    // Manually set id since we're not working with a db here
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

// Use put to update resources
app.put('/api/courses/:id', (req, res) => {
  // Look up course, if it doesn't exist, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send('The course with the given id was not found');
  }

  // Then validate, if invalid, return 400
  // const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); // result.error
  if(error) {
    return res.status(400).send(error.details[0].message);
  }

  // Update course and return the updated course
  course.name = req.body.name;
  res.send(course);
});


function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(course, schema);
}

// Delete to delete resources
app.delete('/api/courses/:id', (req, res) => {
  // Look up course, if it doesnt exist, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send('The course with the given id was not found');
  }

  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return same course
  res.send(course);
});

// app.get('/api/posts/:year/:month', (req, res) => {
//   res.send(req.query);
// });

// PORT
// If we have an port environment variable, use that, else use arbitrary dev port.
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
