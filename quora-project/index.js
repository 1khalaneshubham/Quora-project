const express = require('express');
const app = express();
const port = 8080;

const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Sample initial posts
let posts = [
    {
        id: uuidv4(),
        username: "stay hard",
        contant: "Motivation is what gets you started. Habit is what keeps you going. Stay consistent and watch yourself grow! #motivation #consistency"
    },
    {
        id: uuidv4(),
        username: "Work hard",
        contant: "The only place where success comes before work is in the dictionary. Put in the effort today for a better tomorrow. 💪 #hardwork #success"
    },
    {
        id: uuidv4(),
        username: "Keep learning",
        contant: "Learning is a treasure that will follow its owner everywhere. Never stop exploring, never stop growing. 📚 #growthmindset #lifelonglearning"
    },
    {
        id: uuidv4(),
        username: "Go with flow",
        contant: "Sometimes the best thing you can do is not think, not wonder, not imagine, not obsess. Just breathe and have faith that everything will work out. 🌊 #mindfulness #peace"
    },
    {
        id: uuidv4(),
        username: "CodeMaster",
        contant: "Debugging is like being the detective in a crime movie where you are also the murderer. Keep calm and console.log! 👨‍💻 #programming #webdev"
    },
    {
        id: uuidv4(),
        username: "Traveler_01",
        contant: "Travel isn't always pretty. It isn't always comfortable. But that's okay. The journey changes you; it should change you. ✈️ #wanderlust #adventure"
    },
    {
        id: uuidv4(),
        username: "FitnessGuru",
        contant: "The body achieves what the mind believes. One day or day one – you decide. 🏋️ #fitness #healthylifestyle"
    },
    {
        id: uuidv4(),
        username: "BookWorm",
        contant: "A room without books is like a body without a soul. Currently reading 'The Alchemist' - highly recommended! 📖 #reading #books"
    }
];

// Routes

// Home page
app.get('/', (req, res) => {
    res.redirect('/posts');
});

// Get all posts
app.get('/posts', (req, res) => {
    res.render("index.ejs", { posts });
});

// New post form
app.get('/posts/new', (req, res) => {
    res.render("new.ejs");
});

// Create new post
app.post('/posts', (req, res) => {
    try {
        let id = uuidv4();
        let username = req.body.username.trim();
        let contant = req.body.content ? req.body.content.trim() : '';

        if (!username || !contant) {
            throw new Error('Username and content are required');
        }

        posts.unshift({  // Add to beginning to show latest first
            id: id,
            username: username,
            contant: contant
        });

        res.redirect('/posts');
    } catch (error) {
        console.error(error);
        res.status(400).send('Error creating post: ' + error.message);
    }
});

// View single post
app.get("/posts/:id", (req, res) => {
    try {
        let { id } = req.params;
        let post = posts.find((p) => id === p.id);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        res.render("show.ejs", { post });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Edit post form
app.get("/posts/:id/edit", (req, res) => {
    try {
        let { id } = req.params;
        let post = posts.find((p) => id === p.id);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        res.render("edit.ejs", { post });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Update post
app.patch("/posts/:id", (req, res) => {
    try {
        let { id } = req.params;
        let newContent = req.body.content ? req.body.content.trim() : '';
        let post = posts.find((p) => id === p.id);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        if (!newContent) {
            throw new Error('Content cannot be empty');
        }

        post.contant = newContent;
        res.redirect("/posts");
    } catch (error) {
        console.error(error);
        res.status(400).send('Error updating post: ' + error.message);
    }
});

// Delete post
app.delete("/posts/:id", (req, res) => {
    try {
        let { id } = req.params;
        const initialLength = posts.length;
        posts = posts.filter((p) => p.id !== id);

        if (posts.length === initialLength) {
            return res.status(404).send('Post not found');
        }

        res.redirect("/posts");
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// API endpoints for potential future use
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (post) {
        res.json(post);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { message: 'Page not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📝 View posts at: http://localhost:${port}/posts`);
    console.log(`➕ Create new post at: http://localhost:${port}/posts/new`);
});