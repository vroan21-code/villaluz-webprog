/**
 * Seed script: loads users and articles into the webprog database.
 * Run with: npm run seed
 */
require('dotenv').config();
const dns = require('dns');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Article = require('./models/Article');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const seedUsers = [
  {
    firstName: 'Roan',
    lastName: 'Villaluz',
    username: 'roanvillaluz',
    age: '21',
    gender: 'Male',
    contactNumber: '09171234567',
    email: 'vroan21@gmail.com',
    type: 'admin',
    password: 'password123',
    address: 'N/A',
    isActive: true,
  },
  {
    firstName: 'Christiana Kyle',
    lastName: 'Dela Cruz',
    username: 'christianakyle',
    age: '34',
    gender: 'Female',
    contactNumber: '09189876543',
    email: 'ckdelacruz@gmail.com',
    type: 'viewer',
    password: 'password123',
    address: 'N/A',
    isActive: true,
  },
  {
    firstName: 'Ahldrin',
    lastName: 'Alarcon',
    username: 'ahldrinalarcon',
    age: '26',
    gender: 'Male',
    contactNumber: '09165550123',
    email: 'aalarcon@gmail.com',
    type: 'editor',
    password: 'password123',
    address: 'N/A',
    isActive: false,
  },
  {
    firstName: 'Danrome',
    lastName: 'Beltran',
    username: 'danromebeltran',
    age: '31',
    gender: 'Male',
    contactNumber: '09173336677',
    email: 'dabeltran@gmail.com',
    type: 'admin',
    password: 'password123',
    address: 'N/A',
    isActive: true,
  },
  {
    firstName: 'Denver',
    lastName: 'Mananghaya',
    username: 'denvermananghaya',
    age: '29',
    gender: 'Male',
    contactNumber: '09192224488',
    email: 'dmananghaya@gmail.com',
    type: 'viewer',
    password: 'password123',
    address: 'N/A',
    isActive: false,
  },
  {
    firstName: 'John Carlo',
    lastName: 'Ocray',
    username: 'johnocray',
    age: '33',
    gender: 'Male',
    contactNumber: '09178889900',
    email: 'jocray@gmail.com',
    type: 'editor',
    password: 'password123',
    address: 'N/A',
    isActive: true,
  },
];

const seedArticles = [
  {
    name: 'Web-Development-101',
    title: 'Getting Started with Web Development',
    image: '/webdev.jpg',
    content: [
      'Web development is one of the most in-demand skills today, especially for students in the IT field. It involves building websites using core technologies such as HTML, CSS, and JavaScript.',
      'HTML is used to structure the content, CSS is responsible for design and layout, and JavaScript adds interactivity to your website. Understanding how these three work together is the foundation of becoming a web developer.',
      '<h1>Hello World</h1> \n<p>This is my first website</p>',
      'As you progress, you can explore frameworks like React to build more dynamic and scalable applications.',
    ],
  },
  {
    name: 'building-projects-importance',
    title: 'Why Building Projects is Important for Students',
    image: '/projimport.webp',
    content: [
      'For students, learning theory is not enough. Building real projects helps improve problem-solving skills and gives hands-on experience in development.',
      'Projects like e-commerce systems, navigation apps, or portfolio websites allow students to apply what they have learned in a practical way. It also helps in building a strong portfolio that can be shown to future employers.',
      'Example Projects: \n• Portfolio Website\n• Online Store System\n• Mobile Navigation App',
      'By consistently building projects, students can gain confidence and prepare themselves for real-world challenges in the tech industry.',
    ],
  },
  {
    name: 'why-student-projects-fail',
    title: 'Why Most Student Projects Fail',
    image: '/projfail.jpg',
    content: [
      'Many student projects fail not because of lack of skills, but because of poor planning and unclear objectives. Students often focus too much on design without solving a real problem, which results in projects that look good but lack functionality.',
      'Another common issue is rushing development due to deadlines. Without proper testing and structure, systems become unstable and difficult to present.',
      'Common Mistakes: \n• No clear problem to solve\n• Poor time management\n• Lack of testing\n• Focusing only on UI',
      'By improving planning and focusing on real-world problems, students can create more meaningful and successful projects.',
    ],
  },
  {
    name: 'from-idea-to-system',
    title: 'From Idea to System: Turning Concepts into Real Projects',
    image: '/idea.jpg',
    content: [
      'Turning an idea into a working system is one of the most important skills for IT students. It starts with identifying a problem, followed by planning the features and designing how the system will work.',
      'After planning, development begins by building the frontend and backend components. Testing is also a critical step to ensure that the system works properly and meets user needs.',
      'Development Process: \n• Identify the problem\n• Plan features and system flow\n• Design interface (UI/UX)\n• Develop the system\n• Test and improve',
      'Following a structured process makes projects more organized and easier to complete successfully.',
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const dbName = mongoose.connection.name;
    console.log(`Connected to MongoDB (database: ${dbName})`);

    await User.deleteMany({});
    for (const user of seedUsers) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    await User.insertMany(seedUsers);
    console.log(`Inserted ${seedUsers.length} documents into ${dbName}.users`);

    await Article.deleteMany({});
    await Article.insertMany(seedArticles);
    console.log(`Inserted ${seedArticles.length} documents into ${dbName}.articles`);

    await mongoose.disconnect();
    console.log('Seed complete. In Atlas: Browse Collections → webprog → users / articles');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
