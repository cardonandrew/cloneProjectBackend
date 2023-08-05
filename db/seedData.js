const client = require("./client");
const {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
} = require("./users");
const { createPost, getAllPosts, getPostById, updatePost } = require("./posts");

async function dropTables() {
  // drop all tables, in the correct order
  try {
    await client.query(`
      DROP TABLE IF EXISTS posts CASCADE;
      DROP TABLE IF EXISTS users;
  `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.log("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  // create all tables, in the correct order
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        firstname varchar (255),
        lastname varchar (255),
        email varchar (255),
        "isVerified" BOOLEAN DEFAULT false,
        "profileImage" varchar (255)
      );
        CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        username varchar(255) NOT NULL,
        tweet TEXT NOT NULL,
        "imageUrl" varchar (255),
        "isVerified" BOOLEAN DEFAULT false,
        "profileImage" varchar (255),
        "userId" INTEGER REFERENCES users(id)
      );
       
    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.log("Error building Tables!");
    throw error;
  }
}

async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const usersToCreate = [
      {
        username: "albert",
        password: "bertie99",
        email: "albert@gmail.com",
      },
      {
        username: "sandra",
        password: "sandra123",
        email: "sandra@gmail.com",
      },
      {
        username: "glamgal",
        password: "glamgal123",
        email: "glamgal@gmail.com",
      },
    ];
    const users = await Promise.all(usersToCreate.map(createUser));

    console.log("Users created:");
    console.log(users);
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}
async function createInitialPosts() {
  try {
    console.log("Starting to create Posts...");

    const postsToCreate = [
      {
        username: "glamgal",
        tweet:
          "👩‍💻🚀 Just turned caffeine into code! This late-night coding session has me feeling like a wizard 🧙‍♂️, conjuring software spells to make the world a better place! 💻✨ #LateNightCoder #CodingWizardry #TechMagic",
        isVerified: true,
        imageUrl: "",
        profileImage:
          "https://images.pexels.com/photos/17604653/pexels-photo-17604653/free-photo-of-young-man-lying-on-the-beach.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
      {
        username: "glamgal",
        tweet:
          "Never underestimate the power of perseverance and determination. In the face of challenges, keep moving forward with unwavering resolve. Each step you take brings you closer to your goals. Embrace the journey, learn from every experience, and let your determination fuel your success. #Inspiration #Motivation #KeepGoing",
        isVerified: true,
        imageUrl: "",
        profileImage:
          "https://images.pexels.com/photos/16773707/pexels-photo-16773707/free-photo-of-man-in-cap-posing.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
      {
        username: "glamgal",
        tweet:
          "Just had a Eureka moment in the shower! 💡 Turns out, my best ideas are water-activated! Who needs a brainstorm when you can have a rainstorm of creativity? ☔️🚿 #ShowerThoughts #EurekaMoment #CreativeFlow",
        isVerified: false,
        imageUrl:
          "https://images.pexels.com/photos/1476321/pexels-photo-1476321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        profileImage:
          "https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
      {
        username: "glamgal",
        tweet:
          "Life is like a box of chocolates 🍫❤️ You never know what you're gonna get, but I'm grateful to have you by my side through the sweet surprises and the nutty moments! 😘 #LifeIsSweet #GratefulHeart #LoveYou",
        isVerified: true,
        imageUrl:
          "https://images.pexels.com/photos/1415131/pexels-photo-1415131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        profileImage:
          "https://images.pexels.com/photos/3754259/pexels-photo-3754259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
      {
        username: "glamgal",
        tweet: "CODING IS SO FUN🤪",
        isVerified: false,
        imageUrl:
          "https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        profileImage:
          "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
      {
        username: "glamgal",
        tweet:
          "Just discovered the ultimate formula for successful software development: 90% perspiration, 10% inspiration, and 100% googling! 💻🔍 #CodingWisdom #SoftwareDevelopment",
        isVerified: true,
        imageUrl: "",
        profileImage:
          "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
    ];
    const posts = await Promise.all(postsToCreate.map(createPost));

    console.log("posts created:");
    console.log(posts);

    console.log("Finished creating posts!");
  } catch (error) {
    console.error("Error creating posts!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to TEST database...");

    console.log("Calling getUser");
    const user = await getUser("albert", "bertie99");
    console.log("Testing result getUser:", user);

    console.log("Calling getUserById with id 1");
    const userById = await getUserById(1);
    console.log("Testing Result getUserById", userById);

    console.log("Calling getUserByUsername");
    const userByUsername = await getUserByUsername("albert");
    console.log("Testing result getUserByUsername", userByUsername);

    console.log("Calling getAllPosts");
    const allPosts = await getAllPosts();
    console.log("Testing Result getAllPosts:", allPosts);

    console.log("Calling getPostById 1");
    const postById = await getPostById(1);
    console.log("Testing Result getPostById 1", postById);

    console.log("Calling updatePost on post[1], only updating price");
    const updatedPost = await updatePost(1, { username: "eddie" });
    console.log("Testing Result updatePost", updatedPost);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error testing database");
    throw error;
  }
}

module.exports = {
  rebuildDB,
  testDB,
  dropTables,
  createTables,
};
