import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Facebook, Twitter, Instagram } from 'lucide-react';

const destinations = [
  { id: 1, name: 'Bali, Indonesia', image: '/api/placeholder/800/600', price: '$1,299' },
  { id: 2, name: 'Paris, France', image: '/api/placeholder/800/600', price: '$1,599' },
  { id: 3, name: 'Santorini, Greece', image: '/api/placeholder/800/600', price: '$1,799' },
];

const tours = [
  { id: 1, name: 'Mountain Hiking', image: '/api/placeholder/400/300', price: '$299', category: 'adventure' },
  { id: 2, name: 'City Tour', image: '/api/placeholder/400/300', price: '$199', category: 'city' },
  { id: 3, name: 'Beach Relaxation', image: '/api/placeholder/400/300', price: '$399', category: 'relaxation' },
  { id: 4, name: 'Safari Adventure', image: '/api/placeholder/400/300', price: '$599', category: 'adventure' },
];

const testimonials = [
  { id: 1, name: 'John Doe', text: 'Amazing experience! The tour was well-organized and exceeded our expectations.' },
  { id: 2, name: 'Jane Smith', text: 'Unforgettable journey. The attention to detail and luxury accommodations were top-notch.' },
  { id: 3, name: 'Mike Johnson', text: "Our guide was knowledgeable and friendly. We'll definitely book again!"},
];

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredTours = selectedCategory === 'all' 
    ? tours 
    : tours.filter(tour => tour.category === selectedCategory);

  return (
    <div className="font-sans text-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted className="absolute w-full h-full object-cover">
          <source src="/api/placeholder/1920/1080" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-white text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Your Next Adventure</h1>
          <p className="text-xl mb-8">Explore the world with luxury and style</p>
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex space-x-4">
              <input type="text" placeholder="Where to?" className="flex-1 p-2 rounded text-gray-900" />
              <input type="date" className="p-2 rounded text-gray-900" />
              <select className="p-2 rounded text-gray-900">
                <option>Trip Type</option>
                <option>Adventure</option>
                <option>Relaxation</option>
                <option>Cultural</option>
              </select>
              <button className="bg-turquoise-500 text-white px-4 py-2 rounded hover:bg-turquoise-600 transition duration-300">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-turquoise-500">TravelLux</div>
            <div className="hidden md:flex space-x-6">
              <a href="#destinations" className="hover:text-turquoise-500 transition duration-300">Destinations</a>
              <a href="#tours" className="hover:text-turquoise-500 transition duration-300">Tours</a>
              <a href="#testimonials" className="hover:text-turquoise-500 transition duration-300">Testimonials</a>
              <a href="#" className="hover:text-turquoise-500 transition duration-300">About</a>
              <a href="#" className="hover:text-turquoise-500 transition duration-300">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Featured Destinations */}
      <section id="destinations" className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <div key={dest.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                <img src={dest.image} alt={dest.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{dest.name}</h3>
                  <p className="text-gray-600">Starting from {dest.price}</p>
                  <button className="mt-4 bg-turquoise-500 text-white px-4 py-2 rounded hover:bg-turquoise-600 transition duration-300">
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tours */}
      <section id="tours" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Tours</h2>
          <div className="flex justify-center space-x-4 mb-8">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded ${selectedCategory === 'all' ? 'bg-turquoise-500 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button 
              onClick={() => setSelectedCategory('adventure')}
              className={`px-4 py-2 rounded ${selectedCategory === 'adventure' ? 'bg-turquoise-500 text-white' : 'bg-gray-200'}`}
            >
              Adventure
            </button>
            <button 
              onClick={() => setSelectedCategory('city')}
              className={`px-4 py-2 rounded ${selectedCategory === 'city' ? 'bg-turquoise-500 text-white' : 'bg-gray-200'}`}
            >
              City
            </button>
            <button 
              onClick={() => setSelectedCategory('relaxation')}
              className={`px-4 py-2 rounded ${selectedCategory === 'relaxation' ? 'bg-turquoise-500 text-white' : 'bg-gray-200'}`}
            >
              Relaxation
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredTours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={tour.image} alt={tour.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{tour.name}</h3>
                  <p className="text-gray-600 mb-4">Starting from {tour.price}</p>
                  <button className="w-full bg-gold-500 text-white px-4 py-2 rounded hover:bg-gold-600 transition duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-turquoise-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Travelers Say</h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg mb-4">"{testimonials[currentTestimonial].text}"</p>
              <p className="font-semibold">- {testimonials[currentTestimonial].name}</p>
            </div>
            <div className="flex justify-center mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    currentTestimonial === index ? 'bg-turquoise-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-turquoise-600 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-8">Explore our destinations and book your dream vacation today!</p>
          <button className="bg-white text-turquoise-600 px-8 py-3 rounded-lg text-xl font-semibold hover:bg-gray-100 transition duration-300 animate-pulse">
            Start Your Adventure
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">TravelLux</h3>
              <p>Discover the world with luxury and style.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-turquoise-500 transition duration-300">About Us</a></li>
                <li><a href="#" className="hover:text-turquoise-500 transition duration-300">Destinations</a></li>
                <li><a href="#" className="hover:text-turquoise-500 transition duration-300">Tours</a></li>
                <li><a href="#" className="hover:text-turquoise-500 transition duration-300">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p>1234 Travel Lane</p>
              <p>Adventure City, TC 56789</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: info@travellux.com</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="mb-4">Subscribe to our newsletter for the latest travel deals and tips.</p>
              <form className="flex">
                <input type="email" placeholder="Your email" className="flex-grow p-2 rounded-l text-gray-900" />
                <button type="submit" className="bg-turquoise-500 text-white px-4 py-2 rounded-r hover:bg-turquoise-600 transition duration-300">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 flex justify-between items-center">
            <p>&copy; 2024 TravelLux. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-turquoise-500 transition duration-300"><Facebook /></a>
              <a href="#" className="text-2xl hover:text-turquoise-500 transition duration-300"><Twitter /></a>
              <a href="#" className="text-2xl hover:text-turquoise-500 transition duration-300"><Instagram /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;