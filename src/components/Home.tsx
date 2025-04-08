import React from 'react';
import NavBar from './NavBar';

const Home: React.FC = () => {
    return (
        <div>
            <NavBar/>
            <header>
                <h1>Welcome to House Rentals</h1>
            </header>
            <main>
                <p>Find your perfect rental home here.</p>
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} House Rentals</p>
            </footer>
        </div>
    );
};

export default Home;