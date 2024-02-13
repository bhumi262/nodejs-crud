import express from 'express';
import userData from '../model/user.js';
const router = express.Router();

// Render the form template
router.get('/', async(req, res) => {
    userData.find().exec()
        .then(users => {
            res.render('main', { users: users });
        })
        .catch(err => {
            res.json({ message: err.message });
        });
});


router.get('/add', (req, res) => {
    res.render('add_user');
});

// Handle form submission and store data in the database
router.post('/add', async (req, res) => {
    try {
        // Check if a user with the same email already exists
        const existingUser = await userData.findOne({ email: req.body.email });

        if (existingUser) {
            // If a user with the same email already exists, return an error
            return res.status(400).json({ message: 'User with this email already exists', type: 'danger' });
        }

        // Create a new user object using the data from the form
        const newUser = new userData({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            product: req.body.product
        });

        // Save the new user object to the database
        await newUser.save();

        // Set a success message in the session
        req.session.message = {
            type: 'success',
            message: 'User added successfully'
        };

        // Redirect back to the main page
        res.redirect('/');
    } catch (error) {
        // Send an error response if something goes wrong
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        // Find the user by ID
        const user = await userData.findById(req.params.id);

        if (!user) {
            // If user is not found, return a 404 status and render an error page
            return res.status(404).render('error', { message: 'User not found' });
        }

        // If user is found, render the edit page with the user data
        res.render('edit_user', { user: user });
    } catch (error) {
        // If an error occurs, log the error and render an error page
        console.error("Error finding user:", error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
});
router.post('/update/:id', async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id)

        await userData.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            product: req.body.product
        });
         console.log(userData)
        // Set a success message in the session
        req.session.message = {
            type: 'success',
            message: 'User updated successfully'
        };

        // Redirect back to the main page
        res.redirect('/');
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
});
router.get('/delete/:id', async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id);

        // Find the user by ID and delete it
        await userData.findByIdAndDelete(id);
        console.log(userData);

        // Set a success message in the session
        req.session.message = {
            type: 'success',
            message: 'User deleted successfully'
        };

        // Redirect back to the main page
        res.redirect('/');
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
});

export default router;
